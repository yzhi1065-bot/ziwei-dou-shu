/**
 * 辅煞星数据字典（南北斗辅星 + 杂曜）
 * 包含：左辅右弼、文昌文曲、天魁天钺、禄存、擎羊陀罗、火星铃星、地空地劫、天马
 * 以及：天哭天虚、龙池凤阁、红鸾天喜、孤辰寡宿、天巫、天月、台辅封诰、天官天福、三台八座
 * 共约 30+ 颗辅煞杂曜
 */

export interface MinorStarData {
  id: string
  name: string
  nameEn: string
  /** 吉凶分类 */
  luck: '吉' | '凶' | '平'
  /** 所属类别 */
  category: '辅' | '煞' | '杂'
  /** 所属地支索引（0=不固定） */
  earthBranch: number
  /** 排布方法 */
  method: '时支' | '月支' | '年干' | '年支' | '日支' | '时干' | '固定'
  /** 排布参数 */
  rule: string
  /** 特性描述 */
  description: string
}

/** 辅星数据 */
export const MINOR_STARS: Record<string, MinorStarData> = {
  zuobi: {
    id: 'zuobi', name: '左辅', nameEn: 'Zuo Bi',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '月支', rule: '左辅从辰起正月，顺数至出生月', description: '辅佐星，主助力、贵人、团队协作。'
  },
  youbi: {
    id: 'youbi', name: '右弼', nameEn: 'You Bi',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '月支', rule: '右弼从戌起正月，逆数至出生月', description: '辅佐星，主助力、暗中相助、协调。'
  },
  wenchang: {
    id: 'wenchang', name: '文昌', nameEn: 'Wen Chang',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '时干', rule: '文昌从戌起子时，逆数至生时', description: '文星，主才学、文采、考试。'
  },
  wenqu: {
    id: 'wenqu', name: '文曲', nameEn: 'Wen Qu',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '时干', rule: '文曲从辰起子时，顺数至生时', description: '文星，主才艺、口才、技艺。'
  },
  tiankui: {
    id: 'tiankui', name: '天魁', nameEn: 'Tian Kui',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '年干', rule: '甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马', description: '贵人星，主天乙贵人、助力、机遇。'
  },
  tianyue: {
    id: 'tianyue', name: '天钺', nameEn: 'Tian Yue',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '年干', rule: '甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马', description: '贵人星，主偏财、暗中助力。'
  },
  lucun: {
    id: 'lucun', name: '禄存', nameEn: 'Lu Cun',
    luck: '吉', category: '辅', earthBranch: 0,
    method: '年干', rule: '甲禄到寅宫，乙禄到卯宫，丙戊禄在巳，丁己禄在午，庚禄居申，辛禄在酉，壬禄在亥，癸禄在子', description: '财星，主财富、积蓄、福禄。'
  },
  qingyang: {
    id: 'qingyang', name: '擎羊', nameEn: 'Qing Yang',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '年干', rule: '禄前为擎羊', description: '煞星，主血光、争斗、横祸、速发。'
  },
  tuoluo: {
    id: 'tuoluo', name: '陀罗', nameEn: 'Tuo Luo',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '年干', rule: '禄后为陀罗', description: '煞星，主拖延、纠缠、慢性病。'
  },
  huoxing: {
    id: 'huoxing', name: '火星', nameEn: 'Huo Xing',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '年支', rule: '火星以年生，依时起', description: '煞星，主突发、暴躁、火爆、速成速败。'
  },
  lingxing: {
    id: 'lingxing', name: '铃星', nameEn: 'Ling Xing',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '年支', rule: '铃星以年生，依时起', description: '煞星，主阴险、暗算、慢性烦恼。'
  },
  dikong: {
    id: 'dikong', name: '地空', nameEn: 'Di Kong',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '时支', rule: '地空从亥起子时，逆数至生时', description: '煞星，主空虚、破财、理想、玄学。'
  },
  dijie: {
    id: 'dijie', name: '地劫', nameEn: 'Di Jie',
    luck: '凶', category: '煞', earthBranch: 0,
    method: '时支', rule: '地劫从亥起子时，顺数至生时', description: '煞星，主波折、损失、变动、破耗。'
  },
  tianma: {
    id: 'tianma', name: '天马', nameEn: 'Tian Ma',
    luck: '平', category: '辅', earthBranch: 0,
    method: '年支', rule: '寅午戌年天马在申，申子辰年在寅，巳酉丑年在亥，亥卯未年在巳', description: '动星，主奔波、出国、交通、变动。'
  },
  // ---- 杂曜 ----
  tianku: {
    id: 'tianku', name: '天哭', nameEn: 'Tian Ku',
    luck: '凶', category: '杂', earthBranch: 0,
    method: '年支', rule: '天哭天虚与年支相关', description: '杂曜，主悲伤、眼泪、孤独。'
  },
  tianxu: {
    id: 'tianxu', name: '天虚', nameEn: 'Tian Xu',
    luck: '凶', category: '杂', earthBranch: 0,
    method: '年支', rule: '天哭天虚与年支相关', description: '杂曜，主虚无、损耗、不实。'
  },
  longchi: {
    id: 'longchi', name: '龙池', nameEn: 'Long Chi',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '年支', rule: '龙池与年支相关', description: '杂曜，主文采、艺术、名气。'
  },
  fengge: {
    id: 'fengge', name: '凤阁', nameEn: 'Feng Ge',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '年支', rule: '凤阁与年支相关', description: '杂曜，主优雅、名声、女贵。'
  },
  hongluan: {
    id: 'hongluan', name: '红鸾', nameEn: 'Hong Luan',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '年支', rule: '红鸾从卯起子年，顺数至年支', description: '桃花星，主姻缘、恋爱、喜庆。'
  },
  tianxi: {
    id: 'tianxi', name: '天喜', nameEn: 'Tian Xi',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '年支', rule: '天喜从酉起子年，顺数至年支', description: '喜庆星，主婚姻、喜事、生产。'
  },
  guchen: {
    id: 'guchen', name: '孤辰', nameEn: 'Gu Chen',
    luck: '凶', category: '杂', earthBranch: 0,
    method: '年支', rule: '孤辰与年支相关', description: '孤独星，主独处、孤僻、少社交。'
  },
  gusu: {
    id: 'gusu', name: '寡宿', nameEn: 'Gu Su',
    luck: '凶', category: '杂', earthBranch: 0,
    method: '年支', rule: '寡宿与年支相关', description: '寡宿星，主独居、配偶缘薄。'
  },
  santai: {
    id: 'santai', name: '三台', nameEn: 'San Tai',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '时支', rule: '三台与生时相关', description: '科甲星，主功名、提升。'
  },
  bazuo: {
    id: 'bazuo', name: '八座', nameEn: 'Ba Zuo',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '时支', rule: '八座与生时相关', description: '科甲星，主功名、地位。'
  },
  tianwu: {
    id: 'tianwu', name: '天巫', nameEn: 'Tian Wu',
    luck: '平', category: '杂', earthBranch: 0,
    method: '月支', rule: '天巫与月支相关', description: '灵性星，主玄学、宗教信仰。'
  },
  tianyue2: {
    id: 'tianyue2', name: '天月', nameEn: 'Tian Yue',
    luck: '平', category: '杂', earthBranch: 0,
    method: '月支', rule: '天月与月支相关', description: '杂曜，主随和、宗教。'
  },
  yinsha: {
    id: 'yinsha', name: '阴煞', nameEn: 'Yin Sha',
    luck: '凶', category: '杂', earthBranch: 0,
    method: '月支', rule: '阴煞与月支相关', description: '暗星，主暗中阻碍、小人。'
  },
  taifu: {
    id: 'taifu', name: '台辅', nameEn: 'Tai Fu',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '时支', rule: '台辅与生时相关', description: '科甲星，主名誉、辅助。'
  },
  fenghao: {
    id: 'fenghao', name: '封诰', nameEn: 'Feng Gao',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '时支', rule: '封诰与生时相关', description: '封赠星，主名声、荣誉。'
  },
  tianguan: {
    id: 'tianguan', name: '天官', nameEn: 'Tian Guan',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '月支', rule: '天官与月支相关', description: '官禄星，主升职、官运。'
  },
  tianfu2: {
    id: 'tianfu2', name: '天福', nameEn: 'Tian Fu',
    luck: '吉', category: '杂', earthBranch: 0,
    method: '月支', rule: '天福与月支相关', description: '福星，主福气、享受。'
  }
}

export const MINOR_STAR_IDS = Object.keys(MINOR_STARS)

export function getMinorStar(id: string): MinorStarData | undefined {
  return MINOR_STARS[id]
}
