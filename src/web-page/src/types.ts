/**
 * 前端展示层共享类型（ChartDisplayData）
 * 用于替代 store / 组件中的 any 泛滥
 */

/** 自化箭头 */
export interface SelfArrow {
  palaceBranch: number
  type: '禄' | '权' | '科' | '忌'
  direction: 'in' | 'out'
  starName?: string
  layer?: '命' | '限' | '流'
}

/** 飞星四化连线 */
export interface FlyLine {
  fromBranch: number
  toBranch: number
  type: '禄' | '权' | '科' | '忌'
  layer: '命' | '限' | '流'
}

/** 星曜展示 */
export interface StarDisplay {
  name: string
  brightness?: string
  mutagen?: string
}

/** 大限信息 */
export interface DecadalDisplay {
  range: [number, number]
  stem: string
  branch: string
}

/** 宫位展示 */
export interface PalaceDisplay {
  name: string
  stem: string
  branch: string
  branchIndex: number
  isShen: boolean
  mainStars: StarDisplay[]
  minorStars: StarDisplay[]
  changsheng12?: string
  boshi12?: string
  jiangqian12?: string
  suiqian12?: string
  decadal?: DecadalDisplay | null
  ages?: number[]
}

/** 四柱 */
export interface FourPillars {
  year: string
  month: string
  day: string
  hour: string
}

/** 完整命盘展示数据 */
export interface ChartDisplayData {
  fourPillars: FourPillars
  elementPhase: string
  mingMaster: string
  shenMaster: string
  gender: string
  school: string
  solarDate: string
  timeRange?: string
  selfArrows: SelfArrow[]
  decadeSelfArrows: SelfArrow[]
  yearlySelfArrows: SelfArrow[]
  flyLines: FlyLine[]
  decadeFly: FlyLine[]
  yearlyFly: FlyLine[]
  palaces: PalaceDisplay[]
}

/** 历史记录 */
export interface ChartRecord {
  id: number
  savedAt: string
  fp?: FourPillars
  gender?: string
  solarDate?: string
  school?: string
  elementPhase?: string
  fullData?: ChartDisplayData
}
