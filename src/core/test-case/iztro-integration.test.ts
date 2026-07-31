import { describe, it, expect } from 'vitest'
import { astro } from 'iztro'
import { extractSelfArrows, extractFlyLines, extractDecadeFly, extractYearly } from '../../web-page/src/stores/chart'

// iztro 集成测试：验证前端主路径（iztro引擎 + 提取逻辑）
describe('iztro引擎集成', () => {
  const a = astro.bySolar('1990-8-30', 6, '男', true, 'zh-CN')

  it('bySolar返回12宫', () => {
    expect(a.palaces.length).toBe(12)
  })

  it('命宫为戊寅（五虎遁验证）', () => {
    const ming = a.palaces.find((p: any) => p.name === '命宫')
    expect(ming?.heavenlyStem).toBe('戊')
    expect(ming?.earthlyBranch).toBe('寅')
  })

  it('五行局为土五局', () => {
    expect(a.fiveElementsClass).toBe('土五局')
  })

  it('四柱含庚午年', () => {
    const cd = a.rawDates?.chineseDate
    expect(cd?.yearly?.join('')).toBe('庚午')
  })

  it('自化箭头提取（含方向）', () => {
    const arrows = extractSelfArrows(a)
    expect(Array.isArray(arrows)).toBe(true)
    arrows.forEach((ar: any) => {
      expect(['禄','权','科','忌']).toContain(ar.type)
      expect(['in','out']).toContain(ar.direction)
    })
  })

  it('飞线提取（去重且不飞本宫）', () => {
    const lines = extractFlyLines(a)
    expect(lines.length).toBeGreaterThan(0)
    const keys = new Set(lines.map((l: any) => `${l.fromBranch}-${l.toBranch}-${l.type}`))
    expect(keys.size).toBe(lines.length) // 无重复
    lines.forEach((l: any) => {
      expect(l.fromBranch).not.toBe(l.toBranch) // 不飞本宫
    })
  })

  it('大限飞线提取（当前年龄36）', () => {
    const lines = extractDecadeFly(a, 36)
    expect(Array.isArray(lines)).toBe(true)
  })

  it('流年提取（当年天干）', () => {
    const { fly, selfArrows } = extractYearly(a, new Date().getFullYear())
    expect(Array.isArray(fly)).toBe(true)
    expect(Array.isArray(selfArrows)).toBe(true)
  })

  it('horoscope流年/流月/流日可用', () => {
    const h = a.horoscope('2026-7-30')
    expect(h.yearly?.palaceNames?.length).toBe(12)
    expect(h.monthly?.palaceNames?.length).toBe(12)
    expect(h.daily?.palaceNames?.length).toBe(12)
  })

  it('小限/流时horoscope字段', () => {
    const h = a.horoscope('2026-7-30')
    expect(h.hourly).toBeTruthy()
    expect(h.age).toBeTruthy()
  })
})
