/**
 * 辅星排布算法
 * 
 * 排布规则：
 *   左辅右弼：月支起，左辅顺行，右弼逆行
 *   文昌文曲：时干起，文昌逆行，文曲顺行
 *   天魁天钺：年干起，按口诀定位
 *   禄存擎羊陀罗：年干起，禄存定位后，擎羊在禄前，陀罗在禄后
 *   火星铃星：年支+时支
 *   地空地劫：时支起
 *   天马：年支起
 */

import { EarthBranch, HeavenlyStem, getBranchIndex, getStemIndex, EARTH_BRANCHES, HEAVENLY_STEMS } from '../types'

/** 辅星ID列表 */
type MinorStarId = string

/**
 * 左辅星排布
 * 从辰宫起正月，顺数到出生月
 * 口诀：左辅辰(5)起正月，顺数至生月
 */
export function calcZuoBi(month: number): number {
  const start = 5  // 辰
  return ((start - 1 + month - 1) % 12) + 1
}

/**
 * 右弼星排布
 * 从戌宫起正月，逆数到出生月
 * 口诀：右弼戌(11)起正月，逆数至生月
 */
export function calcYouBi(month: number): number {
  const start = 11  // 戌
  return ((start - 1 - (month - 1)) % 12 + 12) % 12 + 1
}

/**
 * 文昌星排布
 * 从戌宫起子时，逆数到生时
 * 口诀：文昌戌(11)起子，逆数至生时
 */
export function calcWenChang(timeBranchIndex: number): number {
  const start = 11  // 戌
  return ((start - 1 - timeBranchIndex) % 12 + 12) % 12 + 1
}

/**
 * 文曲星排布
 * 从辰宫起子时，顺数到生时
 * 口诀：文曲辰(5)起子，顺数至生时
 */
export function calcWenQu(timeBranchIndex: number): number {
  const start = 5  // 辰
  return ((start - 1 + timeBranchIndex) % 12) + 1
}

/**
 * 天魁星排布（阳贵）
 * 口诀：甲戊庚牛羊(丑未)，乙己鼠猴乡(子申)，
 *       丙丁猪鸡位(亥酉)，壬癸蛇兔藏(巳卯)，
 *       六辛逢虎马(寅午)
 * 
 * 返回：[天魁地支编号, 天钺地支编号]
 */
export function calcTianKuiTianYue(yearStemIndex: number): [number, number] {
  // 口诀：甲戊庚牛羊(丑未)，乙己鼠猴乡(子申)，
  //       丙丁猪鸡位(亥酉)，辛逢虎马(寅午)，
  //       壬癸蛇兔(巳卯)
  // 数据来源: 文墨天机/iztro 验证
  const table: Record<number, [number, number]> = {
    0: [2, 8],   // 甲 → 丑(2), 未(8)
    1: [1, 9],   // 乙 → 子(1), 申(9)
    2: [12, 10], // 丙 → 亥(12), 酉(10)
    3: [12, 10], // 丁 → 亥(12), 酉(10)
    4: [2, 8],   // 戊 → 丑(2), 未(8)
    5: [1, 9],   // 己 → 子(1), 申(9)
    6: [2, 8],   // 庚 → 丑(2), 未(8)
    7: [7, 3],   // 辛 → 午(7), 寅(3)
    8: [4, 6],   // 壬 → 卯(4), 巳(6)
    9: [4, 6],   // 癸 → 卯(4), 巳(6)
  }
  return table[yearStemIndex] || [2, 8]
}

/**
 * 禄存星排布
 * 口诀：甲禄到寅(3)，乙禄到卯(4)，
 *       丙戊禄在巳(6)，丁己禄在午(7)，
 *       庚禄居申(9)，辛禄在酉(10)，
 *       壬禄在亥(12)，癸禄在子(1)
 */
export function calcLuCun(yearStemIndex: number): number {
  const table: Record<number, number> = {
    0: 3,   // 甲 → 寅
    1: 4,   // 乙 → 卯
    2: 6,   // 丙 → 巳
    3: 7,   // 丁 → 午
    4: 6,   // 戊 → 巳
    5: 7,   // 己 → 午
    6: 9,   // 庚 → 申
    7: 10,  // 辛 → 酉
    8: 12,  // 壬 → 亥
    9: 1,   // 癸 → 子
  }
  return table[yearStemIndex] || 3
}

/**
 * 擎羊(在前)、陀罗(在后)
 * 禄前为擎羊，禄后为陀罗
 * 前 = 顺时针下一宫，后 = 逆时针下一宫
 */
export function calcQingYang(luCunBranch: number): number {
  return (luCunBranch % 12) + 1
}

export function calcTuoLuo(luCunBranch: number): number {
  return ((luCunBranch - 2) % 12 + 12) % 12 + 1
}

/**
 * 火星排布
 * 口诀：寅午戌年，火星从丑起子时，顺数至生时
 *       申子辰年，火星从寅起子时，顺数至生时
 *       巳酉丑年，火星从卯起子时，顺数至生时
 *       亥卯未年，火星从酉起子时，顺数至生时
 * 
 * 简化处理：使用年支四组定位
 */
export function calcHuoXing(yearBranchIndex: number, timeBranchIndex: number): number {
  // 年支分组，确定起始宫
  const startTable: Record<number, number> = {
    3: 10,   // 寅 → 从丑(10)起  ... wait, 丑=2
    7: 3,    // 午 → 寅(3)
    11: 2,   // 戌 → 丑(2)
    1: 3,    // 子 → 寅(3)
    5: 3,    // 辰 → 寅(3)
    9: 3,    // 申 → 寅(3)
    4: 4,    // 卯 → 卯(4)
    8: 4,    // 未 → 卯(4)
    12: 4,   // 亥 → 卯(4)
    2: 10,   // 丑 → 酉(10)
    6: 10,   // 巳 → 酉(10)
    10: 10,  // 酉 → 酉(10)
  }
  
  // 火星规则：寅午戌人丑卯酉，申子辰人寅卯丑
  // （简化版：四种年支组的火星定位不同）
  const fireGroup: Record<number, { start: number; forward: boolean }> = {
    3: { start: 2, forward: true },   // 寅
    7: { start: 2, forward: true },   // 午
    11: { start: 2, forward: true },  // 戌
    1: { start: 3, forward: true },   // 子
    5: { start: 3, forward: true },   // 辰
    9: { start: 3, forward: true },   // 申
    4: { start: 4, forward: true },   // 卯
    8: { start: 4, forward: true },   // 未
    12: { start: 4, forward: true },  // 亥
    2: { start: 10, forward: true },  // 丑
    6: { start: 10, forward: true },  // 巳
    10: { start: 10, forward: true }, // 酉
  }
  
  const group = fireGroup[yearBranchIndex] || { start: 2, forward: true }
  if (group.forward) {
    return ((group.start - 1 + timeBranchIndex) % 12) + 1
  } else {
    return ((group.start - 1 - timeBranchIndex) % 12 + 12) % 12 + 1
  }
}

/**
 * 铃星排布
 * 类似火星，但起始位置不同
 */
export function calcLingXing(yearBranchIndex: number, timeBranchIndex: number): number {
  const bellGroup: Record<number, { start: number; forward: boolean }> = {
    3: { start: 11, forward: true },   // 寅
    7: { start: 11, forward: true },   // 午
    11: { start: 11, forward: true },  // 戌
    1: { start: 4, forward: true },    // 子
    5: { start: 4, forward: true },    // 辰
    9: { start: 4, forward: true },    // 申
    4: { start: 3, forward: true },    // 卯
    8: { start: 3, forward: true },    // 未
    12: { start: 3, forward: true },   // 亥
    2: { start: 9, forward: true },    // 丑
    6: { start: 9, forward: true },    // 巳
    10: { start: 9, forward: true },   // 酉
  }
  
  const group = bellGroup[yearBranchIndex] || { start: 11, forward: true }
  if (group.forward) {
    return ((group.start - 1 + timeBranchIndex) % 12) + 1
  } else {
    return ((group.start - 1 - timeBranchIndex) % 12 + 12) % 12 + 1
  }
}

/**
 * 地空排布
 * 从亥宫起子时，逆数至生时
 * 口诀：地空亥(12)起子，逆数至生时
 */
export function calcDiKong(timeBranchIndex: number): number {
  const start = 12  // 亥
  return ((start - 1 - timeBranchIndex) % 12 + 12) % 12 + 1
}

/**
 * 地劫排布
 * 从亥宫起子时，顺数至生时
 * 口诀：地劫亥(12)起子，顺数至生时
 */
export function calcDiJie(timeBranchIndex: number): number {
  const start = 12  // 亥
  return ((start - 1 + timeBranchIndex) % 12) + 1
}

/**
 * 天马排布
 * 口诀：寅午戌年天马在申(9)，
 *       申子辰年在寅(3)，
 *       巳酉丑年在亥(12)，
 *       亥卯未年在巳(6)
 */
export function calcTianMa(yearBranchIndex: number): number {
  const table: Record<number, number> = {
    3: 9,   // 寅 → 申
    7: 9,   // 午 → 申
    11: 9,  // 戌 → 申
    1: 3,   // 子 → 寅
    5: 3,   // 辰 → 寅
    9: 3,   // 申 → 寅
    4: 12,  // 卯 → 亥
    8: 12,  // 未 → 亥
    12: 12, // 亥 → 亥
    2: 6,   // 丑 → 巳
    6: 6,   // 巳 → 巳
    10: 6,  // 酉 → 巳
  }
  return table[yearBranchIndex] || 3
}

/**
 * 红鸾天喜
 * 红鸾：从卯起子年，顺数至年支
 * 天喜：与红鸾对宫（+6）
 */
export function calcHongLuan(yearBranchIndex: number): number {
  const start = 4  // 卯
  return ((start - 1 + yearBranchIndex - 1) % 12) + 1
}

export function calcTianXi(yearBranchIndex: number): number {
  const hongluan = calcHongLuan(yearBranchIndex)
  return ((hongluan - 1 + 6) % 12) + 1
}

/**
 * 天哭天虚
 * 天哭：与年支相关，哭在午...
 * 口诀：哭虚各有所属
 */
export function calcTianKu(yearBranchIndex: number): number {
  const table: Record<number, number> = {
    1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 12,
    7: 1, 8: 2, 9: 3, 10: 4, 11: 5, 12: 6,
  }
  return table[yearBranchIndex] || 7
}

export function calcTianXu(yearBranchIndex: number): number {
  const tianku = calcTianKu(yearBranchIndex)
  return ((tianku - 1 + 6) % 12) + 1  // 天虚与天哭对宫
}

/**
 * 三台八座
 * 三台：以生时定
 * 八座：以生时定
 * 三台顺行，八座逆行
 */
export function calcSanTai(timeBranchIndex: number): number {
  const start = 4  // 卯
  return ((start - 1 + timeBranchIndex) % 12) + 1
}

export function calcBaZuo(timeBranchIndex: number): number {
  const start = 4  // 卯... 
  return ((start - 1 - timeBranchIndex) % 12 + 12) % 12 + 1
}

/**
 * 龙池凤阁
 */
export function calcLongChi(yearBranchIndex: number): number {
  // 龙池：从辰起子年，顺数至年支
  return ((4 + yearBranchIndex - 1) % 12) + 1
}

export function calcFengGe(yearBranchIndex: number): number {
  // 凤阁：从戌起子年，顺数至年支
  return ((10 + yearBranchIndex - 1) % 12) + 1
}

/**
 * 孤辰寡宿
 */
export function calcGuChen(yearBranchIndex: number): number {
  // 孤辰：寅卯辰→巳, 巳午未→申, 申酉戌→亥, 亥子丑→寅
  const groups: Record<number, number> = {
    3: 6, 4: 6, 5: 6,     // 寅卯辰 → 巳
    6: 9, 7: 9, 8: 9,     // 巳午未 → 申
    9: 12, 10: 12, 11: 12, // 申酉戌 → 亥
    12: 3, 1: 3, 2: 3,    // 亥子丑 → 寅
  }
  return groups[yearBranchIndex] || 6
}

export function calcGuSu(yearBranchIndex: number): number {
  // 寡宿与孤辰对宫
  const guchen = calcGuChen(yearBranchIndex)
  return ((guchen - 1 + 6) % 12) + 1
}

/**
 * 天官天福
 */
export function calcTianGuan(month: number): number {
  // 天官从寅起正月，顺数
  return ((2 + month - 1) % 12) + 1
}

export function calcTianFu2(month: number): number {
  // 天福从寅起正月，顺数
  return ((2 + month - 1) % 12) + 1
}

/**
 * 台辅封诰
 */
export function calcTaiFu(timeBranchIndex: number): number {
  // 从午起子时，顺数
  return ((6 + timeBranchIndex) % 12) + 1
}

export function calcFengGao(timeBranchIndex: number): number {
  // 从申起子时，顺数
  return ((8 + timeBranchIndex) % 12) + 1
}

/**
 * 全部辅星排布
 * 
 * @returns 星曜ID → 地支编号 的映射
 */
export function placeAllMinorStars(
  month: number,           // 农历月份
  timeBranchIndex: number, // 时辰索引 0~11
  yearStemIndex: number,   // 年干索引 0~9
  yearBranchIndex: number, // 年支索引 1~12
  includeSha: boolean = true,
  includeMisc: boolean = true
): { lucky: Record<string, number>; sha: Record<string, number>; misc: Record<string, number> } {
  const lucky: Record<string, number> = {}
  const sha: Record<string, number> = {}
  const misc: Record<string, number> = {}
  
  // 吉星/辅星
  lucky['zuobi'] = calcZuoBi(month)
  lucky['youbi'] = calcYouBi(month)
  lucky['wenchang'] = calcWenChang(timeBranchIndex)
  lucky['wenqu'] = calcWenQu(timeBranchIndex)
  
  const [tiankui, tianyue] = calcTianKuiTianYue(yearStemIndex)
  lucky['tiankui'] = tiankui
  lucky['tianyue'] = tianyue
  
  lucky['lucun'] = calcLuCun(yearStemIndex)
  lucky['tianma'] = calcTianMa(yearBranchIndex)
  
  if (includeSha) {
    // 煞星
    const lucunBranch = lucky['lucun']
    sha['qingyang'] = calcQingYang(lucunBranch)
    sha['tuoluo'] = calcTuoLuo(lucunBranch)
    sha['huoxing'] = calcHuoXing(yearBranchIndex, timeBranchIndex)
    sha['lingxing'] = calcLingXing(yearBranchIndex, timeBranchIndex)
    sha['dikong'] = calcDiKong(timeBranchIndex)
    sha['dijie'] = calcDiJie(timeBranchIndex)
  }
  
  if (includeMisc) {
    // 杂曜
    misc['hongluan'] = calcHongLuan(yearBranchIndex)
    misc['tianxi'] = calcTianXi(yearBranchIndex)
    misc['tianku'] = calcTianKu(yearBranchIndex)
    misc['tianxu'] = calcTianXu(yearBranchIndex)
    misc['longchi'] = calcLongChi(yearBranchIndex)
    misc['fengge'] = calcFengGe(yearBranchIndex)
    misc['guchen'] = calcGuChen(yearBranchIndex)
    misc['gusu'] = calcGuSu(yearBranchIndex)
    misc['santai'] = calcSanTai(timeBranchIndex)
    misc['bazuo'] = calcBaZuo(timeBranchIndex)
    misc['tianguan'] = calcTianGuan(month)
    misc['tianfu2'] = calcTianFu2(month)
    misc['taifu'] = calcTaiFu(timeBranchIndex)
    misc['fenghao'] = calcFengGao(timeBranchIndex)
  }
  
  return { lucky, sha, misc }
}
