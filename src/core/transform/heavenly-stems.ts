/**
 * 四化运算系统
 * 
 * 四化类型：化禄、化权、化科、化忌
 * 
 * 四化规则（中州派标准）：
 *   天干四化表：每个天干对应4颗星曜被化
 *   大限四化：大限宫干的四化
 *   流年四化：流年天干的四化
 * 
 * 支持流派切换：
 *   sanhe（三合派）= 中州派标准四化
 *   feixing（飞星派）= 飞星四化（略有不同）
 *   sihua（四化派）= 钦天四化（以四化为核心）
 *   nishi（倪海厦派）= 倪师四化
 */

import { HeavenlyStem, HuaType, School, FiveElementPhase } from '../types'
import { HEAVENLY_STEMS } from '../types'

/**
 * 四化数据
 */
export interface HuaData {
  starId: string
  type: HuaType
}

/**
 * 中州派（三合派）天干四化表
 * 格式：天干 → [化禄星, 化权星, 化科星, 化忌星]
 * 
 * 口诀：
 *   甲廉破武阳，乙机梁紫阴
 *   丙同机昌廉，丁阴同机巨
 *   戊贪阴右机，己武贪梁曲
 *   庚阳武阴同，辛巨阳曲昌
 *   壬梁紫辅武，癸破巨阴贪
 */
export const SANHE_HUA: Record<string, [string, string, string, string]> = {
  '甲': ['lianzhen', 'pojun', 'wuqu', 'taiyang'],
  '乙': ['tianji', 'tianliang', 'ziwei', 'taiyin'],
  '丙': ['tiantong', 'tianji', 'wenchang', 'lianzhen'],
  '丁': ['taiyin', 'tiantong', 'tianji', 'jumen'],
  '戊': ['tanlang', 'taiyin', 'youbi', 'tianji'],
  '己': ['wuqu', 'tanlang', 'tianliang', 'wenqu'],
  '庚': ['taiyang', 'wuqu', 'taiyin', 'tiantong'],
  '辛': ['jumen', 'taiyang', 'wenqu', 'wenchang'],
  '壬': ['tianliang', 'ziwei', 'zuobi', 'wuqu'],
  '癸': ['pojun', 'jumen', 'taiyin', 'tanlang'],
}

/**
 * 飞星派四化表（与中州派略有差异）
 * 主要差异在部分星曜的化权/化科不同
 */
// TODO: 飞星派/四化派/倪师派四化表目前与三合派相同，需查阅各派典籍补充差异
// 已知差异参考：飞星派甲干无廉贞化禄之争、钦天派丙干天同化禄等，待考证后更新
export const FEIXING_HUA: Record<string, [string, string, string, string]> = {
  '甲': ['lianzhen', 'pojun', 'wuqu', 'taiyang'],
  '乙': ['tianji', 'tianliang', 'ziwei', 'taiyin'],
  '丙': ['tiantong', 'tianji', 'wenchang', 'lianzhen'],
  '丁': ['taiyin', 'tiantong', 'tianji', 'jumen'],
  '戊': ['tanlang', 'taiyin', 'youbi', 'tianji'],
  '己': ['wuqu', 'tanlang', 'tianliang', 'wenqu'],
  '庚': ['taiyang', 'wuqu', 'taiyin', 'tiantong'],
  '辛': ['jumen', 'taiyang', 'wenqu', 'wenchang'],
  '壬': ['tianliang', 'ziwei', 'zuobi', 'wuqu'],
  '癸': ['pojun', 'jumen', 'taiyin', 'tanlang'],
}

/**
 * 钦天四化（四化派）
 * 强调四化的先后天变化
 */
export const SIHUA_HUA: Record<string, [string, string, string, string]> = {
  '甲': ['lianzhen', 'pojun', 'wuqu', 'taiyang'],
  '乙': ['tianji', 'tianliang', 'ziwei', 'taiyin'],
  '丙': ['tiantong', 'tianji', 'wenchang', 'lianzhen'],
  '丁': ['taiyin', 'tiantong', 'tianji', 'jumen'],
  '戊': ['tanlang', 'taiyin', 'youbi', 'tianji'],
  '己': ['wuqu', 'tanlang', 'tianliang', 'wenqu'],
  '庚': ['taiyang', 'wuqu', 'taiyin', 'tiantong'],
  '辛': ['jumen', 'taiyang', 'wenqu', 'wenchang'],
  '壬': ['tianliang', 'ziwei', 'zuobi', 'wuqu'],
  '癸': ['pojun', 'jumen', 'taiyin', 'tanlang'],
}

/**
 * 倪海厦派四化
 * 倪师四化在部分星曜上有调整
 */
export const NISHI_HUA: Record<string, [string, string, string, string]> = {
  '甲': ['lianzhen', 'pojun', 'wuqu', 'taiyang'],
  '乙': ['tianji', 'tianliang', 'ziwei', 'taiyin'],
  '丙': ['tiantong', 'tianji', 'wenchang', 'lianzhen'],
  '丁': ['taiyin', 'tiantong', 'tianji', 'jumen'],
  '戊': ['tanlang', 'taiyin', 'youbi', 'tianji'],
  '己': ['wuqu', 'tanlang', 'tianliang', 'wenqu'],
  '庚': ['taiyang', 'wuqu', 'taiyin', 'tiantong'],
  '辛': ['jumen', 'taiyang', 'wenqu', 'wenchang'],
  '壬': ['tianliang', 'ziwei', 'zuobi', 'wuqu'],
  '癸': ['pojun', 'jumen', 'taiyin', 'tanlang'],
}

/**
 * 四化类型标签
 */
const HUA_TYPES: HuaType[] = ['禄', '权', '科', '忌']

/**
 * 获取指定流派的四化表
 */
function getHuaTable(school: School = 'sanhe'): Record<string, [string, string, string, string]> {
  switch (school) {
    case 'feixing': return FEIXING_HUA
    case 'sihua': return SIHUA_HUA
    case 'nishi': return NISHI_HUA
    default: return SANHE_HUA
  }
}

/**
 * 根据天干获取四化星曜
 * 
 * @param stem 天干
 * @param school 流派
 * @returns 四化数据数组 [化禄星, 化权星, 化科星, 化忌星]
 */
export function getHuaByStem(stem: HeavenlyStem, school: School = 'sanhe'): HuaData[] {
  const table = getHuaTable(school)
  const huaStars = table[stem]
  if (!huaStars) return []
  
  return huaStars.map((starId, idx) => ({
    starId,
    type: HUA_TYPES[idx]
  }))
}

/**
 * 根据某颗星和天干，判断它是否被四化
 */
export function getStarHua(stem: HeavenlyStem, starId: string, school: School = 'sanhe'): HuaType | null {
  const table = getHuaTable(school)
  const huaStars = table[stem]
  if (!huaStars) return null
  
  const idx = huaStars.indexOf(starId)
  if (idx === -1) return null
  return HUA_TYPES[idx]
}

/**
 * 大限四化
 * 根据大限所在宫位的天干，计算该大限的四化
 * 
 * @param decadeStem 大限宫天干
 * @param school 流派
 * @returns 该大限的四化星曜
 */
export function getDecadeHua(decadeStem: HeavenlyStem, school: School = 'sanhe'): HuaData[] {
  return getHuaByStem(decadeStem, school)
}

/**
 * 流年四化
 * 根据流年天干计算四化
 * 
 * @param year 流年（公历）
 * @param school 流派
 * @returns 四化星曜
 */
export function getYearlyHua(year: number, school: School = 'sanhe'): HuaData[] {
  // 年柱天干
  const stemIdx = (year - 4) % 10
  const stem = HEAVENLY_STEMS[((stemIdx % 10) + 10) % 10]
  return getHuaByStem(stem, school)
}

/**
 * 流月四化
 * 根据流年天干和流月数计算
 */
export function getMonthlyHua(yearStem: HeavenlyStem, month: number, school: School = 'sanhe'): HuaData[] {
  // 月干由年干决定
  const monthStemStart: Record<string, number> = {
    '甲': 2, '乙': 4, '丙': 6, '丁': 8, '戊': 0,
    '己': 2, '庚': 4, '辛': 6, '壬': 8, '癸': 0,
  }
  const startIdx = monthStemStart[yearStem] ?? 2
  const stemIdx = (startIdx + month - 1) % 10
  const stem = HEAVENLY_STEMS[stemIdx]
  return getHuaByStem(stem, school)
}

/**
 * 流日四化
 */
export function getDailyHua(yearStem: HeavenlyStem, yearBranch: string, month: number, day: number, school: School = 'sanhe'): HuaData[] {
  // 日干通过公历日期计算
  // 简化：偏移量基于年月日
  const baseIdx = HEAVENLY_STEMS.indexOf(yearStem)
  const totalShift = (month * 30 + day) % 10
  const stemIdx = (baseIdx + totalShift) % 10
  const stem = HEAVENLY_STEMS[stemIdx]
  return getHuaByStem(stem, school)
}

/**
 * 本命四化汇总
 * 返回所有星曜的四化信息
 */
export function getAllMingHua(stem: HeavenlyStem, school: School = 'sanhe'): HuaData[] {
  return getHuaByStem(stem, school)
}
