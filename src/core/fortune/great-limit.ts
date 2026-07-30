/**
 * 大限算法
 * 
 * 大限（十年大运）排布规则：
 *   1. 起运岁数 = 五行局数（水2、木3、金4、土5、火6）
 *   2. 阴阳性别分顺逆行：
 *      阳男阴女：顺行（顺时针，命宫→父母→福德→...）
 *      阴男阳女：逆行（逆时针，命宫→兄弟→夫妻→...）
 *   3. 每个大限管10年
 */

import { FiveElementPhase, GreatLimit, Gender, HeavenlyStem, EarthBranch, EARTH_BRANCHES, HEAVENLY_STEMS } from '../types'
import { getPhaseNumber } from '../palace/five-elements'
import { calcPalaceStem } from '../palace/palace'

/** 四化星曜类型 */
export type HuaType = '禄' | '权' | '科' | '忌'

/**
 * 判断阴阳年
 * 天干：甲(0)丙(2)戊(4)庚(6)壬(8)为阳，乙(1)丁(3)己(5)辛(7)癸(9)为阴
 */
export function isYearStemYang(yearStemIndex: number): boolean {
  return yearStemIndex % 2 === 0
}

/**
 * 判断大限顺行还是逆行
 * 阳男阴女顺行，阴男阳女逆行
 */
export function isGreatLimitForward(yearStemIndex: number, gender: Gender): boolean {
  const stemYang = isYearStemYang(yearStemIndex)
  if (stemYang && gender === '男') return true
  if (!stemYang && gender === '女') return true
  return false
}

/**
 * 计算大限序列
 * 
 * @param mingBranchIndex 命宫地支编号
 * @param shenBranchIndex 身宫地支编号
 * @param yearStemIndex 年干索引
 * @param yearBranchIndex 年支索引
 * @param gender 性别
 * @param phase 五行局
 * @returns 大限数组（12个，对应十二宫）
 */
export function calcGreatLimits(
  mingBranchIndex: number,
  shenBranchIndex: number,
  yearStemIndex: number,
  yearBranchIndex: number,
  gender: Gender,
  phase: FiveElementPhase
): GreatLimit[] {
  const forward = isGreatLimitForward(yearStemIndex, gender)
  const phaseNum = getPhaseNumber(phase)
  
  // 起运岁数
  const startAge = phaseNum
  
  // 大限顺序：从命宫开始，顺逆取决于阴阳性别
  const limits: GreatLimit[] = []
  
  for (let i = 0; i < 12; i++) {
    let palaceIndex: number
    
    if (forward) {
      // 顺行：命宫(0)→父母(11)→福德(10)→...
      palaceIndex = (mingBranchIndex + i - 1) % 12 + 1
    } else {
      // 逆行：命宫(0)→兄弟(1)→夫妻(2)→...
      palaceIndex = ((mingBranchIndex - 1 - i) % 12 + 12) % 12 + 1
    }
    
    // 每个大限的天干 = 该宫的天干
    const stem = calcPalaceStem(yearStemIndex, palaceIndex)
    
    // 大限地支
    const branch = EARTH_BRANCHES[palaceIndex - 1]
    
    // 年龄范围
    const limitStart = startAge + i * 10
    const limitEnd = limitStart + 9
    
    limits.push({
      palaceIndex,
      startAge: limitStart,
      endAge: limitEnd,
      stem,
      branch: branch as EarthBranch,
    })
  }
  
  return limits
}

/**
 * 获取指定年龄所在的大限
 */
export function getGreatLimitAtAge(limits: GreatLimit[], age: number): GreatLimit | undefined {
  return limits.find(l => age >= l.startAge && age <= l.endAge)
}

/**
 * 获取某人的当前大限（基于当前年龄）
 * 
 * @param birthYear 出生公历年份
 * @param currentYear 当前公历年份
 * @param limits 大限数组
 */
export function getCurrentGreatLimit(birthYear: number, currentYear: number, limits: GreatLimit[]): GreatLimit | undefined {
  const age = currentYear - birthYear + 1  // 虚岁
  return getGreatLimitAtAge(limits, age)
}
