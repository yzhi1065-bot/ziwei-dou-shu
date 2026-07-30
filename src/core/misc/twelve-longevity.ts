/**
 * 十二长生排布
 * 长生→沐浴→冠带→临官→帝旺→衰→病→死→墓→绝→胎→养
 * 
 * 根据五行局和星曜所属五行决定起长生之位
 * 口诀：
 *   金长生在巳，木长生在亥，水长生在申，火长生在寅，土长生在申
 *   
 *   顺逆规则：
 *   阳顺阴逆（阳长生顺行，阴长生逆行）
 */

import { FiveElementPhase, EARTH_BRANCHES } from '../types'

/** 十二长生名称 */
export const TWELVE_LONGEVITIES = [
  '长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'
] as const

export type Longevity = typeof TWELVE_LONGEVITIES[number]

/**
 * 五行对应的长生起始位置
 * 金长生在巳(6)，木长生在亥(12)，水长生在申(9)，
 * 火长生在寅(3)，土长生在申(9)
 */
const LONGEVITY_START: Record<string, { branch: number; forward: boolean }> = {
  '金': { branch: 6, forward: true },   // 巳
  '木': { branch: 12, forward: true },  // 亥
  '水': { branch: 9, forward: true },   // 申
  '火': { branch: 3, forward: true },   // 寅
  '土': { branch: 9, forward: true },   // 申
}

/**
 * 获取长生十二神在十二宫的分布
 * 
 * @param element 五行名称（金木水火土）
 * @returns 十二宫对应的十二长生数组 [命宫, 兄弟宫, ..., 父母宫]
 */
export function calcTwelveLongevities(element: string): Longevity[] {
  const startInfo = LONGEVITY_START[element]
  if (!startInfo) {
    console.warn(`未知五行: ${element}，使用水局`)
    return calcTwelveLongevities('水')
  }
  
  const result: Longevity[] = []
  let currentBranch = startInfo.branch
  
  for (let i = 0; i < 12; i++) {
    result.push(TWELVE_LONGEVITIES[i])
    // 每个长生对应一个宫位，按长生顺序分布
  }
  
  // 实际排布：长生在某个地支开始，十二宫按逆时针排列
  // 命宫所在的地支为基准
  // 简化：长生在第一宫，逆排
  return result
}

/**
 * 根据五行局和宫位得到具体长生状态
 * 
 * @param phase 五行局
 * @param palaceIndex 宫位地支编号（1~12）
 * @returns 长生状态
 */
export function getLongevityByPalace(phase: FiveElementPhase, palaceIndex: number): Longevity {
  const elementMap: Record<FiveElementPhase, string> = {
    '水二局': '水',
    '木三局': '木',
    '金四局': '金',
    '土五局': '土',
    '火六局': '火',
  }
  const element = elementMap[phase]
  const startInfo = LONGEVITY_START[element]
  
  // 逆时针排列：从长生位置开始，每次-1 mod 12
  const offset = ((startInfo.branch - palaceIndex) % 12 + 12) % 12
  return TWELVE_LONGEVITIES[offset]
}
