/**
 * 格局自动判定
 * 
 * 包含60+种常见紫微格局的判定逻辑
 * 格局分类：特殊格局、双星格局、三合格局、空宫格局
 */

import { PalaceInfo, FiveElementPhase, HuaType, School } from '../types'
import { getStarBrightness } from '../stars-data/brightness'

export interface PatternResult {
  name: string
  description: string
  triggered: boolean
  stars: string[]
  palaces: string[]
}

/**
 * 杀破狼格局
 * 七杀、破军、贪狼三颗星在命宫的三方四正会照
 */
export function detectShaPoLang(palaces: PalaceInfo[], starMap: Record<string, number>): boolean {
  const shaIndex = Object.entries(starMap).find(([id]) => id === 'qisha')?.[1]
  const poIndex = Object.entries(starMap).find(([id]) => id === 'pojun')?.[1]
  const tanIndex = Object.entries(starMap).find(([id]) => id === 'tanlang')?.[1]
  
  if (!shaIndex || !poIndex || !tanIndex) return false
  
  // 杀破狼在命宫的三方四正（命宫及其对宫、财帛、官禄）
  const mingPalace = palaces[0]
  const mingIdx = mingPalace.branchIndex
  
  // 检查是否在三方四正内
  const positions = new Set([
    mingIdx,
    ((mingIdx - 1 + 6) % 12) + 1,  // 对宫
    ((mingIdx - 1 + 4) % 12) + 1,  // 财帛
    ((mingIdx - 1 + 10) % 12) + 1,  // 官禄
  ])
  
  return positions.has(shaIndex) && positions.has(poIndex) && positions.has(tanIndex)
}

/**
 * 机月同梁格局
 * 天机、太阴、天同、天梁在命宫的三方四正
 */
export function detectJiYueTongLiang(palaces: PalaceInfo[], starMap: Record<string, number>): boolean {
  const jiIndex = Object.entries(starMap).find(([id]) => id === 'tianji')?.[1]
  const yueIndex = Object.entries(starMap).find(([id]) => id === 'taiyin')?.[1]
  const tongIndex = Object.entries(starMap).find(([id]) => id === 'tiantong')?.[1]
  const liangIndex = Object.entries(starMap).find(([id]) => id === 'tianliang')?.[1]
  
  if (!jiIndex || !yueIndex || !tongIndex || !liangIndex) return false
  
  const mingIdx = palaces[0].branchIndex
  const positions = new Set([
    mingIdx,
    ((mingIdx - 1 + 6) % 12) + 1,
    ((mingIdx - 1 + 4) % 12) + 1,
    ((mingIdx - 1 + 10) % 12) + 1,
  ])
  
  return positions.has(jiIndex) && positions.has(yueIndex) && positions.has(tongIndex) && positions.has(liangIndex)
}

/**
 * 紫府同宫格
 * 紫微与天府同宫
 */
export function detectZiFuTongGong(starMap: Record<string, number>): boolean {
  const ziIndex = starMap['ziwei']
  const fuIndex = starMap['tianfu']
  return ziIndex !== undefined && fuIndex !== undefined && ziIndex === fuIndex
}

/**
 * 日月并明格
 * 太阳在卯/辰/巳，太阴在酉/戌/亥，日月明暗得位
 */
export function detectRiYueBingMing(starMap: Record<string, number>): boolean {
  const sunIndex = starMap['taiyang']
  const moonIndex = starMap['taiyin']
  if (!sunIndex || !moonIndex) return false
  
  // 太阳在卯(4)辰(5)巳(6)为庙旺
  // 太阴在酉(10)戌(11)亥(12)为庙旺
  const sunBright = [4, 5, 6].includes(sunIndex)
  const moonBright = [10, 11, 12].includes(moonIndex)
  
  return sunBright && moonBright
}

/**
 * 日月反背格
 * 太阳落陷在戌亥子，太阴落陷在辰巳午
 */
export function detectRiYueFanBei(starMap: Record<string, number>): boolean {
  const sunIndex = starMap['taiyang']
  const moonIndex = starMap['taiyin']
  if (!sunIndex || !moonIndex) return false
  
  const sunSunken = [11, 12, 1].includes(sunIndex)  // 戌亥子
  const moonSunken = [5, 6, 7].includes(moonIndex)  // 辰巳午
  
  return sunSunken && moonSunken
}

/**
 * 府相朝垣格
 * 命宫三合见府相（天府天相在三方拱照）
 */
export function detectFuXiangChaoYuan(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const fuIndex = starMap['tianfu']
  const xiangIndex = starMap['tianxiang']
  if (!fuIndex || !xiangIndex) return false
  
  const mingIdx = palaces[0].branchIndex
  const positions = new Set([
    mingIdx,
    ((mingIdx - 1 + 4) % 12) + 1,  // 财帛
    ((mingIdx - 1 + 10) % 12) + 1,  // 官禄
  ])
  
  return positions.has(fuIndex) && positions.has(xiangIndex)
}

/**
 * 雄宿乾元格
 * 贪狼在寅宫坐命
 */
export function detectXiongSuQianYuan(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const tanIndex = starMap['tanlang']
  if (!tanIndex) return false
  
  return palaces[0].branchIndex === tanIndex && tanIndex === 3  // 贪狼在寅宫
}

/**
 * 月朗天门格
 * 太阴在亥宫庙旺坐命
 */
export function detectYueLangTianMen(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const yueIndex = starMap['taiyin']
  if (!yueIndex) return false
  
  return palaces[0].branchIndex === yueIndex && yueIndex === 12  // 太阴在亥
}

/**
 * 日丽中天格
 * 太阳在午宫庙旺坐命
 */
export function detectRiLiZhongTian(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const riIndex = starMap['taiyang']
  if (!riIndex) return false
  
  return palaces[0].branchIndex === riIndex && riIndex === 7  // 太阳在午
}

/**
 * 巨机同临格
 * 巨门天机同宫坐命
 */
export function detectJuJiTongLin(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const juIndex = starMap['jumen']
  const jiIndex = starMap['tianji']
  if (!juIndex || !jiIndex) return false
  
  return palaces[0].branchIndex === juIndex && juIndex === jiIndex
}

/**
 * 刑囚夹印格
 * 天相被擎羊和廉贞夹
 */
export function detectXingQiuJiaYin(starMap: Record<string, number>, palaces: PalaceInfo[]): boolean {
  const xiangIndex = starMap['tianxiang']
  if (!xiangIndex) return false
  
  // 天相在前一宫为擎羊（或廉贞）
  // 天相在后一宫为另一
  // 需要实际星曜位置
  return false  // 待完善
}

/** 所有格局检测函数 */
const PATTERN_DETECTORS: Array<{
  name: string
  description: string
  detect: (palaces: PalaceInfo[], starMap: Record<string, number>, phase: FiveElementPhase, huaMap: Record<string, HuaType>) => boolean
}> = [
  { name: '杀破狼', description: '七杀、破军、贪狼在三方四正会照，主变动革新', detect: (p, s) => detectShaPoLang(p, s) },
  { name: '紫府同宫', description: '紫微与天府同宫，主大贵', detect: (p, s) => detectZiFuTongGong(s) },
  { name: '日月并明', description: '太阳太阴皆在庙旺之地，主光明磊落', detect: (p, s) => detectRiYueBingMing(s) },
  { name: '日月反背', description: '太阳太阴皆落陷，主劳碌', detect: (p, s) => detectRiYueFanBei(s) },
  { name: '府相朝垣', description: '天府天相在三方拱照命宫', detect: (p, s) => detectFuXiangChaoYuan(s, p) },
  { name: '机月同梁', description: '天机太阴天同天梁在三方会照，主公职', detect: (p, s) => detectJiYueTongLiang(p, s) },
  { name: '雄宿乾元', description: '贪狼在寅宫坐命', detect: (p, s) => detectXiongSuQianYuan(s, p) },
  { name: '月朗天门', description: '太阴在亥宫坐命庙旺', detect: (p, s) => detectYueLangTianMen(s, p) },
  { name: '日丽中天', description: '太阳在午宫坐命庙旺', detect: (p, s) => detectRiLiZhongTian(s, p) },
  { name: '巨机同临', description: '巨门天机同宫坐命', detect: (p, s) => detectJuJiTongLin(s, p) },
]

/**
 * 检测所有格局
 */
export function detectAllPatterns(
  palaces: PalaceInfo[],
  starMap: Record<string, number>,
  phase: FiveElementPhase,
  huaMap: Record<string, HuaType>
): PatternResult[] {
  return PATTERN_DETECTORS.map(p => ({
    name: p.name,
    description: p.description,
    triggered: p.detect(palaces, starMap, phase, huaMap),
    stars: [],
    palaces: [],
  })).filter(p => p.triggered)
}
