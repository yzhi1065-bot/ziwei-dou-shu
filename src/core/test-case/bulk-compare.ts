/**
 * 批量随机比对脚本
 * 自动生成100个随机生辰，对比自研core算法 vs iztro（文墨天机同源）
 * 输出一致率报告，定位差异年份/月份规律
 *
 * 运行: npx tsx src/core/test-case/bulk-compare.ts
 */
import { createChart } from '../chart'
import { astro } from 'iztro'

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const ROUNDS = 100

interface Diff { y:number; m:number; d:number; h:number; field:string; mine:any; iztro:any }

function rnd(min:number, max:number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function compare(): { pass: number; total: number; diffs: Diff[] } {
  let pass = 0
  const diffs: Diff[] = []
  for (let i = 0; i < ROUNDS; i++) {
    const y = rnd(1950, 2030)
    const m = rnd(1, 12)
    const d = rnd(1, 28)
    const hour = rnd(0, 23)
    const timeIndex = Math.floor((hour + 1) / 2)

    const mine = createChart({ year: y, month: m, day: d, hour, minute: 0, gender: '男', school: 'sanhe' })
    const iz = astro.bySolar(`${y}-${m}-${d}`, timeIndex, '男', true, 'zh-CN')
    const ming = iz.palaces.find((p:any) => p.name === '命宫')
    const cd = iz.rawDates?.chineseDate

    let ok = true
    const check = (field:string, mv:any, iv:any) => {
      if (mv !== iv) {
        ok = false
        diffs.push({ y, m, d, h: hour, field, mine: mv, iztro: iv })
      }
    }
    check('年柱', mine.fourPillars.year, cd?.yearly?.join(''))
    check('月柱', mine.fourPillars.month, cd?.monthly?.join(''))
    check('日柱', mine.fourPillars.day, cd?.daily?.join(''))
    check('时柱', mine.fourPillars.hour, cd?.hourly?.join(''))
    check('五行局', mine.elementPhase, iz.fiveElementsClass)
    check('命宫', EB[mine.mingPalace - 1], ming?.earthlyBranch)
    check('命主', mine.mingMaster, iz.soul)
    check('身主', mine.shenMaster, iz.body)

    if (ok) pass++
  }
  return { pass, total: ROUNDS, diffs }
}

const result = compare()
console.log(`\n========== 批量比对报告 ==========`)
console.log(`总样本: ${result.total}`)
console.log(`完全一致: ${result.pass}`)
console.log(`一致率: ${(result.pass / result.total * 100).toFixed(1)}%`)
console.log(`存在差异: ${result.total - result.pass}`)

if (result.diffs.length) {
  console.log(`\n--- 差异明细 (前20条) ---`)
  const byField: Record<string, number> = {}
  result.diffs.slice(0, 20).forEach(d => {
    console.log(`[${d.y}-${d.m}-${d.d} ${d.h}时] ${d.field}: 自研=${d.mine} vs iztro=${d.iztro}`)
    byField[d.field] = (byField[d.field] || 0) + 1
  })
  console.log(`\n--- 差异字段统计 ---`)
  Object.entries(byField).forEach(([f, c]) => console.log(`  ${f}: ${c}处`))
}

// 退出码：有差异则非0
process.exit(result.pass === result.total ? 0 : 1)
