import { defineStore } from 'pinia'
import { ref } from 'vue'

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

export const useChartStore = defineStore('chart', () => {
  const chartResult = ref<any>(null)
  const rawAstrolabe = ref<any>(null)
  const savedRecords = ref<any[]>([])
  // 箭头设置
  const arrowSettings = ref({
    showSelf: true, showFly: true, showDecade: true, showYearly: true, mode: 'color' as 'color'|'letter'
  })

  function loadRecords() {
    try { savedRecords.value = JSON.parse(localStorage.getItem('zw_records') || '[]') } catch { savedRecords.value = [] }
  }

  async function generateChart(year: number, month: number, day: number, hour: number, minute: number, gender: string = '男') {
    try {
      const { astro } = await import('iztro')
      const a = astro.bySolar(`${year}-${month}-${day}`, hour, gender==='男'?'男':'女', true, 'zh-CN')
      rawAstrolabe.value = a

      const sorted = [...a.palaces].sort((a:any,b:any) => EB.indexOf(a.earthlyBranch)-EB.indexOf(b.earthlyBranch))
      const cd = a.rawDates?.chineseDate || {}

      // === 提取自化信息 ===
      const selfArrows:any[] = []
      a.palaces.forEach((p:any) => {
        const stem = p.heavenlyStem
        if (!stem) return
        const MUTAGEN_TYPES = ['禄','权','科','忌']
        MUTAGEN_TYPES.forEach((mt, mi) => {
          try {
            if (p.selfMutaged([mt])) {
              const star = p.majorStars?.[0]?.name || p.minorStars?.[0]?.name || ''
              // 判断方向：星在本宫→离心，在对宫→向心
              const inThisPalace = p.has([star]) 
              selfArrows.push({
                palaceBranch: EB.indexOf(p.earthlyBranch),
                type: mt, idx: mi,
                direction: inThisPalace ? 'out' : 'in',
                starName: star
              })
            }
          } catch {}
        })
      })

      // === 提取飞星四化连线（本命）===
      const flyLines:any[] = []
      a.palaces.forEach((p:any) => {
        try {
          const targets = p.mutagedPlaces?.() || []
          targets.forEach((tp:any) => {
            const fromBranch = EB.indexOf(p.earthlyBranch)
            const toBranch = EB.indexOf(tp.earthlyBranch)
            if (fromBranch >= 0 && toBranch >= 0 && fromBranch !== toBranch) {
              flyLines.push({
                fromBranch, toBranch, layer: '命',
                type: '', // 需要从 heavenlyStems 反查
              })
            }
          })
        } catch {}
      })

      // 给飞线标注四化类型
      const MUTAGEN_NAMES = ['禄','权','科','忌']
      flyLines.forEach((fl:any) => {
        const fromPalace = a.palaces.find((p:any) => EB.indexOf(p.earthlyBranch) === fl.fromBranch)
        const toPalace = a.palaces.find((p:any) => EB.indexOf(p.earthlyBranch) === fl.toBranch)
        if (fromPalace && toPalace) {
          // 查这个天干的四化哪颗星落在toPalace
          const stems = (fromPalace.heavenlyStem || '').toLowerCase()
          const hsTable: Record<string,string[]> = {
            'jia':['lianzhenMaj','pojunMaj','wuquMaj','taiyangMaj'],
            'yi':['tianjiMaj','tianliangMaj','ziweiMaj','taiyinMaj'],
            'bing':['tiantongMaj','tianjiMaj','wenchangMin','lianzhenMaj'],
            'ding':['taiyinMaj','tiantongMaj','tianjiMaj','jumenMaj'],
            'wu':['tanlangMaj','taiyinMaj','youbiMin','tianjiMaj'],
            'ji':['wuquMaj','tanlangMaj','tianliangMaj','wenquMin'],
            'geng':['taiyangMaj','wuquMaj','taiyinMaj','tiantongMaj'],
            'xin':['jumenMaj','taiyangMaj','wenquMin','wenchangMin'],
            'ren':['tianliangMaj','ziweiMaj','zuofuMin','wuquMaj'],
            'gui':['pojunMaj','jumenMaj','taiyinMaj','tanlangMaj'],
          }
          const entry = Object.entries(hsTable).find(([k]) => fromPalace.heavenlyStem?.toLowerCase().includes(k))
          if (entry) {
            entry[1].forEach((starId, si) => {
              // 检查toPalace是否有这个星
              const allStars = [...(toPalace.majorStars||[]), ...(toPalace.minorStars||[]), ...(toPalace.adjectiveStars||[])]
              if (allStars.some((s:any) => s.name?.toLowerCase().includes(starId.replace('Maj','').replace('Min','')))) {
                fl.type = MUTAGEN_NAMES[si]
              }
            })
          }
        }
      })

      const result = {
        fourPillars: { year:(cd.yearly||['','']).join(''), month:(cd.monthly||['','']).join(''), day:(cd.daily||['','']).join(''), hour:(cd.hourly||['','']).join('') },
        elementPhase: a.fiveElementsClass||'', mingMaster: a.soul||'', shenMaster: a.body||'',
        gender, solarDate: `${year}-${month}-${day}`, timeRange: a.timeRange||'',
        sortedBranches: sorted.map((p:any) => EB.indexOf(p.earthlyBranch)),
        // 自化箭头 & 飞线 & 宫位
        selfArrows, flyLines,
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

  return { chartResult, rawAstrolabe, savedRecords, arrowSettings, generateChart, loadRecords }
})
