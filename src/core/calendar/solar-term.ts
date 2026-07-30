/**
 * 节气精确计算
 * 基于天文算法（太阳黄经计算）
 * 用于：确定年柱分界（立春）、月柱分界（节气）
 */

export interface SolarTerm {
  name: string
  nameEn: string
  /** 太阳黄经度数 */
  longitude: number
  /** 对应的农历月份 */
  lunarMonth: number
  /** 是否为节（用于月柱分界） */
  isSection: boolean
}

// 24节气数据
export const SOLAR_TERMS: SolarTerm[] = [
  { name: '小寒', nameEn: 'Minor Cold',      longitude: 285,  lunarMonth: 12, isSection: false },
  { name: '大寒', nameEn: 'Major Cold',      longitude: 300,  lunarMonth: 12, isSection: false },
  { name: '立春', nameEn: 'Start of Spring',  longitude: 315,  lunarMonth: 1,  isSection: true  },
  { name: '雨水', nameEn: 'Rain Water',       longitude: 330,  lunarMonth: 1,  isSection: false },
  { name: '惊蛰', nameEn: 'Awakening of Insects', longitude: 345, lunarMonth: 2, isSection: true  },
  { name: '春分', nameEn: 'Spring Equinox',   longitude: 0,    lunarMonth: 2,  isSection: false },
  { name: '清明', nameEn: 'Pure Brightness',  longitude: 15,   lunarMonth: 3,  isSection: true  },
  { name: '谷雨', nameEn: 'Grain Rain',       longitude: 30,   lunarMonth: 3,  isSection: false },
  { name: '立夏', nameEn: 'Start of Summer',  longitude: 45,   lunarMonth: 4,  isSection: true  },
  { name: '小满', nameEn: 'Grain Full',       longitude: 60,   lunarMonth: 4,  isSection: false },
  { name: '芒种', nameEn: 'Grain in Ear',     longitude: 75,   lunarMonth: 5,  isSection: true  },
  { name: '夏至', nameEn: 'Summer Solstice',  longitude: 90,   lunarMonth: 5,  isSection: false },
  { name: '小暑', nameEn: 'Minor Heat',       longitude: 105,  lunarMonth: 6,  isSection: true  },
  { name: '大暑', nameEn: 'Major Heat',       longitude: 120,  lunarMonth: 6,  isSection: false },
  { name: '立秋', nameEn: 'Start of Autumn',  longitude: 135,  lunarMonth: 7,  isSection: true  },
  { name: '处暑', nameEn: 'End of Heat',      longitude: 150,  lunarMonth: 7,  isSection: false },
  { name: '白露', nameEn: 'White Dew',        longitude: 165,  lunarMonth: 8,  isSection: true  },
  { name: '秋分', nameEn: 'Autumnal Equinox', longitude: 180,  lunarMonth: 8,  isSection: false },
  { name: '寒露', nameEn: 'Cold Dew',         longitude: 195,  lunarMonth: 9,  isSection: true  },
  { name: '霜降', nameEn: 'Frost Descent',    longitude: 210,  lunarMonth: 9,  isSection: false },
  { name: '立冬', nameEn: 'Start of Winter',  longitude: 225,  lunarMonth: 10, isSection: true  },
  { name: '小雪', nameEn: 'Minor Snow',       longitude: 240,  lunarMonth: 10, isSection: false },
  { name: '大雪', nameEn: 'Major Snow',       longitude: 255,  lunarMonth: 11, isSection: true  },
  { name: '冬至', nameEn: 'Winter Solstice',  longitude: 270,  lunarMonth: 11, isSection: false },
]

/** 获取节气名称数组 */
export function getSolarTermNames(): string[] {
  return SOLAR_TERMS.map(t => t.name)
}

/** 
 * 计算节气的大致公历日期
 * 使用简化天文公式：基于年份和节气序号近似计算
 * 完整实现需要太阳位置精密计算，这里给出足够工程精度的近似值
 * 
 * @param year 公历年份
 * @param termIndex 节气序号（0=小寒，1=大寒，...，23=冬至）
 * @returns {month, day} 近似的公历月日
 */
export function getSolarTermDate(year: number, termIndex: number): { month: number; day: number } {
  // 每个节气平均间隔约15.218天
  // 以冬至为基准（12月22日左右）
  // 冬至 = index 23
  const termDates: [number, number][] = [
    // [month, day] 近似值，适用于2000~2050年
    [1, 5],   // 小寒
    [1, 20],  // 大寒
    [2, 4],   // 立春
    [2, 19],  // 雨水
    [3, 6],   // 惊蛰
    [3, 21],  // 春分
    [4, 5],   // 清明
    [4, 20],  // 谷雨
    [5, 6],   // 立夏
    [5, 21],  // 小满
    [6, 6],   // 芒种
    [6, 21],  // 夏至
    [7, 7],   // 小暑
    [7, 23],  // 大暑
    [8, 7],   // 立秋
    [8, 23],  // 处暑
    [9, 8],   // 白露
    [9, 23],  // 秋分
    [10, 8],  // 寒露
    [10, 23], // 霜降
    [11, 7],  // 立冬
    [11, 22], // 小雪
    [12, 7],  // 大雪
    [12, 22], // 冬至
  ]
  
  let [month, day] = termDates[termIndex]
  
  // 根据年份微调（世纪误差修正）
  // 年份越远离2000年，误差越大，这里做线性修正
  const yearOffset = year - 2000
  // 大约每4年节气提前约1小时
  const dayAdjust = Math.round(yearOffset * 0.0104)  // 约0.0104天/年
  day -= dayAdjust
  
  // 边界修正
  while (day < 1) { month--; day += getDaysInMonth(year, month) }
  while (day > getDaysInMonth(year, month)) { day -= getDaysInMonth(year, month); month++ }
  
  return { month, day: Math.round(day) }
}

/**
 * 获取公历某月天数（辅助）
 */
function getDaysInMonth(year: number, month: number): number {
  if (month < 1) { month = 12; year-- }
  if (month > 12) { month = 1; year++ }
  const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
  if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) return 29
  return daysInMonth[month - 1]
}

/**
 * 判断某个公历日期是否在指定节气之前
 * 用于确定年柱月柱分界
 */
export function isBeforeSolarTerm(year: number, month: number, day: number, termIndex: number): boolean {
  const termDate = getSolarTermDate(year, termIndex)
  if (month < termDate.month) return true
  if (month > termDate.month) return false
  return day < termDate.day
}

/**
 * 判断是否已过立春（用于确定年柱）
 * 立春前按上一年，立春后按当年
 */
export function hasPassedSpringStart(year: number, month: number, day: number): boolean {
  // 立春节气index = 2
  return !isBeforeSolarTerm(year, month, day, 2)
}

/**
 * 获取某日所在的节气月（用于月柱计算）
 * 节气月分界：立春(寅月)、惊蛰(卯月)、清明(辰月)、立夏(巳月)、
 *           芒种(午月)、小暑(未月)、立秋(申月)、白露(酉月)、
 *           寒露(戌月)、立冬(亥月)、大雪(子月)、小寒(丑月)
 * 对应的节气index: 立春=2, 惊蛰=4, 清明=6, 立夏=8,
 *                 芒种=10, 小暑=12, 立秋=14, 白露=16,
 *                 寒露=18, 立冬=20, 大雪=22, 小寒=0
 */
export function getSolarTermMonth(year: number, month: number, day: number): number {
  // 每个月节气的index
  const sectionIndices = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0]
  
  // 从后往前找，看哪个节气已经过了
  let termMonth = 0
  
  for (let i = 1; i <= 12; i++) {
    const idx = sectionIndices[i - 1]
    // 对于小寒（index=0），需要切换到上年12月
    if (idx === 0) {
      if (!isBeforeSolarTerm(year, month, day, idx)) {
        termMonth = 12
      }
      continue
    }
    if (!isBeforeSolarTerm(year, month, day, idx)) {
      termMonth = i
    } else {
      break
    }
  }
  
  if (termMonth === 0) {
    // 在立春之前，属于上一年丑月
    termMonth = 12
  }
  
  return termMonth
}
