# 第三方来源标注 (Third-Party Sources)

本项目整合了以下开源项目的代码和数据，均遵循 MIT 协议使用。

## 🔗 iztro (核心算法数据)

- **仓库**: https://github.com/SylarLong/iztro
- **协议**: MIT
- **许可证**: Copyright (c) 2023 All Contributors
- **使用内容**:
  - `src/core/stars-data/brightness.ts` — 星曜庙旺落陷亮度表 (`STARS_INFO`)
  - `src/core/palace/palace.ts` — 命主/身主表 (`earthlyBranches.soul`/`body`)
  - `src/core/palace/minor-stars.ts` — 天魁天钺表验证
  - `src/core/pattern/patterns-ref.ts` — 完整格局检测算法参考
  - `src/core/stars-data/constants-ref.ts` — 星曜常量数据参考
  - 完整源码备份: `src/iztro-ref/`

## 🔗 Renhuai123/ziwei-doushu (经典知识数据)

- **仓库**: https://github.com/Renhuai123/ziwei-doushu
- **协议**: MIT
- **许可证**: Copyright (c) 2026 紫微研究
- **使用内容**:
  - `docs/classics-ref/` — 紫微经典知识数据 (骨髓赋、全集、全书)
  - `src/core/pattern/patterns-ref.ts` — 格局检测数据
  - `src/core/stars-data/constants-ref.ts` — 常量验证参考

## 🔗 vue-ziwei (前端布局参考)

- **来源**: vue-ziwei-main.zip (MIT)
- **协议**: MIT
- **许可证**: Copyright (c) 2025
- **使用内容**:
  - `src/web-page/src/components/ZiweiPlate.vue` — 宫位排版方式参考

## 📦 项目数据流

```
iztro (MIT) ──→ brightness.ts (星曜亮度)
             ──→ palace.ts (命主/身主)
             ──→ patterns-ref.ts (格局算法参考)
             
Renhuai123/ ──→ classics-ref/ (经典知识)
ziwei-doushu ──→ constants-ref.ts (常量验证)
   (MIT)     ──→ patterns-ref.ts (格局数据)

vue-ziwei ──→ ZiweiPlate.vue (宫位排版布局)
  (MIT)
```

## ⚖️ 合规声明

以上所有第三方代码均已按照 MIT 协议要求使用，保留原始版权声明。
MIT 协议允许：自由使用、修改、分发、商用，需保留版权声明。
