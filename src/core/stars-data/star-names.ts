/**
 * 星曜中英文名称对照表
 * 包含108颗星的完整名称映射
 */

export interface StarNameEntry {
  id: string
  nameCn: string
  nameEn: string
  aliases: string[]  // 别名/异名
}

/** 14主星名称 */
export const STAR_NAMES: Record<string, StarNameEntry> = {
  ziwei:    { id: 'ziwei',    nameCn: '紫微',   nameEn: 'Zi Wei',     aliases: ['北极', '帝星'] },
  tianji:   { id: 'tianji',   nameCn: '天机',   nameEn: 'Tian Ji',    aliases: ['善星', '谋星'] },
  taiyang:  { id: 'taiyang',  nameCn: '太阳',   nameEn: 'Tai Yang',   aliases: ['日', '阳星', '光明星'] },
  wuqu:     { id: 'wuqu',     nameCn: '武曲',   nameEn: 'Wu Qu',      aliases: ['财星', '刚星'] },
  tiantong: { id: 'tiantong', nameCn: '天同',   nameEn: 'Tian Tong',  aliases: ['福星', '和星'] },
  lianzhen: { id: 'lianzhen', nameCn: '廉贞',   nameEn: 'Lian Zhen',  aliases: ['囚星', '次桃花'] },
  tianfu:   { id: 'tianfu',   nameCn: '天府',   nameEn: 'Tian Fu',    aliases: ['库星', '令星'] },
  taiyin:   { id: 'taiyin',   nameCn: '太阴',   nameEn: 'Tai Yin',    aliases: ['月', '阴星', '富星'] },
  tanlang:  { id: 'tanlang',  nameCn: '贪狼',   nameEn: 'Tan Lang',   aliases: ['桃花星', '杀星', '狼星'] },
  jumen:    { id: 'jumen',    nameCn: '巨门',   nameEn: 'Ju Men',     aliases: ['暗星', '口舌星'] },
  tianxiang:{ id: 'tianxiang',nameCn: '天相',   nameEn: 'Tian Xiang', aliases: ['印星', '辅佐星'] },
  tianliang:{ id: 'tianliang',nameCn: '天梁',   nameEn: 'Tian Liang', aliases: ['荫星', '寿星', '清星'] },
  qisha:    { id: 'qisha',    nameCn: '七杀',   nameEn: 'Qi Sha',     aliases: ['杀星', '将星'] },
  pojun:    { id: 'pojun',    nameCn: '破军',   nameEn: 'Po Jun',     aliases: ['耗星', '破星'] },
  // 辅星
  zuobi:    { id: 'zuobi',    nameCn: '左辅',   nameEn: 'Zuo Bi',     aliases: ['辅星'] },
  youbi:    { id: 'youbi',    nameCn: '右弼',   nameEn: 'You Bi',     aliases: ['弼星'] },
  wenchang: { id: 'wenchang', nameCn: '文昌',   nameEn: 'Wen Chang',  aliases: ['文星', '科星'] },
  wenqu:    { id: 'wenqu',    nameCn: '文曲',   nameEn: 'Wen Qu',     aliases: ['曲星', '才星'] },
  tiankui:  { id: 'tiankui',  nameCn: '天魁',   nameEn: 'Tian Kui',   aliases: ['天乙贵人', '阳贵'] },
  tianyue:  { id: 'tianyue',  nameCn: '天钺',   nameEn: 'Tian Yue',   aliases: ['玉堂贵人', '阴贵'] },
  lucun:    { id: 'lucun',    nameCn: '禄存',   nameEn: 'Lu Cun',     aliases: ['禄星', '福禄'] },
  tianma:   { id: 'tianma',   nameCn: '天马',   nameEn: 'Tian Ma',    aliases: ['驿马', '动星'] },
  // 煞星
  qingyang: { id: 'qingyang', nameCn: '擎羊',   nameEn: 'Qing Yang',  aliases: ['阳刃', '刑星'] },
  tuoluo:   { id: 'tuoluo',   nameCn: '陀罗',   nameEn: 'Tuo Luo',    aliases: ['暗刃', '忌星'] },
  huoxing:  { id: 'huoxing',  nameCn: '火星',   nameEn: 'Huo Xing',   aliases: ['火', '暴星'] },
  lingxing: { id: 'lingxing', nameCn: '铃星',   nameEn: 'Ling Xing',  aliases: ['铃', '毒星'] },
  dikong:   { id: 'dikong',   nameCn: '地空',   nameEn: 'Di Kong',    aliases: ['空亡', '空星'] },
  dijie:    { id: 'dijie',    nameCn: '地劫',   nameEn: 'Di Jie',     aliases: ['劫星', '破星'] },
  // 杂曜
  hongluan: { id: 'hongluan', nameCn: '红鸾',   nameEn: 'Hong Luan',  aliases: ['鸾星'] },
  tianxi:   { id: 'tianxi',   nameCn: '天喜',   nameEn: 'Tian Xi',    aliases: ['喜星'] },
  tianku:   { id: 'tianku',   nameCn: '天哭',   nameEn: 'Tian Ku',    aliases: ['哭星'] },
  tianxu:   { id: 'tianxu',   nameCn: '天虚',   nameEn: 'Tian Xu',    aliases: ['虚星'] },
  longchi:  { id: 'longchi',  nameCn: '龙池',   nameEn: 'Long Chi',   aliases: ['龙星'] },
  fengge:   { id: 'fengge',   nameCn: '凤阁',   nameEn: 'Feng Ge',    aliases: ['凤星'] },
  guchen:   { id: 'guchen',   nameCn: '孤辰',   nameEn: 'Gu Chen',    aliases: ['孤星'] },
  gusu:     { id: 'gusu',     nameCn: '寡宿',   nameEn: 'Gu Su',      aliases: ['寡星'] },
  santai:   { id: 'santai',   nameCn: '三台',   nameEn: 'San Tai',    aliases: ['台星'] },
  bazuo:    { id: 'bazuo',    nameCn: '八座',   nameEn: 'Ba Zuo',     aliases: ['座星'] },
}

/** 通过中文名查找星曜ID */
export function findStarIdByCnName(name: string): string | undefined {
  for (const [id, entry] of Object.entries(STAR_NAMES)) {
    if (entry.nameCn === name || entry.aliases.includes(name)) {
      return id
    }
  }
  return undefined
}
