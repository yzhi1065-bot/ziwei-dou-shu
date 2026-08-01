# 紫微斗数排盘系统 (Zi Wei Dou Shu)

> 一个基于 **iztro** 引擎的全功能紫微斗数排盘网页应用。
> 整合 **vue-ziwei** 前端布局与 **ziwei-doushu** 经典知识数据。

## 🌐 在线排盘（直接访问）

**https://yzhi1065-bot.github.io/ziwei-dou-shu/**

无需安装，打开即用：录入生辰 → 开始排盘 → 查看命盘/运势/合盘/解读。支持PWA离线安装到桌面。

## 快速开始

```bash
# 1. 安装依赖
cd src/web-page
npm install

# 2. 启动开发服务器
npx vite

# 3. 浏览器打开 http://localhost:5173
```

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 算法引擎 | **iztro** (npm) | 排盘/安星/四化/大限/流年 |
| 前端框架 | Vue 3 + Vite + Pinia | SPA 单页应用 |
| 盘面布局 | **vue-ziwei** (参考) | 4×4传统方盘风格 |
| 知识数据 | **ziwei-doushu** (参考) | 格局/经典/倪海厦 |
| 样式 | TailwindCSS + 国风主题 | 朱砂红/石青/金箔配色 |

## 功能

- iztro 引擎排盘（安星/四化/大限/流年）
- 4×4 传统方盘（地支定位、命宫高亮、身宫竖标）
- 108 星曜排布（主星 + 辅煞 + 杂曜）
- 四化标注（禄权科忌彩色标识）
- 庙旺落陷（红/橙/金三色亮度）
- 三方四正高亮（点击格子 → 金虚线连接）
- 大限/小限显示
- 十二神煞（长生/博士/将前/岁前）
- 流年/流月/流日切换
- 本命四化汇总
- 中宫信息（四柱/阳历/五行局/命主身主）
- 保存/历史记录（localStorage）
- 知识库（14主星 + 经典古籍索引）

## 项目结构

```
ziwei-dou-shu/
├── src/
│   ├── core/           # 自研TS算法（历法/安星/四化）
│   ├── iztro/          # iztro 完整源码参考 (MIT)
│   ├── ziwei-doushu/   # ziwei-doushu 数据 (MIT) — 23文件
│   ├── vue-ziwei-ref/  # vue-ziwei 参考源码 (MIT)
│   └── web-page/       # Vue3 前端
│       ├── src/
│       │   ├── components/ZiweiPlate.vue  ← 方盘组件
│       │   ├── stores/chart.ts            ← 排盘状态
│       │   └── views/                     ← 4页面
│       └── package.json
├── docs/
│   ├── SOURCES.md       # 第三方来源详细标注
│   ├── classics-ref/    # 经典古籍数据
│   └── 项目计划书.md
└── vercel.json          # Vercel 部署配置
```

## 开源协议

本项目基于 MIT 协议开源。

本项目中使用的第三方库：
- **iztro** — MIT © 2023 All Contributors
- **ziwei-doushu** — MIT © 2026 紫微研究
- **vue-ziwei** — MIT © 2025

详见 [docs/SOURCES.md](./docs/SOURCES.md)
