# 第三方来源标注 (Third-Party Sources)

本项目直接搬运、引用、整合了以下开源项目的代码和数据，均遵循 MIT 协议使用。

---

## 1. iztro (核心算法引擎)

| 项目 | 说明 |
|------|------|
| **仓库** | https://github.com/SylarLong/iztro |
| **协议** | MIT — Copyright (c) 2023 All Contributors |
| **npm包** | `iztro` (v2.5.8) |
| **使用方式** | 作为 npm 依赖安装，运行时动态 `import('iztro')` 调用 `astro.bySolar()` 排盘 |

### 使用内容

| 功能 | iztro 模块 | 本项目中位置 |
|------|-----------|------------|
| 紫微斗数排盘 | `astro.bySolar()` | `stores/chart.ts` — generateChart() |
| 星曜亮度 | `STARS_INFO` → `brightness` | brightness.ts 数据替换验证 |
| 命主/身主 | `earthlyBranches.soul/body` | palace.ts — calcMingMaster/calcShenMaster |
| 天干四化 | `heavenlyStems.mutagen` | 验证对齐 |
| 完整源码参考 | `src/` (99TS文件) | `src/iztro/` — 备查 |

---

## 2. ziwei-doushu (经典知识数据)

| 项目 | 说明 |
|------|------|
| **仓库** | https://github.com/Renhuai123/ziwei-doushu |
| **协议** | MIT — Copyright (c) 2026 紫微研究 |
| **使用方式** | 搬运 `lib/` 目录全部23文件至 `src/ziwei-doushu/` |

### 使用内容

| 文件 | 说明 |
|------|------|
| `lib/ziwei/patterns.ts` | 55KB 格局检测 (60+格局) |
| `lib/ziwei/heming-knowledge.ts` | 夫妻宫合盘知识 (329行) |
| `lib/ziwei/db-analysis.ts` | 命理分析结构框架 |
| `lib/ziwei/constants.ts` | 验证后的天魁天钺/禄存等常量 |
| `lib/classics/data/gusuifu.ts` | 《骨髓赋》经典原文 |
| `lib/classics/data/quanji.ts` | 《紫微斗数全集》 |
| `lib/classics/data/quanshu.ts` | 《紫微斗数全书》 |
| `lib/nihai/` | 倪海厦天纪/地纪/人纪体系 (5文件) |
| `lib/seo/knowledge.ts` | SEO 知识页面框架 |

---

## 3. vue-ziwei (前端布局参考)

| 项目 | 说明 |
|------|------|
| **仓库** | https://github.com/8haoNetwork/vue-ziwei |
| **协议** | MIT — Copyright (c) 2025 |
| **使用方式** | 参考 PalaceContent.vue 的宫位内排版方式 |

### 参考内容

| 组件 | 说明 |
|------|------|
| `PalaceContent.vue` | 宫位内星曜竖排+四化标注排版方式 |
| `ZiWeiChart.vue` | 4×4方盘布局结构 |
| 完整源码 | `src/vue-ziwei-ref/` — 备查 |

---

## 数据流向

```
iztro (npm, MIT)
├── astro.bySolar() ──→ 排盘引擎
├── STARS_INFO ──────→ brightness.ts (亮度表)
├── earthlyBranches ──→ palace.ts (命主/身主)
└── heavenlyStems ────→ 四化表验证

ziwei-doushu (MIT)
├── patterns.ts ──────→ 格局检测
├── heming-knowledge ──→ 宫位分析
├── classics/ ────────→ 古籍原文
└── nihai/ ───────────→ 倪海厦体系

vue-ziwei (MIT)
└── PalaceContent.vue ─→ 方盘宫位排版风格
```

## 合规声明

以上所有第三方代码均按照 MIT 协议要求使用，保留原始版权声明。
MIT 协议允许：自由使用、修改、分发、商用，需保留版权声明。

本项目自研部分 (`src/core/`) 的算法代码独立编写，使用 iztro 数据验证校正。
