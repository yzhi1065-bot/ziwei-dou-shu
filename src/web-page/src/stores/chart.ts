import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChartDisplayData, ChartRecord, SelfArrow, FlyLine } from '../types'

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
// TODO: 统一索引体系。当前前端展示层统一0-indexed（EB.indexOf返回0-11），
// 自研core算法内部部分模块用1-indexed（子=1），iztro返回中文地支。
// 建议后续将core也统一为0-indexed以消除混用隐患。

// 天干四化表（文墨天机/iztro标准）：天干 → [化禄, 化权, 化科, 化忌]
export const GAN_HUA_TABLE: Record<string, string[]> = {
  '甲':['廉贞','破军','武曲','太阳'], '乙':['天机','天梁','紫微','太阴'],
  '丙':['天同','天机','文昌','廉贞'], '丁':['太阴','天同','天机','巨门'],
  '戊':['贪狼','太阴','右弼','天机'], '己':['武曲','贪狼','天梁','文曲'],
  '庚':['太阳','武曲','太阴','天同'], '辛':['巨门','太阳','文曲','文昌'],
  '壬':['天梁','紫微','左辅','武曲'], '癸':['破军','巨门','太阴','贪狼'],
}

export const useChartStore = defineStore('chart', () => {
  const chartResult = ref<ChartDisplayData | null>(null)
  const rawAstrolabe = ref<any>(null)
  const savedRecords = ref<ChartRecord[]>([])
  // 箭头设置
  const arrowSettings = ref({
    showSelf: true, showFly: true,
    showSelfDecade: true, showSelfYearly: true,
    showDecade: true, showYearly: true,
    mode: 'color' as 'color'|'letter',
    density: 'full' as 'full'|'mini',
  })

  const STORAGE_KEY = 'zw_records'
  const STORAGE_VERSION = 1

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) { savedRecords.value = []; return }
      const parsed = JSON.parse(raw)
      // 版本化：旧格式（纯数组）自动迁移
      savedRecords.value = Array.isArray(parsed) ? parsed : (parsed.records || [])
    } catch {
      savedRecords.value = []
    }
  }

  function saveRecord(record: ChartRecord) {
    loadRecords()
    savedRecords.value.unshift({ id: Date.now(), savedAt: new Date().toLocaleString('zh-CN'), ...record })
    if (savedRecords.value.length > 20) savedRecords.value.length = 20
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, records: savedRecords.value }))
    } catch (e) {
      console.warn('历史记录保存失败（可能超出localStorage容量）:', e)
    }
  }

  function deleteRecord(idx: number) {
    savedRecords.value.splice(idx, 1)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, records: savedRecords.value }))
    } catch (e) {
      console.warn('历史记录删除保存失败:', e)
    }
  }

  async function generateChart(year: number, month: number, day: number, hour: number, minute: number, gender: string = '男', school: string = 'sanhe') {
    try {
      const iz = await import('iztro')
      // 浏览器打包后 iztro 导出在 default 对象里
      const astro = (iz as any).default?.astro || (iz as any).astro
      const a = astro.bySolar(`${year}-${month}-${day}`, hour, gender==='男'?'男':'女', true, 'zh-CN')
      rawAstrolabe.value = a

      const sorted = [...a.palaces].sort((a:any,b:any) => EB.indexOf(a.earthlyBranch)-EB.indexOf(b.earthlyBranch))
      const cd = a.rawDates?.chineseDate || {}

      // === 提取自化信息 ===
      const selfArrows: SelfArrow[] = []
      const MUTAGEN_TYPES = ['禄','权','科','忌']
      a.palaces.forEach((p:any) => {
        const bi = EB.indexOf(p.earthlyBranch)
        MUTAGEN_TYPES.forEach((mt) => {
          try {
            if (p.selfMutaged?.([mt])) {
              // 方向: 星在本宫→离心out, 星在对宫→向心in
              // 用mutagen反向查星名
              let starName = ''
              const idx = MUTAGEN_TYPES.indexOf(mt)
              const entry = Object.entries(GAN_HUA_TABLE).find(([k]) => p.heavenlyStem === k)
              if (entry) starName = entry[1][idx]
              
              // 该星在本宫还是对宫？
              let direction = 'out'
              if (starName) {
                const allHere = [...(p.majorStars||[]), ...(p.minorStars||[])].some((s:any) => s.name === starName)
                if (!allHere) direction = 'in'
              }
              selfArrows.push({ palaceBranch: bi, type: mt, direction, starName })
            }
          } catch {}
        })
      })

      // === 飞星四化连线（每宫天干四化 → 目标宫）===
      const flyLines: FlyLine[] = []
      // 建立星名→宫位索引（O(1)查询替代嵌套find）
      const starPalaceMap = new Map<string, any>()
      a.palaces.forEach((pp: any) => {
        ;[...(pp.majorStars||[]), ...(pp.minorStars||[])].forEach((s: any) => {
          if (!starPalaceMap.has(s.name)) starPalaceMap.set(s.name, pp)
        })
      })
      a.palaces.forEach((p:any) => {
        const fromBi = EB.indexOf(p.earthlyBranch)
        const stars4 = GAN_HUA_TABLE[p.heavenlyStem] || []
        stars4.forEach((starName:string, si:number) => {
          const target = starPalaceMap.get(starName)
          if (target && target !== p) {
            flyLines.push({
              fromBranch: fromBi,
              toBranch: EB.indexOf(target.earthlyBranch),
              type: MUTAGEN_TYPES[si],
              layer: '命',
            })
          }
        })
      })
      // 去重(同起点终点同类型)
      const seen = new Set<string>()
      const uniqueFly = flyLines.filter((fl:any) => {
        const k = `${fl.fromBranch}-${fl.toBranch}-${fl.type}`
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })

      // === 大限四化飞线（当前大限宫干）===
      const decadeFly: FlyLine[] = []
      const age = new Date().getFullYear() - year + 1
      a.palaces.forEach((p:any) => {
        if (!p.decadal) return
        const [s,e] = p.decadal.range
        if (age < s || age > e) return
        const fromBi = EB.indexOf(p.earthlyBranch)
        const stars4 = GAN_HUA_TABLE[p.decadal.heavenlyStem] || []
        stars4.forEach((starName:string, si:number) => {
          const target = a.palaces.find((pp:any) =>
            [...(pp.majorStars||[]), ...(pp.minorStars||[])].some((s:any) => s.name === starName)
          )
          if (target && target !== p) {
            decadeFly.push({
              fromBranch: fromBi, toBranch: EB.indexOf(target.earthlyBranch),
              type: MUTAGEN_TYPES[si], layer: '限',
            })
          }
        })
      })

      // === 大限命宫自化箭头（当前大限宫干 → 命宫自化）===
      const decadeSelfArrows: SelfArrow[] = []
      const decadePalace = a.palaces.find((p:any) => {
        if (!p.decadal) return false
        const [s,e] = p.decadal.range
        return age >= s && age <= e
      })
      if (decadePalace) {
        const dstem = decadePalace.decadal.heavenlyStem
        const dBi = EB.indexOf(decadePalace.earthlyBranch)
        const starsD = GAN_HUA_TABLE[dstem] || []
        starsD.forEach((starName:string, si:number) => {
          const target = a.palaces.find((pp:any) =>
            [...(pp.majorStars||[]), ...(pp.minorStars||[])].some((s:any) => s.name === starName)
          )
          if (target) {
            decadeSelfArrows.push({
              palaceBranch: EB.indexOf(target.earthlyBranch),
              type: MUTAGEN_TYPES[si],
              direction: target === decadePalace ? 'out' : 'in',
              starName, layer: '限',
            })
          }
        })
      }

      // === 流年自化箭头（当年流年天干）===
      const yearlySelfArrows: SelfArrow[] = []
      const nowY = new Date()
      const ystem = getYearStem(nowY.getFullYear())
      const starsYSelf = GAN_HUA_TABLE[ystem] || []
      starsYSelf.forEach((starName:string, si:number) => {
        const target = a.palaces.find((pp:any) =>
          [...(pp.majorStars||[]), ...(pp.minorStars||[])].some((s:any) => s.name === starName)
        )
        if (target) {
          yearlySelfArrows.push({
            palaceBranch: EB.indexOf(target.earthlyBranch),
            type: MUTAGEN_TYPES[si],
            direction: 'out', // 流年自化简化朝外
            starName, layer: '流',
          })
        }
      })
      const yearlyFly: FlyLine[] = []
      const starsY = GAN_HUA_TABLE[ystem] || []
      starsY.forEach((starName:string, si:number) => {
        const target = a.palaces.find((pp:any) =>
          [...(pp.majorStars||[]), ...(pp.minorStars||[])].some((s:any) => s.name === starName)
        )
        if (target) {
          yearlyFly.push({
            fromBranch: EB.indexOf('寅'), // 流年四化从流年命宫起，简化为寅宫（流年正月）
            toBranch: EB.indexOf(target.earthlyBranch),
            type: MUTAGEN_TYPES[si], layer: '流',
          })
        }
      })

      const result: ChartDisplayData = {
        fourPillars: { year:(cd.yearly||['','']).join(''), month:(cd.monthly||['','']).join(''), day:(cd.daily||['','']).join(''), hour:(cd.hourly||['','']).join('') },
        elementPhase: a.fiveElementsClass||'', mingMaster: a.soul||'', shenMaster: a.body||'',
        gender, school, solarDate: `${year}-${month}-${day}`, timeRange: a.timeRange||'',
        sortedBranches: sorted.map((p:any) => EB.indexOf(p.earthlyBranch)),
        // 自化箭头 & 飞线 & 宫位
        selfArrows, decadeSelfArrows, yearlySelfArrows,
        flyLines: uniqueFly, decadeFly, yearlyFly,
        palaces: sorted.map((p:any) => {
          const op = a.palaces.find((op2:any) => op2.earthlyBranch === p.earthlyBranch)
          const selfTypes = selfArrows.filter((sa:any) => sa.palaceBranch === EB.indexOf(p.earthlyBranch)).map((sa:any) => sa.type)
          return {
            name: p.name, stem: p.heavenlyStem||'', branch: p.earthlyBranch||'',
            branchIndex: EB.indexOf(p.earthlyBranch), isShen: p.isBodyPalace||false,
            selfMutagens: selfTypes,
            mainStars: (p.majorStars||[]).map((s:any)=>({name:s.name, brightness:s.brightness||'', mutagen:s.mutagen||'', selfMutagen: selfTypes.includes(s.mutagen)})),
            minorStars: [...(p.minorStars||[]),...(p.adjectiveStars||[])].map((s:any)=>({name:s.name, brightness:s.brightness||'', mutagen:s.mutagen||''})),
            changsheng12: p.changsheng12||'', boshi12: p.boshi12||'', jiangqian12: p.jiangqian12||'', suiqian12: p.suiqian12||'',
            decadal: p.decadal ? { range:p.decadal.range, stem:p.decadal.heavenlyStem||'', branch:p.decadal.earthlyBranch||'' } : null,
            ages: p.ages||[],
          }
        }),
      }
      chartResult.value = result
      return result
    } catch(e) {
      console.error('iztro排盘失败:', e)
      const { createChart } = await import('../../../core/chart')
      const chart = createChart({ year, month, day, hour, minute, gender: gender as any, school: 'sanhe' as any })
      chartResult.value = {
        fourPillars: chart.fourPillars, elementPhase: chart.elementPhase,
        mingMaster: chart.mingMaster, shenMaster: chart.shenMaster, gender,
        solarDate: `${year}-${month}-${day}`, selfArrows:[], flyLines:[],
        palaces: chart.palaces.map((p:any) => ({ name:p.name, stem:p.stem, branch:p.branch, branchIndex:p.branchIndex, isShen:p.isShen, selfMutagens:[],
          mainStars: p.mainStars.map((n:string)=>({name:n})), minorStars:[...p.minorStars,...p.shaStars,...p.miscStars].map((n:string)=>({name:n})),
          changsheng12:'', boshi12:'', jiangqian12:'', suiqian12:'', decadal:null, ages:[],
        })),
      }
      return chartResult.value
    }
  }

  return { chartResult, rawAstrolabe, savedRecords, arrowSettings, generateChart, loadRecords, saveRecord, deleteRecord }
})

// 年干计算
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
function getYearStem(year: number): string {
  return STEMS[((year - 4) % 10 + 10) % 10]
}
