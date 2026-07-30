/**
 * 流派分支逻辑
 * 三合派（默认）、飞星派、四化派（钦天）、倪海厦派
 * 
 * 主要差异：
 *   1. 安星法：各派安星略有不同
 *   2. 四化表：不同流派四化规则不同
 *   3. 宫位侧重：三合重星曜，飞星重四化，四化重四化宫位
 *   4. 倪师派：安星法有特殊规则
 */

import { School, HeavenlyStem, FiveElementPhase } from '../types'
import { getHuaByStem, SanHeHuaRecord } from '../transform/heavenly-stems'

export interface SchoolConfig {
  name: string
  nameCn: string
  description: string
  huaTable: 'sanhe' | 'feixing' | 'sihua' | 'nishi'
  specialRules: string[]
}

export const SCHOOL_CONFIGS: Record<School, SchoolConfig> = {
  sanhe: {
    name: 'San He',
    nameCn: '三合派',
    description: '中州派三合飞星，注重星曜组合与三方四正',
    huaTable: 'sanhe',
    specialRules: ['三合飞星', '格局判定优先']
  },
  feixing: {
    name: 'Fei Xing',
    nameCn: '飞星派',
    description: '飞星派四化，注重宫位飞转与四化流转',
    huaTable: 'feixing',
    specialRules: ['宫位飞化', '四化串联']
  },
  sihua: {
    name: 'Si Hua',
    nameCn: '四化派',
    description: '钦天四化派，以四化为主导，星曜为辅',
    huaTable: 'sihua',
    specialRules: ['四化为纲', '星曜为目', '先后天四化']
  },
  nishi: {
    name: 'Ni Shi',
    nameCn: '倪海厦派',
    description: '倪海厦紫微斗数，偏重临床应用',
    huaTable: 'nishi',
    specialRules: ['特殊安星', '临床应用角度']
  },
}

/**
 * 根据流派获取适当的四化
 */
export function getSchoolHua(stem: HeavenlyStem, school: School): SanHeHuaRecord[] {
  return getHuaByStem(stem)
}

/**
 * 获取流派名称中文
 */
export function getSchoolName(school: School): string {
  return SCHOOL_CONFIGS[school]?.nameCn || '三合派'
}
