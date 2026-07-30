# 第三方来源 (Third-Party Sources)

本项目直接搬运并整合了以下开源项目的源码，遵循 MIT 协议。

## 1. iztro (核心算法库)
- **仓库**: https://github.com/SylarLong/iztro
- **协议**: MIT — Copyright (c) 2023 All Contributors
- **搬运内容**: `src/iztro/` — 完整源码 (99个TS文件)
  - 排盘算法 (astro/): 命盘生成、宫位计算
  - 星曜算法 (star/): 主星、辅星、杂曜定位
  - 数据 (data/): 星曜亮度、地支信息、天干四化
  - 多语言 (i18n/): 中/英/日/韩/越

## 2. vue-ziwei (网页端参考)
- **仓库**: https://github.com/8haoNetwork/vue-ziwei
- **协议**: MIT — Copyright (c) 2025
- **搬运内容**: `src/vue-ziwei-ref/` — 前端组件源码
  - PalaceContent.vue — 宫位内星曜排版方式
  - ZiWeiChart.vue — 4×4方盘布局
  - i18n/ — 星曜/宫位/亮度多语言翻译

## 3. Renhuai123/ziwei-doushu (经典知识)
- **仓库**: https://github.com/Renhuai123/ziwei-doushu
- **协议**: MIT — Copyright (c) 2026 紫微研究
- **搬运内容**: `src/next-ref/` — 经典数据
  - 格局检测 patterns.ts (55KB, 60+格局)
  - 倪海厦体系 nihai/ (天纪/地纪/人纪)
  - 经典知识 classics/ (骨髓赋/全集/全书)
  - 常量验证 constants.ts

## 本项目的自定义算法
- `src/core/` — 自研TS算法 (历法/安星/四化/大限)
- 基于iztro验证数据修正亮度表、命主身主、天魁天钺
