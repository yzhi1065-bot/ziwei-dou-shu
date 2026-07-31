/**
 * 综合命理解读引擎
 * 基于命盘数据（命宫主星/格局/五行局/四化）生成六大维度解读
 */

export interface Interpretation {
  title: string
  content: string
}

// 主星性格/事业/感情关键词（中文）
const STAR_KNOWLEDGE: Record<string, { char: string; career: string; love: string; health: string }> = {
  '紫微': { char: '帝王气质，尊贵自尊，领导欲强，重视体面', career: '适合管理、领导岗位，有统御全局之才', love: '感情中较为强势，需对方仰慕服从', health: '注意心脑血管与压力管理' },
  '天机': { char: '聪明机敏，善谋略，思维活跃，易多虑', career: '适合策划、研究、技术类工作', love: '心思细腻但易犹豫不决', health: '注意神经系统与睡眠' },
  '太阳': { char: '光明磊落，热心助人，积极开朗', career: '适合公职、教育、公益事业', love: '热情大方，但需注意沟通方式', health: '注意眼睛与心脏' },
  '武曲': { char: '刚毅果断，执行力强，重财务实', career: '适合金融、军警、技术、创业', love: '感情表达较为直接刚硬', health: '注意呼吸系统与筋骨' },
  '天同': { char: '温和福气，随遇而安，人缘好', career: '适合服务、协调、文职工作', love: '温柔体贴，是理想伴侣', health: '注意肠胃与代谢' },
  '廉贞': { char: '聪慧敏锐，重情义，性格多面', career: '适合艺术、公关、司法、军警', love: '感情浓烈复杂，桃花较多', health: '注意内分泌与情绪' },
  '天府': { char: '稳重保守，包容大度，善理财', career: '适合管理、金融、仓储物流', love: '忠诚可靠，感情稳定', health: '注意脾胃与饮食' },
  '太阴': { char: '温柔细腻，内敛含蓄，重家庭', career: '适合财务、文教、艺术、地产', love: '深情体贴，情感丰富', health: '注意妇科/泌尿与睡眠' },
  '贪狼': { char: '多才多艺，交际广泛，欲望强', career: '适合创意、娱乐、销售、投机', love: '桃花旺盛，感情多彩', health: '注意肝胆与过度消耗' },
  '巨门': { char: '口才出众，思维深刻，易招是非', career: '适合口才、法律、传媒、教育', love: '言语犀利易起争执', health: '注意肠胃与口舌之疾' },
  '天相': { char: '温和正直，辅佐之才，人缘佳', career: '适合辅佐、秘书、协调、服务', love: '感情平顺，善解人意', health: '注意皮肤与循环系统' },
  '天梁': { char: '清高正直，有长者风范，逢凶化吉', career: '适合医疗、法律、教育、公益', love: '成熟稳重，善于照顾人', health: '长寿星，注意慢性病' },
  '七杀': { char: '刚毅果敢，行动力强，冒险精神', career: '适合军警、体育、创业、外科', love: '爱恨分明，感情浓烈', health: '注意外伤与急性病' },
  '破军': { char: '勇于变革，破坏重建，不惧风险', career: '适合创新、开拓、工程、军旅', love: '感情起伏大，需磨合', health: '注意意外与劳损' },
}

// 五行局性格
const PHASE_CHAR: Record<string, string> = {
  '水二局': '如水灵动，聪明善变，适应力强，情感丰富',
  '木三局': '如木生长，积极向上，有仁心，重情义',
  '金四局': '如金坚毅，果决刚强，重义气，执行力强',
  '土五局': '如土厚重，沉稳踏实，重信用，有耐心',
  '火六局': '如火热情，积极进取，有爆发力，行动敏捷',
}

// 四化解读
const HUA_MEANING: Record<string, string> = {
  '禄': '化禄主财禄亨通，机遇多，资源丰沛',
  '权': '化权主掌权柄，能力强，事业有担当',
  '科': '化科主名声好，贵人助，名誉有加成',
  '忌': '化忌主压力大，易劳心，需谨慎应对',
}

/** 获取宫位主星名 */
function starsAt(chart: any, palaceName: string): string[] {
  const p = chart.palaces.find((x: any) => x.name === palaceName)
  return p ? p.mainStars.map((s: any) => s.name) : []
}

/** 综合解读 */
export function interpretChart(chart: any): Interpretation[] {
  const out: Interpretation[] = []
  if (!chart) return out

  const mingStars = starsAt(chart, '命宫')
  const careerStars = starsAt(chart, '官禄宫')
  const wealthStars = starsAt(chart, '财帛宫')
  const loveStars = starsAt(chart, '夫妻宫')
  const healthStars = starsAt(chart, '疾厄宫')
  const mingMaster = mingStars[0] || ''

  // 1. 性格
  const starChar = STAR_KNOWLEDGE[mingMaster]?.char || '性格独特，需结合具体星曜细看'
  const phaseChar = PHASE_CHAR[chart.elementPhase] || ''
  let charText = `命宫主星${mingMaster}：${starChar}。`
  if (phaseChar) charText += `五行局${chart.elementPhase}之人，${phaseChar}。`
  if (mingStars.length > 1) charText += `命宫另有${mingStars.slice(1).join('、')}同宫，性格更显多元。`
  out.push({ title: '性格特质', content: charText })

  // 2. 事业
  let careerText = ''
  if (careerStars.length) {
    const careerMain = careerStars[0]
    careerText = `官禄宫主星${careerMain}：${STAR_KNOWLEDGE[careerMain]?.career || '事业有独特发展路径'}。`
  } else {
    careerText = '官禄宫无主星，事业方向宜借三方四正之力，或随命宫主星特质发展。'
  }
  out.push({ title: '事业财运', content: careerText })

  // 3. 财运
  let wealthText = ''
  if (wealthStars.length) {
    const w = wealthStars[0]
    wealthText = `财帛宫主星${w}，理财风格受其影响。`
    if (w === '武曲' || w === '天府') wealthText += '财星坐守，财运稳健，善积财。'
    else if (w === '贪狼') wealthText += '偏财运旺，但需防投机风险。'
    else wealthText += '财运平稳，宜稳扎稳打。'
  } else {
    wealthText = '财帛宫无主星，财运随大运流转，宜借对宫星曜之力。'
  }
  out.push({ title: '财运走势', content: wealthText })

  // 4. 感情
  let loveText = ''
  if (loveStars.length) {
    const l = loveStars[0]
    loveText = `夫妻宫主星${l}：${STAR_KNOWLEDGE[l]?.love || '感情有其独特模式'}。`
  } else {
    loveText = '夫妻宫无主星，感情观受对宫官禄及命宫影响，宜主动经营。'
  }
  out.push({ title: '感情婚姻', content: loveText })

  // 5. 健康
  let healthText = ''
  if (healthStars.length) {
    const h = healthStars[0]
    healthText = `疾厄宫主星${h}：${STAR_KNOWLEDGE[h]?.health || '需注意劳逸结合'}。`
  } else {
    healthText = '疾厄宫无主星，体质尚可，宜规律作息养生。'
  }
  out.push({ title: '健康提醒', content: healthText })

  // 6. 格局与四化
  let patternText = ''
  if (chart.patterns && chart.patterns.length) {
    patternText = `命带${chart.patterns.map((p: any) => p.name).join('、')}格局，${chart.patterns[0]?.description}。`
  }
  // 命宫四化
  const mingPalace = chart.palaces.find((x: any) => x.name === '命宫')
  const mingHua = mingPalace?.mainStars?.filter((s: any) => s.mutagen)
  if (mingHua?.length) {
    patternText += `命宫${mingHua.map((s: any) => `${s.name}${s.mutagen}`).join('、')}，${mingHua.map((s: any) => HUA_MEANING[s.mutagen]).join('；')}。`
  }
  out.push({ title: '格局四化', content: patternText || '命盘格局平顺，四化流转尚待大运引动。' })

  return out
}
