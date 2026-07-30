/**
 * 流年运势推演
 * 
 * 流年盘的计算：
 *   1. 流年地支 = 该年的地支
 *   2. 流年四化 = 该年天干的四化
 *   3. 流年煞星排布
 *   4. 流年斗君定位
 */

import { HeavenlyStem, EarthBranch, EARTH_BRANCHES, HEAVENLY_STEMS } from '../types'
import { getHuaByStem, SanHeHuaRecord } from '../transform/heavenly-stems'

/**
 * 获取流年地支
 */
export function getYearBranch(year: number): EarthBranch {
  const idx = (year - 4) % 12
  return EARTH_BRANCHES[((idx % 12) + 12) % 12]
}

/**
 * 获取流年天干
 */
export function getYearStem(year: number): HeavenlyStem {
  const idx = (year - 4) % 10
  return HEAVENLY_STEMS[((idx % 10) + 10) % 10]
}

/**
 * 获取流年所入的宫位（地支编号）
 * 流年地支对应的宫位就是该年主力关注的宫位
 */
export function getYearPalaceIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12 + 1
}

/**
 * 获取流年四化
 */
export function getYearHua(year: number): SanHeHuaRecord[] {
  const stem = getYearStem(year)
  return getHuaByStem(stem)
}

/**
 * 流月计算（基于流年）
 * 流月从寅宫起正月，顺数
 */
export function getFlowMonthPalace(year: number, month: number): number {
  const yearBranchOffset = getYearPalaceIndex(year) - 1
  const monthOffset = (month - 1) % 12
  return ((yearBranchOffset + monthOffset) % 12) + 1
}

/**
 * 流日计算（基于流月）
 * 流日起法依流派不同
 */
export function getFlowDayPalace(year: number, month: number, day: number): number {
  // 简化：由流月宫位+日数决定
  const flowMonthPalace = getFlowMonthPalace(year, month)
  return ((flowMonthPalace - 1 + (day - 1)) % 12) + 1
}
