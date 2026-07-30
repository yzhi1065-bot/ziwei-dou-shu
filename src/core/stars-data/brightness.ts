/**
 * 庙旺落陷亮度对照表
 * 依据：《紫微斗数全书》卷三·诸星庙旺表
 * 参照：中州派庙旺落陷规则
 * 
 * 亮度等级（从高到低）：
 *   庙(wonderful) 旺(flourishing) 得地(proper) 利益(beneficial) 
 *   平和(flat) 不得地(improper) 落陷(fallen)
 * 
 * 行索引：地支（子1~亥12）
 * 列索引：星曜ID
 */

export type BrightnessLevel = 
  | '庙'    // 星光最亮，吉星最吉，凶星不凶
  | '旺'    // 光强，吉星得力，凶星减凶
  | '得地'  // 光明，吉星有用，凶星稍凶
  | '利益'  // 有利，吉星力弱，凶星为祸
  | '平和'  // 平常，吉凶均不显
  | '不得地' // 失力，吉星无力，凶星加凶
  | '落陷'  // 沦落，吉星不吉，凶星大凶

/** 亮度等级数值化（用于排序和计算） */
export const BRIGHTNESS_VALUE: Record<BrightnessLevel, number> = {
  '庙': 5,
  '旺': 4,
  '得地': 3,
  '利益': 2,
  '平和': 1,
  '不得地': -1,
  '落陷': -2
}

/**
 * 星曜亮度表 [地支索引1~12][星曜ID]
 * 地支索引：1=子, 2=丑, 3=寅, 4=卯, 5=辰, 6=巳,
 *          7=午, 8=未, 9=申, 10=酉, 11=戌, 12=亥
 * null = 该星不在此宫
 */
export const BRIGHTNESS_TABLE: Record<string, (BrightnessLevel | null)[]> = {
  // ---- 14主星 ----
  ziwei: [
    '庙',    // 子
    '旺',    // 丑
    '得地',  // 寅
    '旺',    // 卯
    '得地',  // 辰
    '旺',    // 巳
    '庙',    // 午
    '旺',    // 未
    '得地',  // 申
    '旺',    // 酉
    '得地',  // 戌
    '旺',    // 亥
  ],
  tianji: [
    '得地',  // 子
    '不得地', // 丑
    '利益',  // 寅
    '旺',    // 卯
    '不得地', // 辰
    '利益',  // 巳
    '落陷',  // 午
    '旺',    // 未
    '利益',  // 申
    '旺',    // 酉
    '落陷',  // 戌
    '平和',  // 亥
  ],
  taiyang: [
    '落陷',  // 子
    '落陷',  // 丑
    '得地',  // 寅
    '旺',    // 卯
    '旺',    // 辰
    '庙',    // 巳
    '庙',    // 午
    '庙',    // 未
    '旺',    // 申
    '得地',  // 酉
    '落陷',  // 戌
    '落陷',  // 亥
  ],
  wuqu: [
    '旺',    // 子
    '庙',    // 丑
    '得地',  // 寅
    '庙',    // 卯
    '庙',    // 辰
    '旺',    // 巳
    '庙',    // 午
    '得地',  // 未
    '平',    // 申
    '旺',    // 酉
    '落陷',  // 戌
    '得地',  // 亥
  ],
  tiantong: [
    '庙',    // 子
    '不得地', // 丑
    '利益',  // 寅
    '旺',    // 卯
    '利益',  // 辰
    '旺',    // 巳
    '落陷',  // 午
    '庙',    // 未
    '旺',    // 申
    '旺',    // 酉
    '得地',  // 戌
    '平和',  // 亥
  ],
  lianzhen: [
    '旺',    // 子
    '平和',  // 丑
    '平和',  // 寅
    '落陷',  // 卯
    '利益',  // 辰
    '庙',    // 巳
    '庙',    // 午
    '得地',  // 未
    '利益',  // 申
    '旺',    // 酉
    '落陷',  // 戌
    '旺',    // 亥
  ],
  tianfu: [
    '庙',    // 子
    '旺',    // 丑
    '得地',  // 寅
    '旺',    // 卯
    '得地',  // 辰
    '庙',    // 巳
    '庙',    // 午
    '旺',    // 未
    '得地',  // 申
    '旺',    // 酉
    '得地',  // 戌
    '庙',    // 亥
  ],
  taiyin: [
    '庙',    // 子
    '庙',    // 丑
    '得地',  // 寅
    '旺',    // 卯
    '落陷',  // 辰
    '利益',  // 巳
    '落陷',  // 午
    '庙',    // 未
    '庙',    // 申
    '旺',    // 酉
    '得地',  // 戌
    '平和',  // 亥
  ],
  tanlang: [
    '旺',    // 子
    '不得地', // 丑
    '旺',    // 寅
    '落陷',  // 卯
    '庙',    // 辰
    '得地',  // 巳
    '落陷',  // 午
    '旺',    // 未
    '庙',    // 申
    '旺',    // 酉
    '落陷',  // 戌
    '庙',    // 亥
  ],
  jumen: [
    '庙',    // 子
    '旺',    // 丑
    '平和',  // 寅
    '旺',    // 卯
    '落陷',  // 辰
    '旺',    // 巳
    '庙',    // 午
    '得地',  // 未
    '利益',  // 申
    '旺',    // 酉
    '落陷',  // 戌
    '平和',  // 亥
  ],
  tianxiang: [
    '庙',    // 子
    '得地',  // 丑
    '得地',  // 寅
    '平和',  // 卯
    '庙',    // 辰
    '庙',    // 巳
    '落陷',  // 午
    '得地',  // 未
    '旺',    // 申
    '平和',  // 酉
    '庙',    // 戌
    '旺',    // 亥
  ],
  tianliang: [
    '庙',    // 子
    '得地',  // 丑
    '庙',    // 寅
    '旺',    // 卯
    '得地',  // 辰
    '旺',    // 巳
    '落陷',  // 午
    '得地',  // 未
    '庙',    // 申
    '旺',    // 酉
    '得地',  // 戌
    '旺',    // 亥
  ],
  qisha: [
    '旺',    // 子
    '得地',  // 丑
    '旺',    // 寅
    '庙',    // 卯
    '得地',  // 辰
    '旺',    // 巳
    '庙',    // 午
    '得地',  // 未
    '旺',    // 申
    '庙',    // 酉
    '落陷',  // 戌
    '旺',    // 亥
  ],
  pojun: [
    '庙',    // 子
    '旺',    // 丑
    '旺',    // 寅
    '平和',  // 卯
    '得地',  // 辰
    '得地',  // 巳
    '落陷',  // 午
    '旺',    // 未
    '庙',    // 申
    '得地',  // 酉
    '落陷',  // 戌
    '旺',    // 亥
  ],
  // ---- 辅星 ----
  zuobi: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  youbi: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  wenchang: [
    '旺',    // 子
    '庙',    // 丑
    '得地',  // 寅
    '旺',    // 卯
    '庙',    // 辰
    '旺',    // 巳
    '落陷',  // 午
    '平和',  // 未
    '得地',  // 申
    '旺',    // 酉
    '庙',    // 戌
    '得地',  // 亥
  ],
  wenqu: [
    '旺',    // 子
    '庙',    // 丑
    '得地',  // 寅
    '旺',    // 卯
    '庙',    // 辰
    '旺',    // 巳
    '落陷',  // 午
    '平和',  // 未
    '得地',  // 申
    '旺',    // 酉
    '庙',    // 戌
    '得地',  // 亥
  ],
  tiankui: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  tianyue: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  lucun: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  tianma: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  // ---- 煞星 ----
  qingyang: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  tuoluo: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  huoxing: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  lingxing: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  dikong: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
  dijie: [
    null, null, null, null, null, null, null, null, null, null, null, null
  ],
}

/** 获取星曜在指定地支的亮度 */
export function getStarBrightness(starId: string, earthBranch: number): BrightnessLevel | null {
  const table = BRIGHTNESS_TABLE[starId]
  if (!table) return null
  return table[earthBranch - 1] ?? null
}

/** 获取亮度数值分数 */
export function getBrightnessScore(level: BrightnessLevel | null): number {
  if (!level) return 0
  return BRIGHTNESS_VALUE[level] ?? 0
}
