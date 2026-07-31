/**
 * 紫微斗数命盘编排器（核心编排器）
 * 
 * 输入生辰信息，输出完整命盘
 * 串联：历法 → 四柱 → 命宫身宫 → 五行局 → 安星 → 四化 → 大限 → 格局
 */

import {
  ChartInput, ChartResult, PalaceInfo, HuaRecord, GreatLimit,
  FiveElementPhase, Gender, School, HeavenlyStem, EarthBranch,
  getBranchByIndex, getStemByIndex, getStemIndex, getBranchIndex,
  EARTH_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES, HuaType,
} from './types'

import {
  solarToLunar, getFourPillars,
  getStemIndex as getStemIdx,
  lunarToSolar, hasPassedSpringStart,
  getTimeBranchIndex,
} from './calendar'

import {
  calcMingPalace, calcShenPalace, buildPalaces,
  calcElementPhase, getPhaseNumber,
  calcMingMaster, calcShenMaster, calcPalaceStem,
} from './palace'

import { placeMainStars, StarPlacementResult } from './palace/stars'
import { placeAllMinorStars } from './palace/minor-stars'
import { getHuaByStem, getAllMingHua } from './transform'
import { calcGreatLimits } from './fortune'
import { detectAllPatterns, PatternResult } from './pattern'

/**
 * 完整排盘
 * 
 * @param input 输入参数
 * @returns 完整命盘结果
 */
export function createChart(input: ChartInput): ChartResult {
  const {
    year, month, day, hour, minute,
    gender, longitude, latitude,
    school = 'sanhe', isLunar = false
  } = input
  
  // 1. 如果是农历输入，先转公历
  let solarYear = year, solarMonth = month, solarDay = day
  let lunarYear = year, lunarMonth = month, lunarDay = day, isLeap = false
  
  if (isLunar) {
    const solar = lunarToSolar(year, month, day, false)
    solarYear = solar.year
    solarMonth = solar.month
    solarDay = solar.day
  } else {
    // 公历转农历
    const lunar = solarToLunar(year, month, day)
    lunarYear = lunar.year
    lunarMonth = lunar.month
    lunarDay = lunar.day
    isLeap = lunar.isLeap
  }
  
  // 2. 计算四柱八字（农历年/月，与iztro/文墨天机一致）
  const fourPillars = getFourPillars(solarYear, solarMonth, solarDay, hour, false)
  // 农历年干支索引（正月初一换年，用于五行局宫干/大限，与四柱年柱一致）
  const yearStemIdx = HEAVENLY_STEMS.indexOf(fourPillars.yearPillar.stem)
  const yearBranchIdx = EARTH_BRANCHES.indexOf(fourPillars.yearPillar.branch)
  
  const timeBranchIndex = getTimeBranchIndex(solarYear, solarMonth, solarDay, hour, minute, longitude)
  
  // 4. 命宫身宫（闰月15日前算本月，16日后算下月——与iztro一致）
  const mingLunarMonth = lunarMonth < 0 ? (lunarDay <= 15 ? -lunarMonth : -lunarMonth + 1) : lunarMonth
  const mingBranchIndex = calcMingPalace(mingLunarMonth, timeBranchIndex, false)
  const shenBranchIndex = calcShenPalace(mingLunarMonth, timeBranchIndex)
  
  // 5. 五行局（使用命宫正确天干，非年干）
  const mingStem = calcPalaceStem(((yearStemIdx % 10) + 10) % 10, mingBranchIndex)
  const mingBranch = EARTH_BRANCHES[mingBranchIndex - 1] as EarthBranch
  const elementPhase = calcElementPhase(mingStem, mingBranch)
  
  // 6. 命主身主
  const mingMaster = calcMingMaster(mingBranchIndex)
  const shenMaster = calcShenMaster(yearBranchIdx + 1)
  
  // 7. 安14主星
  const starPlacement = placeMainStars(elementPhase, lunarDay)
  const starMap = starPlacement.starMap
  
  // 8. 辅煞星
  const minorStars = placeAllMinorStars(
    lunarMonth, timeBranchIndex,
    ((yearStemIdx % 10) + 10) % 10, yearBranchIdx + 1,
    true, true
  )
  
  // 9. 四化（本命四化，以农历年天干起——与iztro一致）
  const yearStemForHua = fourPillars.yearPillar.stem
  const huaList = getAllMingHua(yearStemForHua, school as School)
  
  // 构建四化映射
  const huaMap: Record<string, HuaType> = {}
  huaList.forEach(h => { huaMap[h.starId] = h.type })
  
  // 10. 构建十二宫
  const palaces = buildPalaces(mingBranchIndex, shenBranchIndex, ((yearStemIdx % 10) + 10) % 10)
  
  // 注星入宫
  const allStars = {
    ...starMap,
    ...minorStars.lucky,
    ...minorStars.sha,
    ...minorStars.misc,
  }
  
  // 分类注星
  palaces.forEach(palace => {
    const branchIdx = palace.branchIndex
    
    // 主星
    for (const [starId, br] of Object.entries(starMap)) {
      if (br === branchIdx) palace.mainStars.push(starId)
    }
    
    // 辅星
    for (const [starId, br] of Object.entries(minorStars.lucky)) {
      if (br === branchIdx) palace.minorStars.push(starId)
    }
    
    // 煞星
    for (const [starId, br] of Object.entries(minorStars.sha)) {
      if (br === branchIdx) palace.shaStars.push(starId)
    }
    
    // 杂曜
    for (const [starId, br] of Object.entries(minorStars.misc)) {
      if (br === branchIdx) palace.miscStars.push(starId)
    }
    
    // 四化
    for (const hua of huaList) {
      const starBranch = allStars[hua.starId]
      if (starBranch === branchIdx) {
        palace.hua.push(hua.type)
      }
    }
  })
  
  // 11. 大限
  const greatLimits = calcGreatLimits(
    mingBranchIndex, shenBranchIndex,
    ((yearStemIdx % 10) + 10) % 10,
    yearBranchIdx + 1,
    gender as Gender,
    elementPhase
  )
  
  // 12. 格局
  const patterns = detectAllPatterns(palaces, starMap, elementPhase, huaMap)
  
  // 13. 四化记录
  const huaRecords: HuaRecord[] = huaList.map(h => ({
    starId: h.starId,
    type: h.type,
    palaceIndex: allStars[h.starId] || 0,
  }))
  
  // 返回完整的 PalaceInfo
  const fullPalaces = palaces.map((p, idx) => ({
    ...p,
    name: PALACE_NAMES[idx],
  })) as PalaceInfo[]
  
  return {
    input,
    fourPillars: {
      // 年柱用农历年（与iztro/文墨天机一致：正月初一换年）
      year: `${fourPillars.yearPillar.stem}${fourPillars.yearPillar.branch}`,
      month: `${fourPillars.monthPillar.stem}${fourPillars.monthPillar.branch}`,
      day: `${fourPillars.dayPillar.stem}${fourPillars.dayPillar.branch}`,
      hour: `${fourPillars.hourPillar.stem}${fourPillars.hourPillar.branch}`,
    },
    mingPalace: mingBranchIndex,
    shenPalace: shenBranchIndex,
    elementPhase,
    palaces: fullPalaces,
    mingMaster,
    shenMaster,
    hua: huaRecords,
    greatLimits,
    patterns,
  }
}

/**
 * 快速排盘（只需生辰，自动计算）
 */
export function quickChart(
  year: number, month: number, day: number,
  hour: number, minute: number = 0,
  gender: Gender = '男',
  school: School = 'sanhe'
): ChartResult {
  return createChart({
    year, month, day, hour, minute,
    gender, school, isLunar: false
  })
}
