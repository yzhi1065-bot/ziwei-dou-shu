/**
 * 命盘导出工具
 */

import type { ChartResult } from '../../../core/types'
import { STAR_NAMES } from '../../../core/stars-data/star-names'

/** 导出盘面数据为JSON */
export function exportChartJson(chart: ChartResult): string {
  const data = {
    version: '1.0',
    generated: new Date().toISOString(),
    input: chart.input,
    fourPillars: chart.fourPillars,
    elementPhase: chart.elementPhase,
    mingMaster: chart.mingMaster,
    shenMaster: chart.shenMaster,
    palaces: chart.palaces.map(p => ({
      name: p.name,
      stem: p.stem,
      branch: p.branch,
      mainStars: p.mainStars.map(id => STAR_NAMES[id]?.nameCn || id),
      minorStars: p.minorStars.map(id => STAR_NAMES[id]?.nameCn || id),
      shaStars: p.shaStars.map(id => STAR_NAMES[id]?.nameCn || id),
      miscStars: p.miscStars.map(id => STAR_NAMES[id]?.nameCn || id),
      hua: p.hua,
    })),
    hua: chart.hua.map(h => ({
      star: STAR_NAMES[h.starId]?.nameCn || h.starId,
      type: h.type,
    })),
    greatLimits: chart.greatLimits,
  }
  return JSON.stringify(data, null, 2)
}

/** 下载JSON文件 */
export function downloadJson(data: string, filename: string = 'ziwei-chart.json'): void {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 生成纯文本盘面摘要 */
export function chartToText(chart: ChartResult): string {
  const lines: string[] = []
  lines.push('===== 紫微斗数命盘 =====')
  lines.push(`四柱：${chart.fourPillars.year} ${chart.fourPillars.month} ${chart.fourPillars.day} ${chart.fourPillars.hour}`)
  lines.push(`五行局：${chart.elementPhase}`)
  lines.push(`命主：${chart.mingMaster}  身主：${chart.shenMaster}`)
  lines.push('')
  
  chart.palaces.forEach(p => {
    const stars = [
      ...p.mainStars.map(id => STAR_NAMES[id]?.nameCn || id),
      ...p.minorStars.map(id => STAR_NAMES[id]?.nameCn || id),
      ...p.shaStars.map(id => `[${STAR_NAMES[id]?.nameCn || id}]`),
    ]
    const hua = p.hua.length ? ` (${p.hua.join(',')})` : ''
    lines.push(`${p.name}[${p.stem}${p.branch}]: ${stars.join('、') || '空宫'}${hua}`)
  })
  
  return lines.join('\n')
}
