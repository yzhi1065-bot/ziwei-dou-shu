/**
 * 14主星数据字典
 * 依据：《紫微斗数全书》安星法
 * 注：南斗星系、北斗星系、中天星系
 */

export type StarYinYang = '阴' | '阳'
export type StarElement = '金' | '木' | '水' | '火' | '土'
export type StarGroup = '北斗' | '南斗' | '中天'
export type StarType = '主星' | '辅星' | '煞星' | '吉星'

export interface MainStarData {
  id: string
  name: string
  nameEn: string
  group: StarGroup
  element: StarElement
  yinyang: StarYinYang
  type: StarType
  /** 所属地支序号（1=子, 12=亥） */
  earthBranch: number
  /** 是否为紫微星系（紫微-破军一条线） */
  isZiweiSeries: boolean
  /** 排列序号（紫微系: 1~6, 天府系: 1~8） */
  seriesOrder: number
  /** 吉凶属性: 吉/凶/平/吉带煞/煞带吉 */
  luck: '吉' | '凶' | '平' | '吉带煞' | '煞带吉'
  /** 星曜特性简述 */
  description: string
  /** 代表意象 */
  symbolism: string[]
}

/**
 * 14主星完整数据
 * 排序规则：紫微系6颗（紫微→天机→太阳→武曲→天同→廉贞）
 *          天府系8颗（天府→太阴→贪狼→巨门→天相→天梁→七杀→破军）
 */
export const MAIN_STARS: Record<string, MainStarData> = {
  ziwei: {
    id: 'ziwei',
    name: '紫微',
    nameEn: 'Zi Wei',
    group: '中天',
    element: '土',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 1,
    luck: '吉',
    description: '北斗之主，帝星。主贵、权威、统御。入命身宫主贵气、领导才能。',
    symbolism: ['帝王', '尊贵', '领袖', '权力', '高贵']
  },
  tianji: {
    id: 'tianji',
    name: '天机',
    nameEn: 'Tian Ji',
    group: '南斗',
    element: '木',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 2,
    luck: '吉',
    description: '南斗第三星，化气为善。主智慧、谋略、变动、思考。',
    symbolism: ['智慧', '谋略', '变动', '思考', '善变']
  },
  taiyang: {
    id: 'taiyang',
    name: '太阳',
    nameEn: 'Tai Yang',
    group: '中天',
    element: '火',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 3,
    luck: '吉',
    description: '中天主星，化气为贵。主光明、博爱、积极、名声。',
    symbolism: ['光明', '博爱', '积极', '名声', '父亲', '丈夫']
  },
  wuqu: {
    id: 'wuqu',
    name: '武曲',
    nameEn: 'Wu Qu',
    group: '北斗',
    element: '金',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 4,
    luck: '吉',
    description: '北斗第六星，化气为财。主财富、刚毅、执行力、武职。',
    symbolism: ['财富', '刚毅', '执行力', '武职', '金融']
  },
  tiantong: {
    id: 'tiantong',
    name: '天同',
    nameEn: 'Tian Tong',
    group: '南斗',
    element: '水',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 5,
    luck: '吉',
    description: '南斗第四星，化气为福。主福气、温和、协调、享受。',
    symbolism: ['福气', '温和', '协调', '享受', '懒散']
  },
  lianzhen: {
    id: 'lianzhen',
    name: '廉贞',
    nameEn: 'Lian Zhen',
    group: '北斗',
    element: '火',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: true,
    seriesOrder: 6,
    luck: '吉带煞',
    description: '北斗第五星，化气为囚。主贞烈、是非、权术、感情复杂。',
    symbolism: ['贞烈', '权术', '是非', '感情', '囚狱']
  },
  tianfu: {
    id: 'tianfu',
    name: '天府',
    nameEn: 'Tian Fu',
    group: '南斗',
    element: '土',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 1,
    luck: '吉',
    description: '南斗主星，化气为库。主保守、稳定、包容、财库。',
    symbolism: ['保守', '稳定', '包容', '财库', '库藏']
  },
  taiyin: {
    id: 'taiyin',
    name: '太阴',
    nameEn: 'Tai Yin',
    group: '中天',
    element: '水',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 2,
    luck: '吉',
    description: '中天主星，化气为富。主温柔、美丽、财富、田宅、母亲。',
    symbolism: ['温柔', '美丽', '财富', '田宅', '母亲', '妻子']
  },
  tanlang: {
    id: 'tanlang',
    name: '贪狼',
    nameEn: 'Tan Lang',
    group: '北斗',
    element: '木',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 3,
    luck: '平',
    description: '北斗第一星，化气为桃花。主欲望、才艺、交际、桃花、投机。',
    symbolism: ['桃花', '欲望', '才艺', '交际', '投机']
  },
  jumen: {
    id: 'jumen',
    name: '巨门',
    nameEn: 'Ju Men',
    group: '北斗',
    element: '水',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 4,
    luck: '凶',
    description: '北斗第二星，化气为暗。主是非、口舌、暗昧、思辨、沟通。',
    symbolism: ['是非', '口舌', '暗昧', '思辨', '沟通']
  },
  tianxiang: {
    id: 'tianxiang',
    name: '天相',
    nameEn: 'Tian Xiang',
    group: '南斗',
    element: '水',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 5,
    luck: '吉',
    description: '南斗第五星，化气为印。主辅佐、协调、公正、印章、服务。',
    symbolism: ['辅佐', '协调', '公正', '印章', '服务']
  },
  tianliang: {
    id: 'tianliang',
    name: '天梁',
    nameEn: 'Tian Liang',
    group: '南斗',
    element: '土',
    yinyang: '阳',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 6,
    luck: '吉',
    description: '南斗第二星，化气为荫。主荫庇、长寿、清高、解厄、医药。',
    symbolism: ['荫庇', '长寿', '清高', '解厄', '医药', '长辈']
  },
  qisha: {
    id: 'qisha',
    name: '七杀',
    nameEn: 'Qi Sha',
    group: '南斗',
    element: '金',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 7,
    luck: '煞带吉',
    description: '南斗第六星，化气为杀。主威严、决断、拼搏、冒险、变动。',
    symbolism: ['威严', '决断', '拼搏', '冒险', '变动']
  },
  pojun: {
    id: 'pojun',
    name: '破军',
    nameEn: 'Po Jun',
    group: '北斗',
    element: '火',
    yinyang: '阴',
    type: '主星',
    earthBranch: 0,
    isZiweiSeries: false,
    seriesOrder: 8,
    luck: '煞带吉',
    description: '北斗第七星，化气为耗。主破旧立新、破坏、消耗、变革、冒险。',
    symbolism: ['破旧立新', '破坏', '消耗', '变革', '冒险']
  }
}

/** 按系列分组 */
export const ZIWEI_SERIES = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen'] as const
export const TIANFU_SERIES = ['tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'] as const

/** 14主星ID列表（紫微系在前，天府系在后） */
export const MAIN_STAR_IDS: string[] = [...ZIWEI_SERIES, ...TIANFU_SERIES]

/** 根据ID获取主星数据 */
export function getMainStar(id: string): MainStarData | undefined {
  return MAIN_STARS[id]
}

/** 获取所有主星数据 */
export function getAllMainStars(): MainStarData[] {
  return MAIN_STAR_IDS.map(id => MAIN_STARS[id])
}
