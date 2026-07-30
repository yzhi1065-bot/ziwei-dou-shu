import { defineStore } from 'pinia'
import { ref } from 'vue'

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

export const useChartStore = defineStore('chart', () => {
  const chartResult = ref<any>(null)
  const rawAstrolabe = ref<any>(null)
  const savedRecords = ref<any[]>([])
  const currentHoroscope = ref<any>(null)

  // 加载历史记录
  function loadRecords() {
    try { savedRecords.value = JSON.parse(localStorage.getItem('zw_records') || '[]') }
    catch { savedRecords.value = [] }
  }

  function saveRecord(record: any) {
    loadRecords()
    savedRecords.value.unshift({ id: Date.now(), savedAt: new Date().toLocaleString('zh-CN'), ...record })
    if (savedRecords.value.length > 20) savedRecords.value.length = 20
    localStorage.setItem('zw_records', JSON.stringify(savedRecords.value))
  }

  function deleteRecord(idx: number) {
    savedRecords.value.splice(idx, 1)
    localStorage.setItem('zw_records', JSON.stringify(savedRecords.value))
  }

  async function generateChart(year: number, month: number, day: number, hour: number, minute: number, gender: string = '男', school: string = 'sanhe') {
    try {
      const { astro } = await import('iztro')
      const a = astro.bySolar(`${year}-${month}-${day}`, hour, gender === '男' ? '男' : '女', true, 'zh-CN')
      rawAstrolabe.value = a

      const sorted = [...a.palaces].sort((a: any, b: any) => EB.indexOf(a.earthlyBranch) - EB.indexOf(b.earthlyBranch))
      const cd = a.rawDates?.chineseDate || {}

      const result = {
        fourPillars: { year: (cd.yearly||['','']).join(''), month: (cd.monthly||['','']).join(''), day: (cd.daily||['','']).join(''), hour: (cd.hourly||['','']).join('') },
        elementPhase: a.fiveElementsClass || '',
        mingMaster: a.soul || '', shenMaster: a.body || '',
        gender, solarDate: `${year}-${month}-${day}`,
        rawDates: a.rawDates,
        timeRange: a.timeRange || '',
        palaces: sorted.map((p: any) => ({
          name: p.name, stem: p.heavenlyStem||'', branch: p.earthlyBranch||'',
          branchIndex: EB.indexOf(p.earthlyBranch), isShen: p.isBodyPalace||false,
          // 星曜分类
          mainStars: (p.majorStars||[]).map((s:any) => ({ name: s.name, brightness: s.brightness||'', mutagen: s.mutagen||'' })),
          minorStars: (p.minorStars||[]).map((s:any) => ({ name: s.name, brightness: s.brightness||'', mutagen: s.mutagen||'', type: s.type||'minor' })),
          adjStars: (p.adjectiveStars||[]).map((s:any) => ({ name: s.name, brightness: s.brightness||'', mutagen: s.mutagen||'' })),
          // 十二神煞
          changsheng12: p.changsheng12 || '',
          boshi12: p.boshi12 || '',
          jiangqian12: p.jiangqian12 || '',
          suiqian12: p.suiqian12 || '',
          // 大限
          decadal: p.decadal ? { range: p.decadal.range, stem: p.decadal.heavenlyStem, branch: p.decadal.earthlyBranch } : null,
          ages: p.ages || [],
        })),
      }
      chartResult.value = result
      return result
    } catch (e) {
      console.error('iztro排盘失败:', e)
      const { createChart } = await import('../../../core/chart')
      const chart = createChart({ year, month, day, hour, minute, gender: gender as any, school: school as any })
      chartResult.value = {
        fourPillars: chart.fourPillars, elementPhase: chart.elementPhase,
        mingMaster: chart.mingMaster, shenMaster: chart.shenMaster, gender,
        solarDate: `${year}-${month}-${day}`,
        palaces: chart.palaces.map((p:any) => ({ name: p.name, stem: p.stem, branch: p.branch, branchIndex: p.branchIndex, isShen: p.isShen, mainStars: p.mainStars.map((n:string)=>({name:n})), minorStars: [...p.minorStars,...p.shaStars,...p.miscStars].map((n:string)=>({name:n})), decadal:null, ages:[] })),
      }
      return chartResult.value
    }
  }

  // 流年/流月/流日/流时计算
  function calcHoroscope(targetDate: string) {
    if (!rawAstrolabe.value) return null
    try {
      const h = rawAstrolabe.value.horoscope(targetDate)
      currentHoroscope.value = h
      return h
    } catch { return null }
  }

  return { chartResult, rawAstrolabe, savedRecords, currentHoroscope, generateChart, loadRecords, saveRecord, deleteRecord, calcHoroscope }
})
