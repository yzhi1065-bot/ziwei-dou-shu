/**
 * 紫微斗数安星法（14主星排布）
 * 
 * 核心规则（中州派三合）：
 *   1. 紫微星定位：根据五行局数和农历生日确定
 *   2. 紫微系（顺行）：紫微→天机(1)→空→太阳(3)→武曲(4)→天同(5)→空→廉贞(7)
 *   3. 天府系（逆行）：天府→太阴(1)→贪狼(2)→巨门(3)→天相(4)→天梁(5)→七杀(6)→空→破军(8)
 * 
 * 紫微星定位表（五行局 × 生日）：
 *   水二局：2个一组
 *   木三局：3个一组
 *   金四局：4个一组
 *   土五局：5个一组
 *   火六局：6个一组
 * 
 * 定位算法：
 *   局数除生日取整商N，余数R
 *   紫微在寅宫 + N - (R是否为0 ? 0 : 1)
 *   实际计算结果查表得到具体宫位
 */

import { FiveElementPhase } from '../types'
import { getPhaseNumber } from './five-elements'

/**
 * 紫微星定位表 [五行局序号0~4][生日1~30]
 * 行0=水二局, 1=木三局, 2=金四局, 3=土五局, 4=火六局
 * 值=紫微星地支索引(1~12)
 * 
 * 紫微星定位口诀：
 *   水二局：2日一组，紫微从寅宫开始
 *   木三局：3日一组
 *   金四局：4日一组
 *   土五局：5日一组
 *   火六局：6日一组
 */
export const ZIWEI_TABLE: number[][] = [
  // 水二局（0）
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // to be filled
  // 木三局（1）
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // 金四局（2）
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // 土五局（3）
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // 火六局（4）
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

/**
 * 构建紫微星定位表
 * 紫微从寅宫(3)开始，按局数分组递增
 */
function buildZiweiTable(): void {
  const phaseOrder = [2, 3, 4, 5, 6]  // 水土金土火
  const startBranch = 3  // 寅宫
  
  for (let phaseIdx = 0; phaseIdx < 5; phaseIdx++) {
    const n = phaseOrder[phaseIdx]  // 局数
    let branch = startBranch
    
    for (let day = 1; day <= 30; day++) {
      ZIWEI_TABLE[phaseIdx][day - 1] = branch
      
      // 每隔n天进一位
      if (day % n === 0) {
        branch++
        if (branch > 12) branch = 1
      }
    }
  }
}

// 初始化紫微定位表
buildZiweiTable()

/**
 * 紫微系顺行偏移（相对于紫微星的偏移量，0=紫微所在宫位）
 * 紫微(0) → 天机(1) → 空(跳过) → 太阳(3) → 武曲(4) → 天同(5) → 空 → 廉贞(7)
 */
const ZIWEI_SERIES_OFFSETS = [0, 1, -1, 3, 4, 5, -1, 7]

/**
 * 天府系逆行偏移（相对于天府星的偏移量，0=天府所在宫位）
 * 天府(0) → 太阴(1) → 贪狼(2) → 巨门(3) → 天相(4) → 天梁(5) → 七杀(6) → 空 → 破军(8)
 */
const TIANFU_SERIES_OFFSETS = [0, 1, 2, 3, 4, 5, 6, -1, 8]

/**
 * 紫微系星曜ID列表（按偏移顺序）
 */
const ZIWEI_STAR_IDS = ['ziwei', 'tianji', '', 'taiyang', 'wuqu', 'tiantong', '', 'lianzhen']

/**
 * 天府系星曜ID列表（按偏移顺序）
 */
const TIANFU_STAR_IDS = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', '', 'pojun']

/**
 * 定位紫微在命盘中的位置
 * 
 * @param phase 五行局
 * @param lunarDay 农历生日（1~30）
 * @returns 紫微所在的地支编号（1=子, ..., 12=亥）
 */
export function calcZiweiPosition(phase: FiveElementPhase, lunarDay: number): number {
  const phaseMap: Record<FiveElementPhase, number> = {
    '水二局': 0,
    '木三局': 1,
    '金四局': 2,
    '土五局': 3,
    '火六局': 4,
  }
  
  const phaseIdx = phaseMap[phase]
  if (lunarDay < 1 || lunarDay > 30) {
    console.warn(`农历生日超出范围: ${lunarDay}，使用默认值15`)
    return ZIWEI_TABLE[phaseIdx][14]
  }
  
  return ZIWEI_TABLE[phaseIdx][lunarDay - 1]
}

/**
 * 获取天府位置（与紫微对称关系）
 * 天府 = 紫微的对称宫位（寅申线对称）
 * 
 * 口诀：
 *   紫微在寅，天府在辰
 *   紫微在卯，天府在卯
 *   紫微在辰，天府在寅
 *   紫微在巳，天府在丑
 *   紫微在午，天府在子
 *   紫微在未，天府在亥
 *   紫微在申，天府在戌
 *   紫微在酉，天府在酉
 *   紫微在戌，天府在申
 *   紫微在亥，天府在未
 *   紫微在子，天府在午
 *   紫微在丑，天府在巳
 * 
 * 简化公式：天府 = 14 - 紫微 + 4（在模12下）
 */
export function calcTianfuPosition(ziweiBranch: number): number {
  // 天府 = 4 - (紫微 - 4)  mod 12
  // 紫微在寅(3) => 天府在辰(5)
  // 紫微在卯(4) => 天府在卯(4)
  // 紫微在辰(5) => 天府在寅(3)
  // 紫微在巳(6) => 天府在丑(2)
  // 紫微在午(7) => 天府在子(1)
  // 紫微在未(8) => 天府在亥(12)
  // 紫微在申(9) => 天府在戌(11)
  // 紫微在酉(10) => 天府在酉(10)
  // 紫微在戌(11) => 天府在申(9)
  // 紫微在亥(12) => 天府在未(8)
  // 紫微在子(1) => 天府在午(7)
  // 紫微在丑(2) => 天府在巳(6)
  
  // 公式：天府 = (8 - 紫微) % 12 的修正
  const tianfu = (8 - ziweiBranch) % 12
  return ((tianfu % 12) + 12) % 12 || 12
}

/**
 * 安星结果
 */
export interface StarPlacementResult {
  /** 紫微星位置 */
  ziweiBranch: number
  /** 天府星位置 */
  tianfuBranch: number
  /** [星曜ID] → 地支编号 的映射 */
  starMap: Record<string, number>
}

/**
 * 完整14主星安星法
 * 
 * @param phase 五行局
 * @param lunarDay 农历生日
 * @returns 所有主星的位置映射
 */
export function placeMainStars(phase: FiveElementPhase, lunarDay: number): StarPlacementResult {
  const ziweiBranch = calcZiweiPosition(phase, lunarDay)
  const tianfuBranch = calcTianfuPosition(ziweiBranch)
  
  const starMap: Record<string, number> = {}
  
  // 紫微系（从紫微所在宫位开始，顺行排布）
  for (let i = 0; i < ZIWEI_STAR_IDS.length; i++) {
    const starId = ZIWEI_STAR_IDS[i]
    if (!starId) continue  // 跳过空位
    const offset = ZIWEI_SERIES_OFFSETS[i]
    let branch = ziweiBranch + offset
    if (branch > 12) branch -= 12
    starMap[starId] = branch
  }
  
  // 天府系（从天府所在宫位开始，逆行排布）
  for (let i = 0; i < TIANFU_STAR_IDS.length; i++) {
    const starId = TIANFU_STAR_IDS[i]
    if (!starId) continue  // 跳过空位
    const offset = TIANFU_SERIES_OFFSETS[i]
    let branch = tianfuBranch - offset
    if (branch < 1) branch += 12
    starMap[starId] = branch
  }
  
  return { ziweiBranch, tianfuBranch, starMap }
}

/**
 * 直接获取14主星在指定五行局和生日的完整排布
 */
export function get14MainStarsPlacement(phase: FiveElementPhase, lunarDay: number): Record<string, number> {
  return placeMainStars(phase, lunarDay).starMap
}
