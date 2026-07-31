---
title: 文墨天机箭头体系
description: 自化小箭头 + 飞星大盘四化连线，完整渲染规范
---

# 文墨天机箭头体系

紫微斗数盘面箭头分两套独立体系，必须分开计算和渲染。

| 体系 | 名称 | 位置 | 含义 |
|------|------|------|------|
| 小箭头 | 自化标识 | 宫格四角 | 本宫宫干内生四化 |
| 长线箭头 | 飞星四化连线 | 跨宫连线 | A宫天干四化飞入B宫 |

## 一、自化小箭头

iztro 的 FunctionalPalace 已提供自化检测：`selfMutaged()`、`selfMutagedOneOf()`。

### 方向判断

- 本宫宫干催动本宫星曜 → 离心(朝外)
- 本宫宫干催动对宫星曜 → 向心(朝盘中心)

### 颜色

- 禄 → #4CAF50 绿 | 权 → #9C27B0 紫
- 科 → #2196F3 蓝 | 忌 → #F44336 红

## 二、飞星四化连线

三层叠加：
- 本命生年四化 → 黑色实线
- 大限四化 → 橙色实线  
- 流年四化 → 亮色虚线

字母模式切换：`禄权科忌` ↔ `ABCD`

## 三、设置项

```
showSelfArrows: boolean       // 自化小箭头
showFlyLines: boolean         // 飞星连线
showDecadeLines: boolean      // 大限飞线
showYearlyLines: boolean      // 流年飞线
arrowLabelMode: 'color'|'letter'
```
