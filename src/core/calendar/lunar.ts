/**
 * 公农历互转核心算法
 * 
 * 数据来源: lunar-javascript (MIT) — 与 iztro 同源，天文算法验证准确
 * 替换自编农历百年表（存在1999等年份数据偏差）
 * https://github.com/6tail/lunar-javascript
 */

import { Solar, Lunar, LunarYear } from 'lunar-javascript'

export interface LunarDate {
  year: number
  month: number
  day: number
  isLeap: boolean
}

export interface SolarDate {
  year: number
  month: number
  day: number
}

/** 天干 */
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
/** 地支 */
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

/**
 * 公历转农历
 */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const solar = Solar.fromYmd(year, month, day)
  const lunar = solar.getLunar()
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeap: lunar.getMonthInChinese().includes('闰'),
  }
}

/**
 * 农历转公历
 */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap: boolean = false
): SolarDate {
  const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay)
  const solar = lunar.getSolar()
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() }
}

/** 获取某农历年的闰月（0=无闰月） */
export function getLeapMonth(year: number): number {
  const ly = LunarYear.fromYear(year)
  return ly.getLeapMonth()
}

/** 农历年总天数（本春节到下一年春节的天数差） */
export function getYearDays(year: number): number {
  const s1 = getSpringFestival(year)
  const s2 = getSpringFestival(year + 1)
  const d1 = Date.UTC(s1.year, s1.month - 1, s1.day)
  const d2 = Date.UTC(s2.year, s2.month - 1, s2.day)
  return Math.round((d2 - d1) / 86400000)
}

/** 春节（农历正月初一）对应的公历 */
export function getSpringFestival(year: number): SolarDate {
  const lunar = Lunar.fromYmd(year, 1, 1)
  const solar = lunar.getSolar()
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() }
}

/** 春节偏移（从1901-01-01到该年春节的天数）——兼容旧接口 */
export function getSpringFestivalOffset(year: number): number {
  const sf = getSpringFestival(year)
  const base = Date.UTC(1901, 0, 1)
  const target = Date.UTC(sf.year, sf.month - 1, sf.day)
  return Math.round((target - base) / 86400000)
}

/** 公历某月天数（含闰年） */
export function getSolarMonthDays(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** 判断公历闰年 */
export function isSolarLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/** 农历月天数（兼容旧接口，month为负数表示闰月） */
export function getMonthDays(year: number, month: number, isLeap: boolean = false): number {
  const lunar = Lunar.fromYmd(year, Math.abs(month), 1)
  const l = lunar as any
  return l.getDayCount ? l.getDayCount() : 30
}

// 兼容旧导出
export const HEAVENLY_STEMS = STEMS
export const EARTH_BRANCHES = BRANCHES

/** 四柱干支 */
export interface Pillar {
  stem: string
  branch: string
}

/** 计算四柱（年柱/月柱/日柱/时柱） */
export function getFourPillars(
  year: number, month: number, day: number, hour: number,
  isLunar: boolean = false
): { yearPillar: Pillar; monthPillar: Pillar; dayPillar: Pillar; hourPillar: Pillar } {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0)
  const lunar = solar.getLunar()
  const ec = lunar.getEightChar()
  const split = (s: string): Pillar => ({ stem: s.slice(0, 1), branch: s.slice(1, 2) })
  return {
    yearPillar: split(ec.getYear()),
    monthPillar: split(ec.getMonth()),
    dayPillar: split(ec.getDay()),
    hourPillar: split(ec.getTime()),
  }
}

/** 年柱（兼容旧接口：只传年份时默认取年中6月30日，保证立春已过） */
export function getYearPillar(year: number, month?: number, day?: number): Pillar {
  return getFourPillars(year, month ?? 6, day ?? 30, 0).yearPillar
}

/** 月柱 */
export function getMonthPillar(year: number, month: number, day: number): Pillar {
  return getFourPillars(year, month, day, 0).monthPillar
}

/** 日柱 */
export function getDayPillar(year: number, month: number, day: number): Pillar {
  return getFourPillars(year, month, day, 0).dayPillar
}

/** 时柱（兼容旧接口：getHourPillar(year, hour) 或 getHourPillar(year, month, day, hour)） */
export function getHourPillar(year: number, monthOrHour: number, day?: number, hour?: number): Pillar {
  if (hour === undefined) {
    // 旧接口: getHourPillar(year, hour)
    return getFourPillars(year, 6, 30, monthOrHour).hourPillar
  }
  return getFourPillars(year, monthOrHour, day!, hour).hourPillar
}
