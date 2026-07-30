# 紫微斗数排盘系统 (Zi Wei Dou Shu)

> 开源紫微斗数命理排盘算法库 + 网页端 + 微信小程序

## 项目结构

```
ziwei-dou-shu/
├── src/core/            # 纯TypeScript算法核心（历法、安星、四化、格局、大限）
├── src/web-page/        # Vue3 + Vite 网页端（国风SVG盘面可视化）
├── src/mini-program/    # 微信小程序（Uniapp，开发中）
├── docs/                # 算法校正文档、项目计划
├── scripts/             # 自动化比对脚本
└── vercel.json          # Vercel部署配置
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 运行测试（51项算法校验）
npx vitest run

# 3. 启动网页端
cd src/web-page
npm install
npm run dev

# 4. 浏览器打开 http://localhost:5173
```

## 算法模块

| 模块 | 功能 | 测试 |
|------|------|------|
| 历法换算 | 公农历互转(1901-2100)、节气计算、真太阳时 | ✅ |
| 命宫身宫 | 十二宫排布、五行局、命主身主 | ✅ |
| 安星法 | 14主星定位(紫微系+天府系)、辅煞星30+颗 | ✅ |
| 四化运算 | 天干四化、流年四化，支持4流派切换 | ✅ |
| 大限运势 | 十年大限、流年流月 | ✅ |
| 格局判定 | 杀破狼/紫府同宫/日月并明等10+种 | ✅ |
| 庙旺落陷 | 14主星+文昌文曲完整亮度表 | ✅ |

## API 使用示例

```typescript
import { createChart } from './src/core'

const chart = createChart({
  year: 1990, month: 8, day: 30,
  hour: 12, minute: 0,
  gender: '男',
  school: 'sanhe',  // 可选: sanhe/feixing/sihua/nishi
})

console.log(chart.fourPillars)  // 四柱八字
console.log(chart.elementPhase) // 五行局
console.log(chart.palaces[0])   // 命宫详情
```

## 技术栈

- **算法**：TypeScript（强类型、可测试）
- **网页**：Vue3 + Vite + Pinia + TailwindCSS
- **盘面**：SVG矢量图
- **测试**：Vitest（51项单元测试）
- **部署**：Vercel一键部署

## 开源协议

MIT License
