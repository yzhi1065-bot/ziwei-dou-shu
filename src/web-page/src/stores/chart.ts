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

const MUTAGEN_TYPES = ['禄','权','科','忌']

/** 宫位内所有星曜名 */
function palaceStars(p: any): string[] {
  return [...(p.majorStars||[]), ...(p.minorStars||[])].map((s:any) => s.name)
}

/** 四化星落在哪个宫（Map索引O(1)） */
function buildStarPalaceMap(astrolabe: any): Map<string, any> {
  const map = new Map<string, any>()
  astrolabe.palaces.forEach((pp: any) => {
    palaceStars(pp).forEach((name) => { if (!map.has(name)) map.set(name, pp) })
  })
  return map
}

/**
 * 提取本命自化箭头
 * 规则：本宫宫干催动本宫星曜→离心out；星在对宫→向心in
 */
export function extractSelfArrows(astrolabe: any): SelfArrow[] {
  const arrows: SelfArrow[] = []
  astrolabe.palaces.forEach((p: any) => {
    const bi = EB.indexOf(p.earthlyBranch)
    MUTAGEN_TYPES.forEach((mt) => {
      try {
        if (p.selfMutaged?.([mt])) {
          const idx = MUTAGEN_TYPES.indexOf(mt)
          const starName = GAN_HUA_TABLE[p.heavenlyStem]?.[idx] || ''
          const allHere = palaceStars(p).includes(starName)
          arrows.push({ palaceBranch: bi, type: mt as any, direction: allHere ? 'out' : 'in', starName })
        }
      } catch {}
    })
  })
  return arrows
}

/**
 * 提取本命飞星四化连线（每宫天干四化→目标宫）
 */
export function extractFlyLines(astrolabe: any): FlyLine[] {
  const lines: FlyLine[] = []
  const starPalaceMap = buildStarPalaceMap(astrolabe)
  const seen = new Set<string>()
  astrolabe.palaces.forEach((p: any) => {
    const fromBi = EB.indexOf(p.earthlyBranch)
    const stars4 = GAN_HUA_TABLE[p.heavenlyStem] || []
    stars4.forEach((starName, si) => {
      const target = starPalaceMap.get(starName)
      if (target && target !== p) {
        const key = `${fromBi}-${EB.indexOf(target.earthlyBranch)}-${MUTAGEN_TYPES[si]}`
        if (seen.has(key)) return
        seen.add(key)
        lines.push({
          fromBranch: fromBi,
          toBranch: EB.indexOf(target.earthlyBranch),
          type: MUTAGEN_TYPES[si] as any,
          layer: '命',
        })
      }
    })
  })
  return lines
}

/** 当前年龄所在大限宫 */
function currentDecadePalace(astrolabe: any, age: number): any {
  return astrolabe.palaces.find((p: any) => {
    if (!p.decadal) return false
    const [s, e] = p.decadal.range
    return age >= s && age <= e
  })
}

/**
 * 提取大限四化飞线（当前大限宫干四化）
 */
export function extractDecadeFly(astrolabe: any, age: number): FlyLine[] {
  const lines: FlyLine[] = []
  const starPalaceMap = buildStarPalaceMap(astrolabe)
  const decade = currentDecadePalace(astrolabe, age)
  if (!decade?.decadal) return lines
  const fromBi = EB.indexOf(decade.earthlyBranch)
  const stars4 = GAN_HUA_TABLE[decade.decadal.heavenlyStem] || []
  stars4.forEach((starName, si) => {
    const target = starPalaceMap.get(starName)
    if (target && target !== decade) {
      lines.push({
        fromBranch: fromBi, toBranch: EB.indexOf(target.earthlyBranch),
        type: MUTAGEN_TYPES[si] as any, layer: '限',
      })
    }
  })
  return lines
}

/**
 * 提取大限命宫自化箭头
 */
export function extractDecadeSelfArrows(astrolabe: any, age: number): SelfArrow[] {
  const arrows: SelfArrow[] = []
  const decade = currentDecadePalace(astrolabe, age)
  if (!decade?.decadal) return arrows
  const stars4 = GAN_HUA_TABLE[decade.decadal.heavenlyStem] || []
  stars4.forEach((starName, si) => {
    const target = astrolabe.palaces.find((pp: any) => palaceStars(pp).includes(starName))
    if (target) {
      arrows.push({
        palaceBranch: EB.indexOf(target.earthlyBranch),
        type: MUTAGEN_TYPES[si] as any,
        direction: target === decade ? 'out' : 'in',
        starName, layer: '限',
      })
    }
  })
  return arrows
}

/**
 * 提取流年四化飞线 + 流年自化箭头（当年流年天干）
 */
export function extractYearly(astrolabe: any, year: number): { fly: FlyLine[]; selfArrows: SelfArrow[] } {
  const fly: FlyLine[] = []
  const selfArrows: SelfArrow[] = []
  const ystem = getYearStem(year)
  const stars4 = GAN_HUA_TABLE[ystem] || []
  stars4.forEach((starName, si) => {
    const target = astrolabe.palaces.find((pp: any) => palaceStars(pp).includes(starName))
    if (target) {
      fly.push({
        fromBranch: EB.indexOf('寅'), // 流年四化从流年命宫起，简化为寅宫（流年正月）
        toBranch: EB.indexOf(target.earthlyBranch),
        type: MUTAGEN_TYPES[si] as any, layer: '流',
      })
      selfArrows.push({
        palaceBranch: EB.indexOf(target.earthlyBranch),
        type: MUTAGEN_TYPES[si] as any,
        direction: 'out',
        starName, layer: '流',
      })
    }
  })
  return { fly, selfArrows }
}

// 年干计算
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
function getYearStem(year: number): string {
  return STEMS[((year - 4) % 10 + 10) % 10]
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
      // 小时(0-23) → iztro timeIndex(0=子时00:00, 6=午时, 12=晚子时23:00)
      // 例: 0点→0, 12点→6(午时), 23点→12(晚子时)
      const timeIndex = Math.floor((hour + 1) / 2)
      const a = astro.bySolar(`${year}-${month}-${day}`, timeIndex, gender==='男'?'男':'女', true, 'zh-CN')
      rawAstrolabe.value = a

      const sorted = [...a.palaces].sort((a:any,b:any) => EB.indexOf(a.earthlyBranch)-EB.indexOf(b.earthlyBranch))
      const cd = a.rawDates?.chineseDate || {}

      // === 纯函数提取：自化/飞线/大限/流年 ===
      const selfArrows = extractSelfArrows(a)
      const flyLines = extractFlyLines(a)
      const age = new Date().getFullYear() - year + 1
      const decadeFly = extractDecadeFly(a, age)
      const decadeSelfArrows = extractDecadeSelfArrows(a, age)
      const nowY = new Date().getFullYear()
      const { fly: yearlyFly, selfArrows: yearlySelfArrows } = extractYearly(a, nowY)

      const result: ChartDisplayData = {
        fourPillars: { year:(cd.yearly||['','']).join(''), month:(cd.monthly||['','']).join(''), day:(cd.daily||['','']).join(''), hour:(cd.hourly||['','']).join('') },
        elementPhase: a.fiveElementsClass||'', mingMaster: a.soul||'', shenMaster: a.body||'',
        gender, school, solarDate: `${year}-${month}-${day}`, timeRange: a.timeRange||'',
        selfArrows, decadeSelfArrows, yearlySelfArrows,
        flyLines, decadeFly, yearlyFly,
        palaces: sorted.map((p:any) => ({
          name: p.name, stem: p.heavenlyStem||'', branch: p.earthlyBranch||'',
          branchIndex: EB.indexOf(p.earthlyBranch), isShen: p.isBodyPalace||false,
          mainStars: (p.majorStars||[]).map((s:any)=>({name:s.name, brightness:s.brightness||'', mutagen:s.mutagen||''})),
          minorStars: [...(p.minorStars||[]),...(p.adjectiveStars||[])].map((s:any)=>({name:s.name, brightness:s.brightness||'', mutagen:s.mutagen||''})),
          changsheng12: p.changsheng12||'', boshi12: p.boshi12||'', jiangqian12: p.jiangqian12||'', suiqian12: p.suiqian12||'',
          decadal: p.decadal ? { range:p.decadal.range, stem:p.decadal.heavenlyStem||'', branch:p.decadal.earthlyBranch||'' } : null,
          ages: p.ages||[],
        })),
      }
      chartResult.value = result
      return result
    } catch(e) {
      console.error('iztro排盘失败，回退自研算法:', e)
      // fallback: 自研算法
      const { createChart } = await import('@core/chart')
      const chart = createChart({ year, month, day, hour, minute, gender: gender as any, school: 'sanhe' as any })
      chartResult.value = {
        fourPillars: chart.fourPillars, elementPhase: chart.elementPhase,
        mingMaster: chart.mingMaster, shenMaster: chart.shenMaster, gender,
        solarDate: `${year}-${month}-${day}`, selfArrows:[], decadeSelfArrows:[], yearlySelfArrows:[],
        flyLines:[], decadeFly:[], yearlyFly:[],
        palaces: chart.palaces.map((p:any) => ({ name:p.name, stem:p.stem, branch:p.branch, branchIndex:p.branchIndex, isShen:p.isShen,
          mainStars: p.mainStars.map((n:string)=>({name:n})), minorStars:[...p.minorStars,...p.shaStars,...p.miscStars].map((n:string)=>({name:n})),
          changsheng12:'', boshi12:'', jiangqian12:'', suiqian12:'', decadal:null, ages:[],
        })),
      }
      return chartResult.value
    }
  }

  return { chartResult, rawAstrolabe, savedRecords, arrowSettings, generateChart, loadRecords, saveRecord, deleteRecord }
})
