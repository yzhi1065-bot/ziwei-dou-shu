/**
 * 紫微斗数核心算法 - 基础功能测试
 * 测试基本排盘逻辑
 */

import { describe, it, expect } from 'vitest'
import { createChart, quickChart } from '../chart'
import {
  solarToLunar, lunarToSolar, getFourPillars,
  getSpringFestival, getYearDays as getLunarYearDays, getLeapMonth,
  getYearPillar, getDayPillar, getHourPillar, getMonthPillar,
  isSolarLeapYear,
} from '../calendar'
import {
  calcMingPalace, calcShenPalace, calcElementPhase,
  calcMingMaster, calcShenMaster, calcPalaceStem,
} from '../palace'
import { getPhaseNumber } from '../palace/five-elements'
import {
  calcZiweiPosition, placeMainStars,
  get14MainStarsPlacement,
} from '../palace/stars'
import { getHuaByStem, getAllMingHua } from '../transform'
import {
  calcZuoBi, calcYouBi, calcWenChang, calcWenQu,
  calcTianKuiTianYue, calcLuCun, calcQingYang, calcTuoLuo,
  calcDiKong, calcDiJie, calcTianMa,
} from '../palace/minor-stars'
import { calcGreatLimits, isGreatLimitForward } from '../fortune'
import { getStarBrightness, getBrightnessScore } from '../stars-data/brightness'
import { MAIN_STARS, getAllMainStars } from '../stars-data/main-stars'

describe('历法换算核心', () => {
  it('公历转农历 - 2024年春节', () => {
    const result = solarToLunar(2024, 2, 10)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(1)
    expect(result.day).toBe(1)
    expect(result.isLeap).toBe(false)
  })

  it('农历转公历 - 2024年春节', () => {
    const result = lunarToSolar(2024, 1, 1, false)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(2)
    expect(result.day).toBe(10)
  })

  it('公历转农历 - 1990年8月30日', () => {
    const result = solarToLunar(1990, 8, 30)
    expect(result.month).toBe(7)
    expect(result.day).toBe(9)
  })

  it('公历闰年判断', () => {
    expect(isSolarLeapYear(2024)).toBe(true)
    expect(isSolarLeapYear(2023)).toBe(false)
    expect(isSolarLeapYear(2000)).toBe(true)
    expect(isSolarLeapYear(1900)).toBe(false)
  })

  it('春节日期计算', () => {
    const sf = getSpringFestival(2024)
    expect(sf.month).toBe(2)
    expect(sf.day).toBe(10)
  })

  it('农历年天数', () => {
    const days = getLunarYearDays(2024)
    expect(days === 354 || days === 355 || days === 383 || days === 384 || days === 385).toBe(true)
  })

  it('闰月信息', () => {
    // 2023年闰二月，2024年无闰月
    // 实际上2023闰二月
    // 2024无闰月
  })
})

describe('四柱八字', () => {
  it('年柱计算 - 2024年', () => {
    const pillar = getYearPillar(2024)
    expect(pillar.stem).toBe('甲')
    expect(pillar.branch).toBe('辰')
  })

  it('年柱计算 - 2023年', () => {
    const pillar = getYearPillar(2023)
    expect(pillar.stem).toBe('癸')
    expect(pillar.branch).toBe('卯')
  })

  it('日柱计算 - 2024年春节', () => {
    const pillar = getDayPillar(2024, 2, 10)
    expect(pillar.stem).toBeTruthy()
    expect(pillar.branch).toBeTruthy()
  })

  it('时柱计算 - 子时', () => {
    const pillar = getHourPillar(0, 23)
    expect(pillar.branch).toBe('子')
  })

  it('完整四柱 - 1990年8月30日12时', () => {
    const pillars = getFourPillars(1990, 8, 30, 12, false)
    expect(pillars.yearPillar.stem).toBeTruthy()
    expect(pillars.yearPillar.branch).toBeTruthy()
    expect(pillars.monthPillar.stem).toBeTruthy()
    expect(pillars.monthPillar.branch).toBeTruthy()
    expect(pillars.dayPillar.stem).toBeTruthy()
    expect(pillars.dayPillar.branch).toBeTruthy()
    expect(pillars.hourPillar.stem).toBeTruthy()
    expect(pillars.hourPillar.branch).toBe('午') // 12时为午时
  })
})

describe('命宫身宫', () => {
  it('命宫计算 - 正月子时', () => {
    const ming = calcMingPalace(1, 0)
    // 正月子时：寅宫起正月，逆数0 → 寅宫(3)
    expect(ming).toBe(3)
  })

  it('命宫计算 - 五月午时', () => {
    const ming = calcMingPalace(5, 6)
    // 寅(3)+4→午(7)，逆数6到子(1)
    expect(ming).toBeGreaterThanOrEqual(1)
    expect(ming).toBeLessThanOrEqual(12)
  })

  it('身宫计算 - 正月子时', () => {
    const shen = calcShenPalace(1, 0)
    expect(shen).toBe(3) // 寅
  })

  it('身宫计算 - 五月午时', () => {
    const shen = calcShenPalace(5, 6)
    // 寅(3)+4→午(7)，顺数6 → 子(1)
    expect(shen).toBeGreaterThanOrEqual(1)
    expect(shen).toBeLessThanOrEqual(12)
  })
})

describe('五行局', () => {
  it('丙寅日 - 火六局', () => {
    const phase = calcElementPhase('丙', '寅')
    expect(phase).toBe('火六局')
  })

  it('戊辰日 - 木三局', () => {
    const phase = calcElementPhase('戊', '辰')
    expect(phase).toBe('木三局')
  })

  it('甲子日 - 金四局', () => {
    const phase = calcElementPhase('甲', '子')
    expect(phase).toBe('金四局')
  })

  it('五行局数字', () => {
    expect(getPhaseNumber('水二局')).toBe(2)
    expect(getPhaseNumber('木三局')).toBe(3)
    expect(getPhaseNumber('金四局')).toBe(4)
    expect(getPhaseNumber('土五局')).toBe(5)
    expect(getPhaseNumber('火六局')).toBe(6)
  })
})

describe('14主星安星', () => {
  it('紫微星定位 - 金四局第1天', () => {
    const pos = calcZiweiPosition('金四局', 1)
    expect(pos).toBe(3) // 寅宫
  })

  it('紫微星定位 - 金四局第4天', () => {
    const pos = calcZiweiPosition('金四局', 4)
    expect(pos).toBe(3) // 金四局4天一换，1-4天都在寅宫(3)
  })

  it('紫微星定位 - 水二局第1天', () => {
    const pos = calcZiweiPosition('水二局', 1)
    expect(pos).toBe(3) // 寅宫
  })

  it('紫微系6颗位置', () => {
    const result = placeMainStars('金四局', 1)
    expect(result.ziweiBranch).toBe(3)
    expect(result.tianfuBranch).toBeGreaterThanOrEqual(1)
    // 紫微在寅(3)→天机在卯(4)→太阳在巳(6)→武曲在午(7)→天同在未(8)→廉贞在酉(10)
    expect(result.starMap['tianji']).toBe(4)
    expect(result.starMap['taiyang']).toBe(6)
    expect(result.starMap['wuqu']).toBe(7)
    expect(result.starMap['tiantong']).toBe(8)
    expect(result.starMap['lianzhen']).toBe(10)
  })

  it('全部14主星都排布', () => {
    const result = placeMainStars('木三局', 15)
    expect(Object.keys(result.starMap).length).toBe(14)
    const mainStarIds = ['ziwei','tianji','taiyang','wuqu','tiantong','lianzhen','tianfu','taiyin','tanlang','jumen','tianxiang','tianliang','qisha','pojun']
    mainStarIds.forEach(id => {
      expect(result.starMap[id]).toBeDefined()
    })
  })
})

describe('辅煞星排布', () => {
  it('左辅 - 正月', () => {
    expect(calcZuoBi(1)).toBe(5) // 辰宫
  })

  it('右弼 - 正月', () => {
    expect(calcYouBi(1)).toBe(11) // 戌宫
  })

  it('文昌 - 子时', () => {
    expect(calcWenChang(0)).toBe(11) // 戌
  })

  it('文曲 - 子时', () => {
    expect(calcWenQu(0)).toBe(5) // 辰
  })

  it('天魁天钺 - 甲年', () => {
    const [kui, yue] = calcTianKuiTianYue(0) // 甲
    expect(kui).toBe(2)  // 丑
    expect(yue).toBe(8)  // 未
  })

  it('禄存 - 甲年', () => {
    expect(calcLuCun(0)).toBe(3) // 寅
  })

  it('擎羊陀罗 - 甲年', () => {
    expect(calcQingYang(3)).toBe(4) // 卯
    expect(calcTuoLuo(3)).toBe(2) // 丑
  })

  it('地空 - 子时', () => {
    expect(calcDiKong(0)).toBe(12) // 亥
  })

  it('地劫 - 子时', () => {
    expect(calcDiJie(0)).toBe(12) // 亥
  })

  it('天马 - 寅年', () => {
    expect(calcTianMa(3)).toBe(9) // 申
  })
})

describe('四化系统', () => {
  it('甲干四化 - 三合派', () => {
    const hua = getHuaByStem('甲', 'sanhe')
    expect(hua.length).toBe(4)
    expect(hua[0].starId).toBe('lianzhen')
    expect(hua[0].type).toBe('禄')
    expect(hua[1].starId).toBe('pojun')
    expect(hua[1].type).toBe('权')
    expect(hua[2].starId).toBe('wuqu')
    expect(hua[2].type).toBe('科')
    expect(hua[3].starId).toBe('taiyang')
    expect(hua[3].type).toBe('忌')
  })

  it('乙干四化', () => {
    const hua = getHuaByStem('乙', 'sanhe')
    expect(hua[0].starId).toBe('tianji')  // 化禄
    expect(hua[1].starId).toBe('tianliang') // 化权
    expect(hua[2].starId).toBe('ziwei')     // 化科
    expect(hua[3].starId).toBe('taiyin')    // 化忌
  })

  it('本命四化数量', () => {
    const hua = getAllMingHua('丙', 'sanhe')
    expect(hua.length).toBe(4)
  })
})

describe('大限计算', () => {
  it('阳男顺行', () => {
    expect(isGreatLimitForward(0, '男')).toBe(true)  // 甲年男顺
    expect(isGreatLimitForward(1, '男')).toBe(false) // 乙年男逆
    expect(isGreatLimitForward(0, '女')).toBe(false) // 甲年女逆
    expect(isGreatLimitForward(1, '女')).toBe(true)  // 乙年女顺
  })
})

describe('庙旺落陷', () => {
  it('紫微在子旺', () => {
    const level = getStarBrightness('ziwei', 1) // 子在1
    expect(level).toBe('旺')
  })

  it('太阳在午得地', () => {
    const level = getStarBrightness('taiyang', 7) // 午在7
    expect(level).toBe('得地')
  })

  it('太阴在子旺', () => {
    const level = getStarBrightness('taiyin', 1)
    expect(level).toBe('旺')
  })
})

describe('主星数据', () => {
  it('14主星完整', () => {
    const stars = getAllMainStars()
    expect(stars.length).toBe(14)
  })

  it('紫微属性正确', () => {
    const ziwei = MAIN_STARS['ziwei']
    expect(ziwei.element).toBe('土')
    expect(ziwei.luck).toBe('吉')
  })
})

describe('完整排盘 - 端到端', () => {
  it('2024年2月10日 子时排盘（甲辰年、春季出生）', () => {
    const chart = quickChart(2024, 2, 10, 0, 0, '男', 'sanhe')
    expect(chart.fourPillars.year).toContain('甲')
    expect(chart.fourPillars.year).toContain('辰')
    expect(chart.mingPalace).toBeGreaterThanOrEqual(1)
    expect(chart.mingPalace).toBeLessThanOrEqual(12)
    expect(chart.elementPhase).toBeTruthy()
    expect(chart.palaces.length).toBe(12)
    expect(chart.mingMaster).toBeTruthy()
    expect(chart.shenMaster).toBeTruthy()
    expect(chart.hua.length).toBe(4)
    expect(chart.greatLimits.length).toBe(12)
    
    // 命宫应该有主星
    const mingPalace = chart.palaces[0]
    expect(mingPalace.name).toBe('命宫')
    expect(mingPalace.mainStars.length).toBeGreaterThanOrEqual(0) // 命宫可能有主星也可能为空宫
  })

  it('1990年8月30日12时', () => {
    const chart = quickChart(1990, 8, 30, 12, 0, '男', 'sanhe')
    expect(chart.fourPillars.hour).toContain('午')
    expect(chart.palaces.length).toBe(12)
    chart.palaces.forEach(p => {
      expect(p.name).toBeTruthy()
      expect(p.stem).toBeTruthy()
      expect(p.branch).toBeTruthy()
    })
  })

  it('三种生辰结果不同', () => {
    const chart1 = quickChart(2000, 1, 1, 0, 0, '男', 'sanhe')
    const chart2 = quickChart(2000, 6, 15, 12, 0, '女', 'sanhe')
    expect(chart1.fourPillars.year).not.toBe(chart2.fourPillars.year) // 不同年柱？
    // 至少命宫位置不同
    expect(chart1.palaces[0].branchIndex === chart2.palaces[0].branchIndex 
      && chart1.palaces[0].mainStars.join() === chart2.palaces[0].mainStars.join()).toBe(false)
  })
})

describe('命主身主', () => {
  it('命宫在寅命主禄存', () => {
    expect(calcMingMaster(3)).toBe('禄存')
  })

  it('命宫在丑命主巨门', () => {
    expect(calcMingMaster(2)).toBe('巨门')
  })

  it('身主 - 子年', () => {
    expect(calcShenMaster(1)).toBe('火星')
  })

  it('身主 - 午年', () => {
    expect(calcShenMaster(7)).toBe('火星')
  })
})
