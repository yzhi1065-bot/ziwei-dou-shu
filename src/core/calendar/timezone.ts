/**
 * 真太阳时与时区修正
 * 
 * 紫微斗数排盘需要精确到出生地的真太阳时
 * 流程：北京时间 → 地方平太阳时 → 真太阳时修正
 */

export interface TimeCorrectionResult {
  /** 原始输入时间（北京时间，24小时制） */
  originalHour: number
  originalMinute: number
  /** 地方平太阳时 */
  localMeanHour: number
  localMeanMinute: number
  /** 修正后的真太阳时 */
  trueSolarHour: number
  trueSolarMinute: number
  /** 时辰编号（0=子, 1=丑, ... 11=亥） */
  timeBranchIndex: number
  /** 时辰名称 */
  timeBranchName: string
  /** 修正说明 */
  note: string
}

/** 中国城市经纬度数据库（用于近似定位） */
export interface CityLocation {
  city: string
  province: string
  longitude: number  // 东经
  latitude: number   // 北纬
}

export const CITY_LOCATIONS: CityLocation[] = [
  { city: '北京', province: '北京', longitude: 116.4, latitude: 39.9 },
  { city: '上海', province: '上海', longitude: 121.5, latitude: 31.2 },
  { city: '广州', province: '广东', longitude: 113.3, latitude: 23.1 },
  { city: '深圳', province: '广东', longitude: 114.1, latitude: 22.5 },
  { city: '杭州', province: '浙江', longitude: 120.2, latitude: 30.3 },
  { city: '南京', province: '江苏', longitude: 118.8, latitude: 32.1 },
  { city: '武汉', province: '湖北', longitude: 114.3, latitude: 30.6 },
  { city: '成都', province: '四川', longitude: 104.1, latitude: 30.7 },
  { city: '重庆', province: '重庆', longitude: 106.5, latitude: 29.6 },
  { city: '西安', province: '陕西', longitude: 108.9, latitude: 34.3 },
  { city: '沈阳', province: '辽宁', longitude: 123.4, latitude: 41.8 },
  { city: '天津', province: '天津', longitude: 117.2, latitude: 39.1 },
  { city: '长沙', province: '湖南', longitude: 113.0, latitude: 28.2 },
  { city: '郑州', province: '河南', longitude: 113.7, latitude: 34.8 },
  { city: '济南', province: '山东', longitude: 117.0, latitude: 36.7 },
  { city: '青岛', province: '山东', longitude: 120.4, latitude: 36.1 },
  { city: '哈尔滨', province: '黑龙江', longitude: 126.6, latitude: 45.8 },
  { city: '昆明', province: '云南', longitude: 102.7, latitude: 25.0 },
  { city: '贵阳', province: '贵州', longitude: 106.7, latitude: 26.7 },
  { city: '福州', province: '福建', longitude: 119.3, latitude: 26.1 },
  { city: '厦门', province: '福建', longitude: 118.1, latitude: 24.5 },
  { city: '南宁', province: '广西', longitude: 108.4, latitude: 22.8 },
  { city: '海口', province: '海南', longitude: 110.3, latitude: 20.0 },
  { city: '兰州', province: '甘肃', longitude: 103.8, latitude: 36.0 },
  { city: '西宁', province: '青海', longitude: 101.8, latitude: 36.6 },
  { city: '呼和浩特', province: '内蒙古', longitude: 111.7, latitude: 40.8 },
  { city: '乌鲁木齐', province: '新疆', longitude: 87.6, latitude: 43.8 },
  { city: '拉萨', province: '西藏', longitude: 91.1, latitude: 29.6 },
  { city: '银川', province: '宁夏', longitude: 106.3, latitude: 38.5 },
  { city: '太原', province: '山西', longitude: 112.5, latitude: 37.9 },
  { city: '石家庄', province: '河北', longitude: 114.5, latitude: 38.0 },
  { city: '南昌', province: '江西', longitude: 115.9, latitude: 28.7 },
  { city: '合肥', province: '安徽', longitude: 117.3, latitude: 31.8 },
  { city: '香港', province: '香港', longitude: 114.2, latitude: 22.3 },
  { city: '澳门', province: '澳门', longitude: 113.5, latitude: 22.2 },
  { city: '台北', province: '台湾', longitude: 121.5, latitude: 25.0 },
]

/**
 * 搜索城市经纬度
 */
export function findCityLocation(cityName: string): CityLocation | undefined {
  return CITY_LOCATIONS.find(
    c => c.city === cityName || c.city.includes(cityName) || cityName.includes(c.city)
  )
}

/**
 * 北京时区偏移（东八区 = UTC+8）
 */
const BEIJING_LONGITUDE = 120.0  // 东经120度

/**
 * 计算地方平太阳时
 * 地球每15度经度差1小时
 * 东经120度 = 北京时间
 */
function calcLocalMeanTime(hour: number, minute: number, longitude: number): { hour: number; minute: number } {
  // 经度差（东经120度 - 所在地东经）
  const longitudeDiff = BEIJING_LONGITUDE - longitude
  // 每1度经度差 = 4分钟
  const diffMinutes = longitudeDiff * 4
  
  let totalMinutes = hour * 60 + minute - diffMinutes
  
  // 处理日期跨越
  // （这里不处理日期，只返回当天时间，可能为负）
  
  const resultHour = Math.floor(totalMinutes / 60)
  const resultMinute = Math.round(totalMinutes % 60)
  
  return {
    hour: ((resultHour % 24) + 24) % 24,
    minute: ((resultMinute % 60) + 60) % 60
  }
}

/**
 * 真太阳时修正（均时差）
 * 地球公转轨道为椭圆形，导致真太阳时与平太阳时存在差值
 * 最大约±16分钟
 * 
 * 使用近似公式计算均时差（Equation of Time）
 * 精度约±2分钟，对紫微斗数排盘来说足够（时辰精确到2小时区间）
 */
function equationOfTime(dayOfYear: number): number {
  // 均时差近似公式（天文学标准近似）
  const B = (360 * (dayOfYear - 81)) / 365 * Math.PI / 180
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
  return eot  // 单位：分钟
}

/**
 * 获取一年中的第几天
 */
function getDayOfYear(year: number, month: number, day: number): number {
  const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
  let days = 0
  for (let i = 0; i < month - 1; i++) {
    days += monthDays[i]
  }
  days += day
  if (month > 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
    days += 1  // 闰年
  }
  return days
}

/**
 * 计算完整的真太阳时修正
 * 
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日
 * @param hour 小时（北京时间，24小时制）
 * @param minute 分钟
 * @param longitude 东经（度）
 * @returns 修正结果
 */
export function calcTrueSolarTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  longitude: number
): TimeCorrectionResult {
  // 1. 地方平太阳时
  const localMean = calcLocalMeanTime(hour, minute, longitude)
  
  // 2. 真太阳时修正（均时差）
  const dayOfYear = getDayOfYear(year, month, day)
  const eot = equationOfTime(dayOfYear)
  
  let trueSolarMinutes = localMean.hour * 60 + localMean.minute + eot
  const trueSolarHour = ((Math.floor(trueSolarMinutes / 60) % 24) + 24) % 24
  const trueSolarMinute = ((Math.round(trueSolarMinutes % 60)) + 60) % 60
  
  // 3. 时辰编号
  const timeBranchIndex = Math.floor(((trueSolarHour + 1) % 24) / 2)
  const timeBranchNames = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
  const timeBranchName = timeBranchNames[timeBranchIndex]
  
  // 修正说明
  const latitude = 0
  const longitudeDiff = BEIJING_LONGITUDE - longitude
  const note = longitudeDiff !== 0
    ? `北京时间→地方平太阳时修正${Math.abs(longitudeDiff * 4).toFixed(1)}分钟（${longitudeDiff > 0 ? '晚' : '早'}），` +
      `均时差修正${eot > 0 ? '+' : ''}${eot.toFixed(1)}分钟`
    : `已在北京时区，仅做均时差修正${eot > 0 ? '+' : ''}${eot.toFixed(1)}分钟`
  
  return {
    originalHour: hour,
    originalMinute: minute,
    localMeanHour: localMean.hour,
    localMeanMinute: localMean.minute,
    trueSolarHour,
    trueSolarMinute,
    timeBranchIndex,
    timeBranchName,
    note
  }
}

/**
 * 简化版：只获取时辰序号（0~11）
 * 适用于快速排盘，不输出详细修正信息
 */
export function getTimeBranchIndex(
  year: number, month: number, day: number,
  hour: number, minute: number,
  longitude?: number
): number {
  // 如果提供了经度，做真太阳时修正
  if (longitude !== undefined && longitude !== 120) {
    const result = calcTrueSolarTime(year, month, day, hour, minute, longitude)
    return result.timeBranchIndex
  }
  // 默认使用北京时间（东八区）
  const beijingTimeBranch = Math.floor(((hour + 1) % 24) / 2)
  return beijingTimeBranch
}
