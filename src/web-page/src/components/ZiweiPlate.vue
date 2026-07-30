<template>
  <div class="relative flex justify-center">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
         xmlns="http://www.w3.org/2000/svg"
         class="drop-shadow-lg">
      
      <!-- 定义 -->
      <!-- 云纹图案 -->
      <defs>
        <!-- 云纹图案 -->
        <pattern id="cloudPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M15,35 Q15,25 25,25 Q30,18 40,22 Q45,18 50,25 Q58,28 55,38 Q52,42 45,42 L20,42 Q12,42 15,35Z"
                fill="#d4c5a9" opacity="0.08" />
          <path d="M5,50 Q8,45 15,45 Q18,42 22,45 Q25,48 20,52 L8,52 Q3,52 5,50Z"
                fill="#d4c5a9" opacity="0.05" />
        </pattern>
        
        <!-- 十二地支动物纹样（低透明度） -->
        <g id="animal-zi"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">鼠</text></g>
        <g id="animal-chou"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">牛</text></g>
        <g id="animal-yin"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">虎</text></g>
        <g id="animal-mao"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">兔</text></g>
        <g id="animal-chen"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">龙</text></g>
        <g id="animal-si"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">蛇</text></g>
        <g id="animal-wu"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">马</text></g>
        <g id="animal-wei"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">羊</text></g>
        <g id="animal-shen"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">猴</text></g>
        <g id="animal-you"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">鸡</text></g>
        <g id="animal-xu"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">狗</text></g>
        <g id="animal-hai"><text font-size="28" fill="#d4c5a9" opacity="0.12" font-family="serif">猪</text></g>
      </defs>

      <!-- 外圈装饰 -->
      <circle :cx="cx" :cy="cy" :r="outerR" fill="none" stroke="#CC7722" stroke-width="3" />
      <circle :cx="cx" :cy="cy" :r="outerR - 5" fill="none" stroke="#D4A017" stroke-width="0.5" opacity="0.5" />
      <circle :cx="cx" :cy="cy" :r="outerR + 6" fill="none" stroke="#CC7722" stroke-width="1" opacity="0.3" />

      <!-- 云纹底纹 -->
      <circle :cx="cx" :cy="cy" :r="innerR + 10" fill="url(#cloudPattern)" />

      <!-- 十二宫扇形 -->
      <g v-for="(palace, idx) in palaces" :key="idx">
        <!-- 扇形背景 -->
        <path :d="getSectorPath(idx)" 
              :fill="palace.isMing ? 'rgba(212,160,23,0.08)' : palace.isShen ? 'rgba(47,79,79,0.06)' : 'transparent'"
              :stroke="palace.isMing ? '#D4A017' : '#c4b998'"
              stroke-width="0.8"
              @click="$emit('selectPalace', idx)"
              class="cursor-pointer hover:opacity-80 transition-opacity" />

        <!-- 生肖暗纹 -->
        <use :href="`#animal-${getAnimalId(palace.branch)}`"
             :x="getAnimalX(idx)" :y="getAnimalY(idx)"
             transform="translate(-14,-14)" opacity="0.12" />

        <!-- 宫名标签 -->
        <text :x="getLabelX(idx, 0.38)" :y="getLabelY(idx, 0.38)"
              text-anchor="middle" dominant-baseline="middle"
              :font-size="12" fill="#8B4513" font-weight="bold" font-family="Noto Serif SC, serif">
          {{ palace.name }}
        </text>

        <!-- 宫干支（小字） -->
        <text :x="getLabelX(idx, 0.44)" :y="getLabelY(idx, 0.44)"
              text-anchor="middle" dominant-baseline="middle"
              :font-size="9" fill="#a09080">
          {{ palace.stem }}{{ palace.branch }}
        </text>

        <!-- 主星 -->
        <text v-for="(starId, si) in palace.mainStars.slice(0,4)" :key="starId"
              :x="getStarX(idx, si, palace.mainStars.length)"
              :y="getStarY(idx, si, palace.mainStars.length)"
              text-anchor="middle" dominant-baseline="middle"
              :font-size="12" :font-weight="700" fill="#1a1a2e"
              font-family="Noto Serif SC, serif"
              class="cursor-pointer hover:text-zhuque"
              @click.stop="$emit('selectStar', starId)">
          {{ getStarName(starId) }}
        </text>

        <!-- 四化标记 -->
        <text v-for="(hua, hi) in palace.hua" :key="hi"
              :x="getHuaX(idx, hi)" :y="getHuaY(idx)"
              text-anchor="middle" dominant-baseline="middle"
              :font-size="8" :font-weight="bold"
              :fill="huaColor(hua)"
              font-family="Noto Serif SC, serif">
          {{ hua }}
        </text>

        <!-- 辅星（小字，只显示前2） -->
        <text v-if="palace.minorStars.length > 0"
              :x="getMinorLabelX(idx, 0)" :y="getMinorLabelY(idx)"
              text-anchor="middle" dominant-baseline="middle"
              :font-size="7" fill="#7f8c8d">
          {{ palace.minorStars.slice(0,2).map(getStarName).join('') }}
        </text>
      </g>

      <!-- 中心圆 -->
      <circle :cx="cx" :cy="cy" :r="innerR * 0.18" fill="#F5F0E1" stroke="#CC7722" stroke-width="1" />
      <text :x="cx" :y="cy - 5" text-anchor="middle" font-size="10" fill="#8B4513" font-family="Noto Serif SC, serif">紫微</text>
      <text :x="cx" :y="cy + 10" text-anchor="middle" font-size="10" fill="#8B4513" font-family="Noto Serif SC, serif">斗数</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PalaceInfo, HuaType } from '../../../core/types'
import { STAR_NAMES } from '../../../core/stars-data/star-names'

const props = defineProps<{
  palaces: PalaceInfo[]
  size?: number
}>()

defineEmits<{
  selectPalace: [idx: number]
  selectStar: [starId: string]
}>()

const cx = computed(() => props.size ? props.size / 2 : 300)
const cy = computed(() => props.size ? props.size / 2 : 300)
const outerR = computed(() => props.size ? props.size * 0.45 : 270)
const innerR = computed(() => props.size ? props.size * 0.4 : 240)

/** 获取扇形的SVG路径 */
function getSectorPath(idx: number): string {
  const startAngle = (idx * 30 - 90) * Math.PI / 180
  const endAngle = ((idx + 1) * 30 - 90) * Math.PI / 180
  
  const x1 = cx.value + innerR.value * Math.cos(startAngle)
  const y1 = cy.value + innerR.value * Math.sin(startAngle)
  const x2 = cx.value + innerR.value * Math.cos(endAngle)
  const y2 = cy.value + innerR.value * Math.sin(endAngle)
  
  return `M${cx.value},${cy.value} L${x1},${y1} A${innerR.value},${innerR.value} 0 0,1 ${x2},${y2} Z`
}

/** 获取半径比例上的坐标 */
function getCoord(idx: number, ratio: number): { x: number; y: number } {
  const midAngle = ((idx + 0.5) * 30 - 90) * Math.PI / 180
  const r = innerR.value * ratio
  return {
    x: cx.value + r * Math.cos(midAngle),
    y: cy.value + r * Math.sin(midAngle)
  }
}

function getLabelX(idx: number, ratio: number): number { return getCoord(idx, ratio).x }
function getLabelY(idx: number, ratio: number): number { return getCoord(idx, ratio).y }

/** 生肖ID映射 */
const BRANCH_ANIMALS: Record<string, string> = {
  '子': 'zi', '丑': 'chou', '寅': 'yin', '卯': 'mao',
  '辰': 'chen', '巳': 'si', '午': 'wu', '未': 'wei',
  '申': 'shen', '酉': 'you', '戌': 'xu', '亥': 'hai',
}
function getAnimalId(branch: string): string {
  return BRANCH_ANIMALS[branch] || 'zi'
}
function getAnimalX(idx: number): number {
  return getCoord(idx, 0.55).x
}
function getAnimalY(idx: number): number {
  return getCoord(idx, 0.55).y
}

/** 主星排列（同一宫内的多颗星均匀分布） */
function getStarX(idx: number, starIdx: number, total: number): number {
  const angleStep = 0.03
  const offset = (starIdx - (total - 1) / 2) * angleStep
  const midAngle = ((idx + 0.5) * 30 - 90) * Math.PI / 180 + offset
  const r = innerR.value * 0.65
  return cx.value + r * Math.cos(midAngle)
}

function getStarY(idx: number, starIdx: number, total: number): number {
  const angleStep = 0.03
  const offset = (starIdx - (total - 1) / 2) * angleStep
  const midAngle = ((idx + 0.5) * 30 - 90) * Math.PI / 180 + offset
  const r = innerR.value * 0.65
  return cy.value + r * Math.sin(midAngle)
}

/** 四化位置 */
function getHuaX(idx: number, hi: number): number {
  const c = getCoord(idx, 0.32)
  return c.x + (hi - 1.5) * 12
}
function getHuaY(idx: number): number {
  return getCoord(idx, 0.32).y
}

/** 辅星位置 */
function getMinorLabelX(idx: number, mi: number): number {
  return getCoord(idx, 0.52).x
}
function getMinorLabelY(idx: number): number {
  return getCoord(idx, 0.52).y
}

/** 星曜名称 */
function getStarName(id: string): string {
  return STAR_NAMES[id]?.nameCn || id
}

/** 四化颜色 */
function huaColor(type: HuaType): string {
  const map: Record<HuaType, string> = {
    '禄': '#e74c3c',
    '权': '#8e44ad',
    '科': '#2980b9',
    '忌': '#1a1a2e',
  }
  return map[type]
}
</script>
