import { solarToLunar } from '../calendar/lunar'
import { calcMingPalace, calcShenPalace } from '../palace/palace'

// 2000-1-1 0点
const lun = solarToLunar(2000, 1, 1)
console.log('农历:', JSON.stringify(lun))
const timeIdx = Math.floor((0 + 1) % 24 / 2)
console.log('时索引:', timeIdx)
console.log('命宫:', calcMingPalace(lun.month, timeIdx, lun.isLeap))
console.log('身宫:', calcShenPalace(lun.month, timeIdx, lun.isLeap))

// 2000-6-1 12点
const lun2 = solarToLunar(2000, 6, 1)
console.log('\n农历2:', JSON.stringify(lun2))
const t2 = Math.floor((12 + 1) % 24 / 2)
console.log('时索引:', t2, '命宫:', calcMingPalace(lun2.month, t2, lun2.isLeap))
