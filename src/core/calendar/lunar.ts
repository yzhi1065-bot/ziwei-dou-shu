/**
 * 公农历互转核心算法
 * 依据：天文算法 + 农历百年数据表
 * 
 * 农历数据编码（17位有效位）：
 *   bit 0~3  : 闰月月份（0=无闰月）
 *   bit 4~15 : 12个月的大小月（1=30天大月，0=29天小月，bit4=正月...bit15=腊月）
 *   bit 16   : 闰月大小（1=30天，0=29天）
 * 
 * 春节日期通过从1901年开始累计计算。
 * 基准：1901-01-01 = 农历1900-11-11
 * 覆盖范围：1901年~2100年
 */

// 农历年数据表（1901~2100）
// 每项: 闰月月份(低4位) + 12个月大小月(中间12位) + 闰月大小(高1位)
// 取值参考标准农历数据库（香港天文台校准）
const LUNAR_YEAR_DATA: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
]

/** 公历每月天数（平年） */
const SOLAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** 天干 */
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
/** 地支 */
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

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

// 累计春节偏移表（从1901-01-01到每年农历年初一的天数）
// 从1901年开始，逐年累加前一年的农历年总天数
let _springFestivalCache: Map<number, number> | null = null

/** 获取农历年数据（低17位有效） */
function getLunarData(year: number): number {
  const idx = year - 1901
  if (idx < 0 || idx >= LUNAR_YEAR_DATA.length) {
    throw new Error(`农历年份超出范围: ${year} (支持1901-2100)`)
  }
  return LUNAR_YEAR_DATA[idx] & 0x1ffff  // 只取低17位
}

/** 获取闰月月份（0=无闰月） */
function getLeapMonthFromData(data: number): number {
  return data & 0x0f
}

/** 获取指定月是否为大月（30天） */
function isBigMonth(data: number, month: number): boolean {
  return !!(data & (1 << (3 + month)))  // bit4~15对应月份1~12
}

/** 获取闰月天数 */
function getLeapMonthDays(data: number): number {
  return (data & 0x10000) ? 30 : 29  // bit16
}

/** 获取某月天数 */
export function getMonthDays(year: number, month: number, isLeap: boolean): number {
  const data = getLunarData(year)
  if (isLeap) {
    return getLeapMonthFromData(data) === month ? getLeapMonthDays(data) : 0
  }
  return isBigMonth(data, month) ? 30 : 29
}

/** 获取农历年总天数 */
export function getYearDays(year: number): number {
  const data = getLunarData(year)
  let total = 0
  for (let m = 1; m <= 12; m++) {
    total += isBigMonth(data, m) ? 30 : 29
  }
  const leap = getLeapMonthFromData(data)
  if (leap > 0) total += getLeapMonthDays(data)
  return total
}

/** 获取某年春节偏移（从1901-01-01到该年春节的天数） */
export function getSpringFestivalOffset(year: number): number {
  if (!_springFestivalCache) {
    // 构建缓存：1901年春节 = 从1901-01-01到1901-02-19 = 49天
    // 实际上1901年春节是2月19日
    _springFestivalCache = new Map()
    let offset = 49  // 1901年春节（1901-02-19 = 从1901-01-01起第49天）
    _springFestivalCache.set(1901, offset)
    
    for (let y = 1902; y <= 2101; y++) {
      offset += getYearDays(y - 1)
      _springFestivalCache.set(y, offset)
    }
  }
  return _springFestivalCache.get(year) ?? 49
}

/** 判断闰年 */
export function isSolarLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/** 公历某月天数 */
export function getSolarMonthDays(year: number, month: number): number {
  if (month === 2 && isSolarLeapYear(year)) return 29
  return SOLAR_MONTH_DAYS[month - 1]
}

/** 公历到天数的转换（从1901-01-01起） */
export function solarToDayCount(year: number, month: number, day: number): number {
  let total = 0
  for (let y = 1901; y < year; y++) {
    total += isSolarLeapYear(y) ? 366 : 365
  }
  for (let m = 1; m < month; m++) {
    total += getSolarMonthDays(year, m)
  }
  return total + day - 1  // 第0天=1901-01-01
}

/** 天数到公历的转换 */
export function dayCountToSolar(days: number): SolarDate {
  let y = 1901
  while (true) {
    const yd = isSolarLeapYear(y) ? 366 : 365
    if (days < yd) break
    days -= yd
    y++
  }
  for (let m = 1; m <= 12; m++) {
    const md = getSolarMonthDays(y, m)
    if (days < md) {
      return { year: y, month: m, day: days + 1 }
    }
    days -= md
  }
  return { year: y, month: 12, day: 31 }
}

/** 公历转农历 */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const days = solarToDayCount(year, month, day)
  
  // 找到该日所属的农历年
  // 先估算：每个农历年约355天
  let lunarYear = 1901 + Math.floor((days - 49) / 355)
  if (lunarYear < 1901) lunarYear = 1901
  if (lunarYear > 2100) lunarYear = 2100
  
  // 校准
  while (getSpringFestivalOffset(lunarYear) > days && lunarYear > 1901) {
    lunarYear--
  }
  while (lunarYear < 2100 && getSpringFestivalOffset(lunarYear + 1) <= days) {
    lunarYear++
  }
  
  // 计算在农历年内的偏移
  const springOffset = getSpringFestivalOffset(lunarYear)
  let offset = days - springOffset
  
  const data = getLunarData(lunarYear)
  const leapMonth = getLeapMonthFromData(data)
  
  // 遍历各月
  for (let m = 1; m <= 12; m++) {
    const md = isBigMonth(data, m) ? 30 : 29
    if (offset < md) {
      return { year: lunarYear, month: m, day: offset + 1, isLeap: false }
    }
    offset -= md
    
    // 如果本月是闰月
    if (leapMonth === m) {
      const lmd = getLeapMonthDays(data)
      if (offset < lmd) {
        return { year: lunarYear, month: m, day: offset + 1, isLeap: true }
      }
      offset -= lmd
    }
  }
  
  // 如果还有剩余天数，应该在下一年
  return { year: lunarYear + 1, month: 1, day: offset + 1, isLeap: false }
}

/** 农历转公历 */
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean): SolarDate {
  const springOffset = getSpringFestivalOffset(lunarYear)
  const data = getLunarData(lunarYear)
  const leapMonth = getLeapMonthFromData(data)
  
  let offset = 0
  for (let m = 1; m < lunarMonth; m++) {
    offset += isBigMonth(data, m) ? 30 : 29
    if (leapMonth === m) {
      offset += getLeapMonthDays(data)
    }
  }
  
  // 如果是闰月
  if (isLeap) {
    if (leapMonth !== lunarMonth) {
      throw new Error(`农历${lunarYear}年${lunarMonth}月无闰月`)
    }
    offset += isBigMonth(data, lunarMonth) ? 30 : 29
  }
  
  offset += lunarDay - 1
  
  return dayCountToSolar(springOffset + offset)
}

/** 获取春节公历日期 */
export function getSpringFestival(year: number): SolarDate {
  const days = getSpringFestivalOffset(year)
  return dayCountToSolar(days)
}

/** 获取闰月月份 */
export function getLeapMonth(year: number): number {
  const data = getLunarData(year)
  return getLeapMonthFromData(data)
}

/** 年柱 */
export function getYearPillar(year: number): { stem: string; branch: string } {
  const stemIdx = ((year - 4) % 10 + 10) % 10
  const branchIdx = ((year - 4) % 12 + 12) % 12
  return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] }
}

/** 月柱 */
export function getMonthPillar(yearStemIndex: number, lunarMonth: number): { stem: string; branch: string } {
  // 甲己丙作首，乙庚戊为头，丙辛寻庚上，丁壬壬顺流，戊癸甲寅求
  const table = [2, 4, 6, 8, 0]
  const start = table[Math.floor((yearStemIndex % 10) / 2)]
  return {
    stem: STEMS[(start + lunarMonth - 1) % 10],
    branch: BRANCHES[(lunarMonth + 1) % 12]
  }
}

/** 日柱 */
export function getDayPillar(year: number, month: number, day: number): { stem: string; branch: string } {
  const days = solarToDayCount(year, month, day)
  // 1901-01-01 = 甲子日(天干0, 地支0)
  return {
    stem: STEMS[days % 10],
    branch: BRANCHES[days % 12]
  }
}

/** 时柱 */
export function getHourPillar(dayStemIndex: number, hour: number): { stem: string; branch: string } {
  const branchIdx = Math.floor(((hour + 1) % 24) / 2)
  const startTable = [0, 2, 4, 6, 8]  // 甲己→甲, 乙庚→丙, ...
  const start = startTable[Math.floor((dayStemIndex % 10) / 2)]
  return {
    stem: STEMS[(start + branchIdx) % 10],
    branch: BRANCHES[branchIdx]
  }
}

/** 完整四柱 */
export function getFourPillars(
  year: number, month: number, day: number, hour: number, isLunar: boolean = false
): { yearPillar: { stem: string; branch: string }; monthPillar: { stem: string; branch: string }; dayPillar: { stem: string; branch: string }; hourPillar: { stem: string; branch: string } } {
  let sy = year, sm = month, sd = day
  if (isLunar) {
    const s = lunarToSolar(year, month, day, false)
    sy = s.year; sm = s.month; sd = s.day
  }
  const yp = getYearPillar(sy)
  const lunar = solarToLunar(sy, sm, sd)
  const ysIdx = STEMS.indexOf(yp.stem)
  const mp = getMonthPillar(ysIdx, lunar.month)
  const dp = getDayPillar(sy, sm, sd)
  const dsIdx = STEMS.indexOf(dp.stem)
  const hp = getHourPillar(dsIdx, hour)
  return { yearPillar: yp, monthPillar: mp, dayPillar: dp, hourPillar: hp }
}
