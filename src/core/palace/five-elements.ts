/**
 * 五行局定局算法
 * 紫微斗数五行局：水二局、木三局、金四局、土五局、火六局
 * 定局依据：命宫天干 + 地支（纳音五行）
 */

import { HeavenlyStem, EarthBranch, FiveElementPhase, getStemIndex, getBranchIndex } from '../types'
import { HEAVENLY_STEMS, EARTH_BRANCHES } from '../types'

/**
 * 纳音五行表 [天干组索引0~4][地支组索引0~4]
 * 天干分组：甲子乙丑(0), 丙寅丁卯(1), 戊辰己巳(2), 庚午辛未(3), 壬申癸酉(4) → 每两个天干一组，循环
 * 地支分组：子丑午未(0), 寅卯申酉(1), 辰巳戌亥(2) → 剩余两组用特殊公式
 * 
 * 纳音五行速查表（江湖口诀）：
 *   子丑午未 → 甲子乙丑海中金(金4), 丙寅丁卯炉中火(火6)...
 * 
 * 紫微斗数专有算法：
 *   命宫干支 → 计算其纳音 → 除以4取整得到五行局数
 *   即：纳音五行数 / 4 = 局数
 *   金=4, 木=3, 水=2, 火=6, 土=5
 */
const NAYIN_ELEMENT: Record<string, number> = {
  // 甲子乙丑组 → 金4
  '甲子': 4, '乙丑': 4,
  // 丙寅丁卯组 → 火6
  '丙寅': 6, '丁卯': 6,
  // 戊辰己巳组 → 木3
  '戊辰': 3, '己巳': 3,
  // 庚午辛未组 → 土5
  '庚午': 5, '辛未': 5,
  // 壬申癸酉组 → 金4
  '壬申': 4, '癸酉': 4,
  // 甲戌乙亥组 → 火6
  '甲戌': 6, '乙亥': 6,
  // 丙子丁丑组 → 水2
  '丙子': 2, '丁丑': 2,
  // 戊寅己卯组 → 土5
  '戊寅': 5, '己卯': 5,
  // 庚辰辛巳组 → 金4
  '庚辰': 4, '辛巳': 4,
  // 壬午癸未组 → 木3
  '壬午': 3, '癸未': 3,
  // 甲申乙酉组 → 水2
  '甲申': 2, '乙酉': 2,
  // 丙戌丁亥组 → 土5
  '丙戌': 5, '丁亥': 5,
  // 戊子己丑组 → 火6
  '戊子': 6, '己丑': 6,
  // 庚寅辛卯组 → 木3
  '庚寅': 3, '辛卯': 3,
  // 壬辰癸巳组 → 水2
  '壬辰': 2, '癸巳': 2,
  // 甲午乙未组 → 金4
  '甲午': 4, '乙未': 4,
  // 丙申丁酉组 → 火6
  '丙申': 6, '丁酉': 6,
  // 戊戌己亥组 → 木3
  '戊戌': 3, '己亥': 3,
  // 庚子辛丑组 → 土5
  '庚子': 5, '辛丑': 5,
  // 壬寅癸卯组 → 金4
  '壬寅': 4, '癸卯': 4,
  // 甲辰乙巳组 → 火6
  '甲辰': 6, '乙巳': 6,
  // 丙午丁未组 → 水2
  '丙午': 2, '丁未': 2,
  // 戊申己酉组 → 土5
  '戊申': 5, '己酉': 5,
  // 庚戌辛亥组 → 金4
  '庚戌': 4, '辛亥': 4,
  // 壬子癸丑组 → 木3
  '壬子': 3, '癸丑': 3,
  // 甲寅乙卯组 → 水2
  '甲寅': 2, '乙卯': 2,
  // 丙辰丁巳组 → 土5
  '丙辰': 5, '丁巳': 5,
  // 戊午己未组 → 火6
  '戊午': 6, '己未': 6,
  // 庚申辛酉组 → 木3
  '庚申': 3, '辛酉': 3,
  // 壬戌癸亥组 → 水2
  '壬戌': 2, '癸亥': 2,
}

/** 五行数 → 五行局名称映射 */
const PHASE_NAMES: Record<number, FiveElementPhase> = {
  2: '水二局',
  3: '木三局',
  4: '金四局',
  5: '土五局',
  6: '火六局',
}

/** 五行数 → 五行element名称 */
const PHASE_ELEMENT: Record<number, string> = {
  2: '水', 3: '木', 4: '金', 5: '土', 6: '火',
}

/**
 * 根据命宫干支计算五行局
 * 
 * @param stem 命宫天干
 * @param branch 命宫地支
 * @returns 五行局名称
 */
export function calcElementPhase(stem: HeavenlyStem, branch: EarthBranch): FiveElementPhase {
  const key = stem + branch
  const elementNum = NAYIN_ELEMENT[key]
  if (!elementNum) {
    console.warn(`未知的纳音组合: ${key}，使用默认金四局`)
    return '金四局'
  }
  return PHASE_NAMES[elementNum] || '金四局'
}

/**
 * 获取五行局的数字（用于计算大限起运岁数）
 */
export function getPhaseNumber(phase: FiveElementPhase): number {
  const map: Record<FiveElementPhase, number> = {
    '水二局': 2,
    '木三局': 3,
    '金四局': 4,
    '土五局': 5,
    '火六局': 6,
  }
  return map[phase]
}

/**
 * 获取五行局的五行名称
 */
export function getPhaseElement(phase: FiveElementPhase): string {
  const map: Record<FiveElementPhase, string> = {
    '水二局': '水',
    '木三局': '木',
    '金四局': '金',
    '土五局': '土',
    '火六局': '火',
  }
  return map[phase]
}
