/**
 * 紫微基础常量与类型定义
 */
export type YinYang = '阴' | '阳'
export type Element5 = '金' | '木' | '水' | '火' | '土'
export type Gender = '男' | '女'
export type School = 'sanhe' | 'feixing' | 'sihua' | 'nishi'

/** 天干 */
export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const
export type HeavenlyStem = typeof HEAVENLY_STEMS[number]

/** 地支 */
export const EARTH_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const
export type EarthBranch = typeof EARTH_BRANCHES[number]

/** 地支序号：子=1, 丑=2, ... 亥=12 */
export function getBranchIndex(branch: EarthBranch): number {
  return EARTH_BRANCHES.indexOf(branch) + 1
}

/** 通过序号获取地支（1=子） */
export function getBranchByIndex(index: number): EarthBranch {
  return EARTH_BRANCHES[((index - 1) % 12 + 12) % 12]
}

/** 通过序号获取天干（0=甲, 9=癸） */
export function getStemByIndex(index: number): HeavenlyStem {
  return HEAVENLY_STEMS[((index % 10) + 10) % 10]
}

/** 天干序号（甲=0, 乙=1, ... 癸=9） */
export function getStemIndex(stem: HeavenlyStem): number {
  return HEAVENLY_STEMS.indexOf(stem)
}

/** 十二宫名称 */
export const PALACE_NAMES = [
  '命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫',
  '迁移宫','交友宫','官禄宫','田宅宫','福德宫','父母宫'
] as const
export type PalaceName = typeof PALACE_NAMES[number]

/** 四化符号 */
export type HuaType = '禄' | '权' | '科' | '忌'

/** 五行局 */
export type FiveElementPhase = '水二局' | '木三局' | '金四局' | '土五局' | '火六局'

/** 命盘输入参数 */
export interface ChartInput {
  /** 公历年份 */
  year: number
  /** 公历月份（1~12） */
  month: number
  /** 公历日（1~31） */
  day: number
  /** 小时（0~23） */
  hour: number
  /** 分钟（0~59） */
  minute: number
  /** 性别 */
  gender: Gender
  /** 经度（东经正，西经负） */
  longitude?: number
  /** 纬度（北纬正，南纬负） */
  latitude?: number
  /** 流派 */
  school?: School
  /** 是否为农历输入，默认false */
  isLunar?: boolean
  /** 是否闰月 */
  isLeapMonth?: boolean
}

/** 命盘输出 */
export interface ChartResult {
  input: ChartInput
  /** 四柱八字 */
  fourPillars: {
    year: string
    month: string
    day: string
    hour: string
  }
  /** 命宫位置（地支索引1~12） */
  mingPalace: number
  /** 身宫位置 */
  shenPalace: number
  /** 五行局 */
  elementPhase: FiveElementPhase
  /** 十二宫数组 [命宫,兄弟宫,...父母宫]，每个宫位包含该宫信息 */
  palaces: PalaceInfo[]
  /** 命主 */
  mingMaster: string
  /** 身主 */
  shenMaster: string
  /** 四化分布 */
  hua: HuaRecord[]
  /** 大限数组 */
  greatLimits: GreatLimit[]
}

export interface PalaceInfo {
  name: PalaceName
  /** 宫干 */
  stem: HeavenlyStem
  /** 宫支 */
  branch: EarthBranch
  /** 宫地支序号 1~12 */
  branchIndex: number
  /** 主星ID列表 */
  mainStars: string[]
  /** 辅星ID列表 */
  minorStars: string[]
  /** 煞星ID列表 */
  shaStars: string[]
  /** 杂曜ID列表 */
  miscStars: string[]
  /** 四化 */
  hua: HuaType[]
  /** 是否为命宫 */
  isMing: boolean
  /** 是否为身宫 */
  isShen: boolean
}

export interface HuaRecord {
  starId: string
  type: HuaType
  palaceIndex: number
}

export interface GreatLimit {
  /** 大限序号（1~12对应十二宫） */
  palaceIndex: number
  /** 起始年龄 */
  startAge: number
  /** 结束年龄 */
  endAge: number
  /** 天干 */
  stem: HeavenlyStem
  /** 地支 */
  branch: EarthBranch
}
