/**
 * 命宫身宫 + 十二宫排布算法
 * 
 * 核心规则（中州派三合）：
 *   命宫：从寅宫起正月，顺数至出生月，再逆数至出生时
 *   身宫：从寅宫起正月，顺数至出生月，再顺数至出生时
 * 
 * 十二宫固定顺序（逆时针排列）：
 *   命宫 → 兄弟宫 → 夫妻宫 → 子女宫 → 财帛宫 → 疾厄宫
 *   → 迁移宫 → 交友宫 → 官禄宫 → 田宅宫 → 福德宫 → 父母宫
 * 
 * 地支序号：寅=3, 卯=4, ..., 丑=2
 * 十二宫序号：命宫=0, ..., 父母宫=11
 */

import { 
  EarthBranch, HeavenlyStem, PalaceName, FiveElementPhase,
  PalaceInfo, HuaType,
  getBranchByIndex, getStemByIndex, getBranchIndex, getStemIndex,
  EARTH_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES
} from '../types'
import { calcElementPhase } from './five-elements'

/** 五行局 → 5行的映射 */
const ELEMENT_PHASE_MAP: Record<FiveElementPhase, number> = {
  '水二局': 2, '木三局': 3, '金四局': 4, '土五局': 5, '火六局': 6,
}

/**
 * 根据农历月时计算命宫位置
 * 
 * @param lunarMonth 农历月份（1~12）
 * @param timeBranchIndex 时辰地支编号（0=子, 1=丑, ..., 11=亥）
 * @param isLeapMonth 是否为闰月
 * @returns 命宫地支编号（1=子, 2=丑, ..., 12=亥）
 */
export function calcMingPalace(
  lunarMonth: number, 
  timeBranchIndex: number, 
  isLeapMonth: boolean = false
): number {
  // 从寅宫（地支索引=3）起正月，顺数到出生月
  const startBranch = 3  // 寅
  
  // 闰月以该月15日之前的节气为准，这里简化：闰月以该月为基准
  const monthOffset = lunarMonth - 1  // 正月偏移0
  const monthBranch = ((startBranch - 1 + monthOffset) % 12) + 1
  
  // 从出生月支逆数到时支
  let palaceIndex = monthBranch - timeBranchIndex
  if (palaceIndex <= 0) palaceIndex += 12
  
  return palaceIndex
}

/**
 * 计算身宫位置
 * 
 * @param lunarMonth 农历月份
 * @param timeBranchIndex 时辰索引
 * @returns 身宫地支编号
 */
export function calcShenPalace(lunarMonth: number, timeBranchIndex: number): number {
  const startBranch = 3  // 寅
  const monthOffset = lunarMonth - 1
  const monthBranch = ((startBranch - 1 + monthOffset) % 12) + 1
  
  // 从出生月支顺数到时支
  let palaceIndex = monthBranch + timeBranchIndex
  if (palaceIndex > 12) palaceIndex -= 12
  
  return palaceIndex
}

/**
 * 由命宫地支推十二宫
 * 十二宫顺序（逆时针）：
 *   命宫 → 兄弟(命-1) → 夫妻(命-2) → 子女(命-3) → 财帛(命-4) → 疾厄(命-5)
 *   → 迁移(命-6) → 交友(命-7) → 官禄(命-8) → 田宅(命-9) → 福德(命-10) → 父母(命-11)
 * 
 * @param mingIndex 命宫地支编号（1~12）
 * @returns 十二宫对应的地支编号数组 [命宫, 兄弟, 夫妻, ..., 父母]
 */
export function getPalaceBranches(mingIndex: number): number[] {
  const palaces: number[] = []
  for (let i = 0; i < 12; i++) {
    let idx = mingIndex - i
    if (idx <= 0) idx += 12
    palaces.push(idx)
  }
  return palaces
}

/**
 * 命宫天干计算（五虎遁年起月法）
 * 用生年天干推出命宫天干
 * 
 * 口诀：甲己之年丙作首，乙庚之岁戊为头，
 *       丙辛必定寻庚起，丁壬壬位顺行流，
 *       若问戊癸何处觅，甲寅之上好追求。
 * 
 * 从寅宫起正月，命宫地支为某月，推出天干
 */
export function calcPalaceStem(yearStemIndex: number, palaceBranchIndex: number): HeavenlyStem {
  // 五虎遁：寅宫正月天干起始
  // 甲己→丙(2), 乙庚→戊(4), 丙辛→庚(6), 丁壬→壬(8), 戊癸→甲(0)
  // 公式：startStem = (年干索引 * 2 + 2) % 10
  // 验证：甲0→2✓ 乙1→4✓ 丙2→6✓ 丁3→8✓ 戊4→0✓ 己5→2✓ 庚6→4✓ 辛7→6✓ 壬8→8✓ 癸9→0✓
  const startStem = ((yearStemIndex % 10) * 2 + 2) % 10
  
  // 寅=3，寅宫天干=startStem
  // 地支比寅多几，天干就加几
  const branchDiff = ((palaceBranchIndex - 3) % 12 + 12) % 12
  const stemIdx = ((startStem + branchDiff) % 10 + 10) % 10
  
  return HEAVENLY_STEMS[stemIdx]
}

/**
 * 命主计算（依据命宫地支）
 * 数据来源: iztro earthlyBranches.soul
 * 子→贪狼, 丑→巨门, 寅→禄存, 卯→文曲,
 * 辰→廉贞, 巳→武曲, 午→破军, 未→武曲,
 * 申→廉贞, 酉→文曲, 戌→禄存, 亥→巨门
 */
export function calcMingMaster(mingBranchIndex: number): string {
  const map: Record<number, string> = {
    1: '贪狼', 2: '巨门', 3: '禄存', 4: '文曲',
    5: '廉贞', 6: '武曲', 7: '破军', 8: '武曲',
    9: '廉贞', 10: '文曲', 11: '禄存', 12: '巨门',
  }
  return map[mingBranchIndex] || ''
}

/**
 * 身主计算（依据生年地支）
 * 数据来源: iztro earthlyBranches.body
 * 子→火星, 丑→天相, 寅→天梁, 卯→天同,
 * 辰→文昌, 巳→天机, 午→火星, 未→天相,
 * 申→天梁, 酉→天同, 戌→文昌, 亥→天机
 */
export function calcShenMaster(yearBranchIndex: number): string {
  const map: Record<number, string> = {
    1: '火星', 2: '天相', 3: '天梁', 4: '天同',
    5: '文昌', 6: '天机', 7: '火星', 8: '天相',
    9: '天梁', 10: '天同', 11: '文昌', 12: '天机',
  }
  return map[yearBranchIndex] || ''
}

/**
 * 构建完整的十二宫基础信息
 * 
 * @param mingBranchIndex 命宫地支编号
 * @param shenBranchIndex 身宫地支编号
 * @param yearStemIndex 年干索引
 * @returns 十二宫基础信息数组
 */
export function buildPalaces(
  mingBranchIndex: number,
  shenBranchIndex: number,
  yearStemIndex: number
): Omit<PalaceInfo, 'mainStars' | 'minorStars' | 'shaStars' | 'miscStars' | 'hua'>[] {
  const branchIndices = getPalaceBranches(mingBranchIndex)
  
  return branchIndices.map((branchIndex, idx) => {
    const stem = calcPalaceStem(yearStemIndex, branchIndex)
    const branch = EARTH_BRANCHES[branchIndex - 1]
    const name = PALACE_NAMES[idx]
    
    return {
      name,
      stem,
      branch,
      branchIndex,
      isMing: idx === 0,
      isShen: branchIndex === shenBranchIndex,
      mainStars: [],
      minorStars: [],
      shaStars: [],
      miscStars: [],
      hua: [],
    }
  })
}
