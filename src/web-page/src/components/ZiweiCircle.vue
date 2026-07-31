<!-- 传统圆盘SVG模式（方盘/圆盘可切换） -->
<template>
  <div class="zw-circle" :style="{ width: size+'px', height: size+'px' }">
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <!-- 外圈 -->
      <circle cx="50" cy="50" r="48" fill="#fcf8f0" stroke="#8B6F47" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#8B6F47" stroke-width="0.3"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#8B6F47" stroke-width="0.3"/>
      <circle cx="50" cy="50" r="18" fill="#f5efe4" stroke="#8B6F47" stroke-width="0.5"/>
      <!-- 十二宫扇形 -->
      <g v-for="i in 12" :key="i">
        <path :d="sectorPath(i-1)" :fill="i%2 ? '#fcf8f0' : '#f7f1e5'" stroke="#8B6F47" stroke-width="0.2"/>
        <!-- 宫名（外圈） -->
        <text :x="labelPos(i-1, 45).x" :y="labelPos(i-1, 45).y" font-size="4.5" text-anchor="middle" fill="#2F4F4F">{{ palaceName(i-1) }}</text>
        <!-- 干支 -->
        <text :x="labelPos(i-1, 38).x" :y="labelPos(i-1, 38).y" font-size="3" text-anchor="middle" fill="#8B6F47">{{ stemBranch(i-1) }}</text>
        <!-- 主星 -->
        <text v-for="(s,si) in majorAt(i-1)" :key="si"
          :x="labelPos(i-1, 28-si*3).x" :y="labelPos(i-1, 28-si*3).y"
          font-size="3.8" text-anchor="middle" :fill="si===0 ? '#B22222' : '#2F4F4F'">{{ s }}</text>
      </g>
      <!-- 中宫 -->
      <text x="50" y="47" font-size="4" text-anchor="middle" fill="#2F4F4F">{{ centerInfo[0] }}</text>
      <text x="50" y="53" font-size="4" text-anchor="middle" fill="#2F4F4F">{{ centerInfo[1] }}</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  palaces: any[]
  size?: number
  ep?: string
  mm?: string
  sm?: string
  gender?: string
}>()

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
// 地支在圆盘上的位置（子=正下，逆时针）
const EB_ORDER = ['子','亥','戌','酉','申','未','午','巳','辰','卯','寅','丑']

// 宫位按地支定位
const sortedPalaces = computed(() => {
  const map = new Map<string, any>()
  props.palaces.forEach((p: any) => map.set(p.branch, p))
  return EB_ORDER.map(eb => map.get(eb)).filter(Boolean)
})

// 扇形路径：从角度a0到a1（子在下方-90°）
function sectorPath(idx: number): string {
  const a0 = (-90 + idx * 30) * Math.PI / 180
  const a1 = (-90 + (idx + 1) * 30) * Math.PI / 180
  const r1 = 30, r2 = 48
  const x0 = 50 + r2 * Math.cos(a0), y0 = 50 + r2 * Math.sin(a0)
  const x1 = 50 + r2 * Math.cos(a1), y1 = 50 + r2 * Math.sin(a1)
  const x2 = 50 + r1 * Math.cos(a1), y2 = 50 + r1 * Math.sin(a1)
  const x3 = 50 + r1 * Math.cos(a0), y3 = 50 + r1 * Math.sin(a0)
  return `M${x0},${y0} A${r2},${r2} 0 0 1 ${x1},${y1} L${x2},${y2} A${r1},${r1} 0 0 0 ${x3},${y3} Z`
}

function labelPos(idx: number, r: number) {
  const a = (-90 + (idx + 0.5) * 30) * Math.PI / 180
  return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) }
}

function palaceName(idx: number): string {
  const p = sortedPalaces.value[idx]
  return p ? p.name.replace('宫', '') : ''
}

function stemBranch(idx: number): string {
  const p = sortedPalaces.value[idx]
  return p ? `${p.stem}${p.branch}` : ''
}

function majorAt(idx: number): string[] {
  const p = sortedPalaces.value[idx]
  return p ? p.mainStars.slice(0, 4).map((s: any) => s.name) : []
}

const centerInfo = computed(() => [
  props.ep ? `局：${props.ep}` : '',
  `命：${props.mm || ''} 身：${props.sm || ''}`,
])
</script>

<style scoped>
.zw-circle { margin: 0 auto; }
</style>
