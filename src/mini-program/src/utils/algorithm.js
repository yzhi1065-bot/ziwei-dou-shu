/**
 * 算法加载器（小程序用）
 * 从打包好的UMD bundle引入核心算法
 * 
 * 在页面中使用：
 *   import { createChart } from '../../utils/algorithm'
 */

// UMD bundle 在编译时自动挂载到 globalThis.ZiweiCore
// 也可以直接导入（取决于小程序构建工具）
import ZiweiCore from './ziwei-core.es.js'

export const createChart = ZiweiCore.createChart
export const quickChart = ZiweiCore.quickChart

export default ZiweiCore
