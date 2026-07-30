import { defineStore } from 'pinia'
import { ref } from 'vue'

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

export const useChartStore = defineStore('chart', () => {
  const chartResult = ref<any>(null)
  const rawAstrolabe = ref<any>(null)

  function formatStars(stars: any[]) {
    return (stars || []).map((s: any) => s.name)
  }

  async function generateChart(
    year: number, month: number, day: number,
    hour: number, minute: number,
    gender: string = '男',
    school: string = 'sanhe'
  ) {
    try {
      // === 主引擎: iztro ===
      const { astro } = await import('iztro')
      const a = astro.bySolar(`${year}-${month}-${day}`, hour, gender === '男' ? '男' : '女', true, 'zh-CN')
      rawAstrolabe.value = a

      // 按地支排序宫位
      const sorted = [...a.palaces].sort(
        (a: any, b: any) => EB.indexOf(a.earthlyBranch) - EB.indexOf(b.earthlyBranch)
      )

      const cd = a.rawDates?.chineseDate || {}
      chartResult.value = {
        fourPillars: {
          year: (cd.yearly || ['','']).join(''),
          month: (cd.monthly || ['','']).join(''),
          day: (cd.daily || ['','']).join(''),
          hour: (cd.hourly || ['','']).join(''),
        },
        elementPhase: a.fiveElementsClass || '',
        mingMaster: a.soul || '',
        shenMaster: a.body || '',
        gender,
        solarDate: `${year}-${month}-${day}`,
        palaces: sorted.map((p: any) => ({
          name: p.name,
          stem: p.heavenlyStem || '',
          branch: p.earthlyBranch || '',
          branchIndex: EB.indexOf(p.earthlyBranch),
          isShen: p.isBodyPalace || false,
          mainStars: formatStars(p.majorStars),
          minorStars: formatStars([...(p.minorStars||[]), ...(p.adjectiveStars||[])]),
          decadal: p.decadal ? `${p.decadal.range[0]}-${p.decadal.range[1]}岁` : null,
          ages: p.ages || [],
        })),
      }
    } catch (e) {
      console.error('iztro排盘失败，回退自研算法:', e)
      // fallback: 自研算法
      const { createChart } = await import('../../../core/chart')
      const chart = createChart({
        year, month, day, hour, minute,
        gender: gender as any,
        school: school as any,
      })
      chartResult.value = {
        fourPillars: chart.fourPillars,
        elementPhase: chart.elementPhase,
        mingMaster: chart.mingMaster,
        shenMaster: chart.shenMaster,
        gender,
        solarDate: `${year}-${month}-${day}`,
        palaces: chart.palaces.map((p: any) => ({
          name: p.name, stem: p.stem, branch: p.branch,
          branchIndex: p.branchIndex, isShen: p.isShen,
          mainStars: p.mainStars, minorStars: [...p.minorStars, ...p.shaStars, ...p.miscStars],
        })),
      }
    }
  }

  return { chartResult, rawAstrolabe, generateChart }
})
