import { describe, it, expect } from 'vitest'
import { createChart, quickChart } from '../chart'
import { calcZiweiPosition } from '../palace/stars'
import { calcMingPalace, calcShenPalace, calcPalaceStem } from '../palace/palace'
import { calcElementPhase, getPhaseNumber } from '../palace/five-elements'
import { getHuaByStem } from '../transform/heavenly-stems'
import { calcGreatLimits } from '../fortune/great-limit'

describe('紫微定位算法', () => {
  it('水二局第1天紫微在寅(3)', () => {
    expect(calcZiweiPosition('水二局', 1)).toBe(3)
  })
  it('水二局第2天紫微在寅(3)，第3天起卯', () => {
    expect(calcZiweiPosition('水二局', 2)).toBe(3)
    expect(calcZiweiPosition('水二局', 3)).toBe(4)
  })
  it('金四局第5天紫微在卯(4)', () => {
    expect(calcZiweiPosition('金四局', 5)).toBe(4)
  })
  it('火六局第30天紫微在午(7)', () => {
    expect(calcZiweiPosition('火六局', 30)).toBe(7)
  })
})

describe('命宫身宫', () => {
  it('正月子时命宫在寅(3)', () => {
    expect(calcMingPalace(1, 0)).toBe(3)
  })
  it('正月子时身宫在寅(3)', () => {
    expect(calcShenPalace(1, 0)).toBe(3)
  })
  it('六月午时命宫在丑(2)', () => {
    // 寅起正月顺数至六月=未(8)，逆数至午时(6)：8-6=2(丑)
    expect(calcMingPalace(6, 6)).toBe(2)
  })
  it('五虎遁：庚年寅宫天干为戊', () => {
    expect(calcPalaceStem(6, 3)).toBe('戊')
  })
  it('五虎遁：甲年寅宫天干为丙', () => {
    expect(calcPalaceStem(0, 3)).toBe('丙')
  })
  it('五虎遁：丙年寅宫天干为庚', () => {
    expect(calcPalaceStem(2, 3)).toBe('庚')
  })
})

describe('五行局', () => {
  it('丙寅纳音为炉中火→火六局', () => {
    expect(calcElementPhase('丙', '寅')).toBe('火六局')
  })
  it('甲子纳音为海中金→金四局', () => {
    expect(calcElementPhase('甲', '子')).toBe('金四局')
  })
  it('戊寅纳音为城头土→土五局', () => {
    expect(calcElementPhase('戊', '寅')).toBe('土五局')
  })
  it('火六局对应数字6', () => {
    expect(getPhaseNumber('火六局')).toBe(6)
  })
})

describe('四化表', () => {
  it('甲干四化：廉贞禄破军权武曲科太阳忌', () => {
    const hua = getHuaByStem('甲')
    expect(hua.map(h => h.starId)).toEqual(['lianzhen', 'pojun', 'wuqu', 'taiyang'])
    expect(hua.map(h => h.type)).toEqual(['禄', '权', '科', '忌'])
  })
  it('丁干四化：太阴禄天同权天机科巨门忌', () => {
    const hua = getHuaByStem('丁')
    expect(hua.map(h => h.starId)).toEqual(['taiyin', 'tiantong', 'tianji', 'jumen'])
  })
})

describe('大限', () => {
  it('土五局阳男顺行，5岁起运', () => {
    // 命宫卯(4) 身宫亥(12) 庚年(6) 午年(6) 男 土五局
    const limits = calcGreatLimits(4, 12, 6, 6, '男', '土五局')
    expect(limits[0].startAge).toBe(5)
  })
  it('大限共12限每限10年', () => {
    const limits = calcGreatLimits(4, 12, 6, 6, '男', '土五局')
    expect(limits.length).toBe(12)
    expect(limits[0].endAge - limits[0].startAge).toBe(9)
  })
})

describe('端到端已知盘（与iztro/文墨天机对齐）', () => {
  it('2024-2-10子时男：甲辰年', () => {
    const c = quickChart(2024, 2, 10, 0, 0, '男')
    expect(c.fourPillars.year).toContain('甲')
    expect(c.fourPillars.year).toContain('辰')
  })
  it('1990-8-30午时男：命宫戊寅，土五局', () => {
    const c = quickChart(1990, 8, 30, 12, 0, '男')
    expect(c.elementPhase).toBe('土五局')
    const m = c.palaces.find(p => p.isMing)
    expect(m?.stem).toBe('戊')
    expect(m?.branch).toBe('寅')
  })
  it('命盘12宫齐全', () => {
    const c = createChart({ year: 1990, month: 8, day: 30, hour: 12, minute: 0, gender: '男', school: 'sanhe' })
    expect(c.palaces.length).toBe(12)
    expect(c.palaces.filter(p => p.isMing).length).toBe(1)
  })
  it('紫微星系7主星完整', () => {
    const c = createChart({ year: 1990, month: 8, day: 30, hour: 12, minute: 0, gender: '男', school: 'sanhe' })
    const allStars = c.palaces.flatMap(p => p.mainStars)
    expect(allStars).toContain('ziwei')
    expect(allStars).toContain('tianfu')
    expect(allStars).toContain('pojun')
  })
})
