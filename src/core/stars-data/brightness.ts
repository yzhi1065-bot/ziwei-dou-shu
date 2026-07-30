/**
 * 庙旺落陷亮度对照表
 * 
 * 搬运来源: iztro (MIT) https://github.com/SylarLong/iztro
 *   STARS_INFO: 经文墨天机/元亨利贞校验
 *   详见: src/iztro/data/stars.ts
 * 
 * 亮度等级对照：
 *   miao→庙(最亮) wang→旺(明亮) de→得地(适中)
 *   li→利益(稍暗) ping→平和(平常) bu→不得地 xian→落陷
 * 
 * 行索引：地支 0=子, 1=丑, ... 11=亥 (0-indexed)
 */

export type BrightnessLevel = 
  | '庙' | '旺' | '得地' | '利益' | '平和' | '不得地' | '落陷'

const LEVEL_MAP: Record<string, BrightnessLevel> = {
  'miao': '庙', 'wang': '旺', 'de': '得地',
  'li': '利益', 'ping': '平和', 'bu': '不得地', 'xian': '落陷',
}

/** 亮度数值化 */
export const BRIGHTNESS_VALUE: Record<BrightnessLevel, number> = {
  '庙': 5, '旺': 4, '得地': 3,
  '利益': 2, '平和': 1, '不得地': -1, '落陷': -2,
}

/**
 * 星曜亮度表 [地支索引0~11]
 * 数据来自 iztro STARS_INFO
 */
const IZTRO_BRIGHTNESS: Record<string, string[]> = {
  ziwei:    ['wang','wang','de','wang','miao','miao','wang','wang','de','wang','ping','miao'],
  tianji:   ['de','wang','li','ping','miao','xian','de','wang','li','ping','miao','xian'],
  taiyang:  ['wang','miao','wang','wang','wang','de','de','xian','bu','xian','xian','bu'],
  wuqu:     ['de','li','miao','ping','wang','miao','de','li','miao','ping','wang','miao'],
  tiantong: ['li','ping','ping','miao','xian','bu','wang','ping','ping','miao','wang','bu'],
  lianzhen: ['miao','ping','li','xian','ping','li','miao','ping','li','xian','ping','li'],
  tianfu:   ['miao','de','miao','de','wang','miao','de','wang','miao','de','miao','miao'],
  taiyin:   ['wang','xian','xian','xian','bu','bu','li','bu','wang','miao','miao','miao'],
  tanlang:  ['ping','li','miao','xian','wang','miao','ping','li','miao','xian','wang','miao'],
  jumen:    ['miao','miao','xian','wang','wang','bu','miao','miao','xian','wang','wang','bu'],
  tianxiang:['miao','xian','de','de','miao','de','miao','xian','de','de','miao','miao'],
  tianliang:['miao','miao','miao','xian','miao','wang','xian','de','miao','xian','miao','wang'],
  qisha:    ['miao','wang','miao','ping','wang','miao','miao','miao','miao','ping','wang','miao'],
  pojun:    ['de','xian','wang','ping','miao','wang','de','xian','wang','ping','miao','wang'],
  wenchang: ['xian','li','de','miao','xian','li','de','miao','xian','li','de','miao'],
  wenqu:    ['ping','wang','de','miao','xian','wang','de','miao','xian','wang','de','miao'],
  zuobi:    ['de','miao','xian','li','de','miao','xian','li','de','miao','xian','li'],
  youbi:    ['de','miao','xian','li','de','miao','xian','li','de','miao','xian','li'],
  tiankui:  ['miao','wang','de','miao','xian','li','miao','wang','de','miao','xian','li'],
  tianyue:  ['miao','wang','de','miao','xian','li','miao','wang','de','miao','xian','li'],
  lucun:    ['miao','wang','de','miao','xian','li','miao','wang','de','miao','xian','li'],
  qingyang: ['','xian','miao','','xian','miao','','xian','miao','','xian','miao'],
  tuoluo:   ['xian','','miao','xian','','miao','xian','','miao','xian','','miao'],
  huoxing:  ['miao','li','xian','de','miao','li','xian','de','miao','li','xian','de'],
  lingxing: ['miao','li','xian','de','miao','li','xian','de','miao','li','xian','de'],
  tianma:   ['xian','li','wang','miao','xian','li','wang','miao','xian','li','wang','miao'],
}

/**
 * 获取星曜在指定地支的亮度
 * @param starId 星曜ID
 * @param earthBranch 地支编号（1~12）
 */
export function getStarBrightness(starId: string, earthBranch: number): BrightnessLevel | null {
  const iztroIdx = ((earthBranch - 1) % 12 + 12) % 12  // 1-indexed -> 0-indexed
  const raw = IZTRO_BRIGHTNESS[starId]?.[iztroIdx]
  if (!raw) return null
  return LEVEL_MAP[raw] ?? null
}

/** 获取亮度数值分数 */
export function getBrightnessScore(level: BrightnessLevel | null): number {
  if (!level) return 0
  return BRIGHTNESS_VALUE[level] ?? 0
}
