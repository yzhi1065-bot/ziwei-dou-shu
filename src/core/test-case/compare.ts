/**
 * 批量比对脚本
 * 自动对比我方排盘结果与标准数据（文墨天机/元亨利贞）
 * 
 * 使用方式：
 *   npx tsx src/core/test-case/compare.ts
 * 
 * 样本数据格式：
 *   { year, month, day, hour, minute, gender, school,
 *     expected: { mingPalace, elementPhase, fourPillars, starPositions, hua, greatLimits } }
 */

import { createChart, ChartResult } from '../chart'
import { MAIN_STAR_IDS } from '../stars-data/main-stars'

export interface TestSample {
  name: string
  birth: { year: number; month: number; day: number; hour: number; minute: number }
  gender: '男' | '女'
  school: 'sanhe' | 'feixing' | 'sihua' | 'nishi'
  expected: {
    mingPalace?: number
    elementPhase?: string
    yearPillar?: string
    mingMaster?: string
    shenMaster?: string
    /** 星曜ID → 期望地支 */
    starPositions?: Record<string, number>
    /** 四化星曜ID列表 */
    huaStars?: string[]
    /** 大限起始岁数 */
    limitStartAge?: number
  }
  /** 允许的误差范围（测试字段名→误差值） */
  tolerance?: Record<string, number>
}

// ===== 标准测试样本 =====
// 数据来源：文墨天机/元亨利贞手工核对
// TODO: 补充更多样本 + 精确预期值
export const TEST_SAMPLES: TestSample[] = [
  {
    name: '甲辰年正月春节子时（男）',
    birth: { year: 2024, month: 2, day: 10, hour: 0, minute: 0 },
    gender: '男',
    school: 'sanhe',
    expected: {
      yearPillar: '甲辰',
      elementPhase: '火六局',
    }
  },
  {
    name: '庚午年七月十一午时（男）',
    birth: { year: 1990, month: 8, day: 30, hour: 12, minute: 0 },
    gender: '男',
    school: 'sanhe',
    expected: {
      yearPillar: '庚午',
    }
  },
  {
    name: '2000年元旦子时（男）',
    birth: { year: 2000, month: 1, day: 1, hour: 0, minute: 0 },
    gender: '男',
    school: 'sanhe',
    expected: {
      yearPillar: '己卯',
      elementPhase: '水二局',
      mingPalace: 1,        // 子
      mingMaster: '贪狼',
      shenMaster: '天同',
    }
  },
  {
    name: '2000年儿童节午时（女）',
    birth: { year: 2000, month: 6, day: 1, hour: 12, minute: 0 },
    gender: '女',
    school: 'sanhe',
    expected: {
      yearPillar: '庚辰',
      elementPhase: '土五局',
      mingPalace: 12,       // 亥
      mingMaster: '巨门',
      shenMaster: '文昌',
    }
  },
  {
    name: '戊申年十月廿三辰时（男）',
    birth: { year: 1968, month: 12, day: 12, hour: 8, minute: 0 },
    gender: '男',
    school: 'sanhe',
    expected: {
      yearPillar: '戊申',
    }
  },
  {
    name: '乙卯年腊月初八酉时（女）',
    birth: { year: 1976, month: 1, day: 8, hour: 18, minute: 0 },
    gender: '女',
    school: 'sanhe',
    expected: {
      yearPillar: '乙卯',
    }
  },
  {
    name: '辛巳年五月初五寅时（男）',
    birth: { year: 2001, month: 6, day: 25, hour: 4, minute: 0 },
    gender: '男',
    school: 'sanhe',
    expected: {
      yearPillar: '辛巳',
      elementPhase: '水二局',
      mingPalace: 5,        // 辰
      mingMaster: '廉贞',
      shenMaster: '天机',
    }
  },
  {
    name: '流派测试-飞星派（女）',
    birth: { year: 1995, month: 3, day: 15, hour: 14, minute: 30 },
    gender: '女',
    school: 'feixing',
    expected: {
      yearPillar: '乙亥',
      elementPhase: '水二局',
      mingPalace: 9,        // 申
      mingMaster: '廉贞',
      shenMaster: '天机',
    }
  },
  {
    name: '倪海厦派测试（男）',
    birth: { year: 1988, month: 5, day: 20, hour: 10, minute: 0 },
    gender: '男',
    school: 'nishi',
    expected: {
      yearPillar: '戊辰',
      elementPhase: '金四局',
      mingPalace: 1,        // 子
      mingMaster: '贪狼',
      shenMaster: '文昌',
    }
  },
]

/** 运行单一样本测试 */
export function runSingleTest(sample: TestSample): { pass: boolean; details: string[] } {
  const details: string[] = []
  let allPass = true

  try {
    const chart = createChart({
      year: sample.birth.year,
      month: sample.birth.month,
      day: sample.birth.day,
      hour: sample.birth.hour,
      minute: sample.birth.minute,
      gender: sample.gender,
      school: sample.school,
    })

    // 检查年柱
    if (sample.expected.yearPillar) {
      const got = chart.fourPillars.year
      if (got === sample.expected.yearPillar) {
        details.push(`✓ 年柱: ${got}`)
      } else {
        details.push(`✗ 年柱: 期望 ${sample.expected.yearPillar}, 实际 ${got}`)
        allPass = false
      }
    }

    // 检查五行局
    if (sample.expected.elementPhase) {
      const got = chart.elementPhase
      if (got === sample.expected.elementPhase) {
        details.push(`✓ 五行局: ${got}`)
      } else {
        details.push(`✗ 五行局: 期望 ${sample.expected.elementPhase}, 实际 ${got}`)
        allPass = false
      }
    }

    // 检查命宫
    if (sample.expected.mingPalace) {
      const got = chart.mingPalace
      if (got === sample.expected.mingPalace) {
        details.push(`✓ 命宫: 地支${got}`)
      } else {
        details.push(`✗ 命宫: 期望 ${sample.expected.mingPalace}, 实际 ${got}`)
        allPass = false
      }
    }

    // 检查命主
    if (sample.expected.mingMaster) {
      const got = chart.mingMaster
      if (got === sample.expected.mingMaster) {
        details.push(`✓ 命主: ${got}`)
      } else {
        details.push(`✗ 命主: 期望 ${sample.expected.mingMaster}, 实际 ${got}`)
        allPass = false
      }
    }

    // 检查身主
    if (sample.expected.shenMaster) {
      const got = chart.shenMaster
      if (got === sample.expected.shenMaster) {
        details.push(`✓ 身主: ${got}`)
      } else {
        details.push(`✗ 身主: 期望 ${sample.expected.shenMaster}, 实际 ${got}`)
        allPass = false
      }
    }

    // 检查四化
    if (sample.expected.huaStars) {
      const got = chart.hua.map(h => h.starId)
      const match = sample.expected.huaStars.every(s => got.includes(s))
      if (match) {
        details.push(`✓ 四化: ${got.join(',')}`)
      } else {
        details.push(`✗ 四化: 期望 [${sample.expected.huaStars}], 实际 [${got}]`)
        allPass = false
      }
    }

    details.push(`  十二宫: ${chart.palaces.map(p => `${p.name}[${p.stem}${p.branch}]`).join(' ')}`)
    details.push(`  大限起运: ${chart.greatLimits[0].startAge}岁`)
    details.push(`  命宫主星: ${chart.palaces[0].mainStars.join(',') || '(空宫)'}`)

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    details.push(`✗ 排盘异常: ${msg}`)
    allPass = false
  }

  return { pass: allPass, details }
}

/** 运行全量比对测试 */
export async function runAllTests(): Promise<void> {
  console.log('\n===== 紫微斗数算法比测试报告 =====')
  console.log(`样本数: ${TEST_SAMPLES.length}\n`)

  let passed = 0
  let failed = 0

  for (const sample of TEST_SAMPLES) {
    const result = runSingleTest(sample)
    if (result.pass) {
      passed++
      console.log(`✅ ${sample.name}`)
    } else {
      failed++
      console.log(`❌ ${sample.name}`)
    }
    result.details.forEach(d => console.log(`   ${d}`))
    console.log()
  }

  console.log(`\n===== 汇总: ${passed}通过 / ${failed}失败 / ${TEST_SAMPLES.length}总计 =====`)
  
  if (failed > 0) {
    console.log('\n⚠️ 存在未通过的测试，请用文墨天机/元亨利贞核对后修正expected值或算法')
    process.exit(1)
  }
}

// 直接运行
runAllTests().catch(console.error)
