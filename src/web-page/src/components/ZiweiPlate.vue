<template>
  <div class="square-plate" :style="{ width: size + 'px' }">
    <div v-for="(cell, idx) in grid" :key="idx"
         class="plate-cell"
         :class="{ 'cell-center': cell.isCenter, 'cell-ming': cell.palace?.isMing, 'cell-shen': cell.palace?.isShen }"
         :style="{ 
           gridRow: cell.rowSpan ? `${cell.row + 1} / span ${cell.rowSpan}` : cell.row + 1,
           gridColumn: cell.colSpan ? `${cell.col + 1} / span ${cell.colSpan}` : cell.col + 1
         }"
         @click="cell.palace && $emit('selectPalace', cell.palace.palaceIndex)">

      <!-- 中宫：四柱/五行局/命主身主 -->
      <template v-if="cell.isCenter">
        <div class="center-grid">
          <div class="center-item" v-for="item in centerInfo" :key="item.l">
            <span class="center-label">{{ item.l }}</span>
            <span class="center-value">{{ item.v }}</span>
          </div>
        </div>
      </template>

      <!-- 宫位格 -->
      <template v-else-if="cell.palace">
        <!-- 宫头：宫名（左）+ 干支（右） -->
        <div class="cell-head">
          <span class="cell-palace-name">{{ cell.palace.name }}</span>
          <span class="cell-ganzhi">{{ cell.palace.stem }}{{ cell.palace.branch }}</span>
        </div>

        <!-- 主星（带四化紧跟） -->
        <div class="cell-stars">
          <div v-for="starId in cell.palace.mainStars" :key="'m'+starId" class="star-line">
            <span class="star-main" :class="brightClass(starId, cell.palace.branchIndex)"
                  @click.stop="$emit('selectStar', starId)">
              {{ getStarName(starId) }}
            </span>
            <span v-if="getHua(starId)" class="star-hua" :class="'h-' + getHua(starId)">【{{ getHua(starId) }}】</span>
          </div>
          <div v-if="cell.palace.mainStars.length === 0" class="star-empty" style="padding-top:4px;">空</div>
        </div>

        <!-- 辅煞星（小字紧凑） -->
        <div class="cell-aux" v-if="auxList(cell.palace).length">
          <span v-for="a in auxList(cell.palace)" :key="a.id" :class="'aux-' + a.typ">{{ a.nm }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PalaceInfo, HuaType } from '../../../core/types'
import { STAR_NAMES } from '../../../core/stars-data/star-names'
import { getStarBrightness } from '../../../core/stars-data/brightness'
import type { BrightnessLevel } from '../../../core/stars-data/brightness'

interface CenterItem { l: string; v: string }

const props = defineProps<{
  palaces: PalaceInfo[]
  size?: number
  fourPillars?: { year: string; month: string; day: string; hour: string }
  elementPhase?: string
  mingMaster?: string
  shenMaster?: string
  mingPalaceBranch?: number
  huaMap?: Record<string, HuaType>
}>()

defineEmits<{ selectPalace: [idx: number]; selectStar: [starId: string] }>()

const BRANCH_GRID: Record<number, [number, number]> = {
  1:[3,2], 2:[3,1], 3:[3,0], 4:[2,0], 5:[1,0], 6:[0,0],
  7:[0,1], 8:[0,2], 9:[0,3], 10:[1,3], 11:[2,3], 12:[3,3]
}
const CENTER = [[1,1],[1,2],[2,1],[2,2]] // 仍然用于判断

interface Cell { row: number; col: number; rowSpan?: number; colSpan?: number; palace: PalaceInfo | null; isCenter: boolean }

const grid = computed<Cell[]>(() => {
  const byBr: Record<number, PalaceInfo> = {}
  props.palaces.forEach(p => { byBr[p.branchIndex] = p })
  const cells: Cell[] = []
  // 先放中宫（单跨4格）
  cells.push({ row: 1, col: 1, rowSpan: 2, colSpan: 2, palace: null, isCenter: true })
  // 再放外围12宫
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (CENTER.some(cc => cc[0] === r && cc[1] === c)) continue
      let bi = -1
      for (const [k, v] of Object.entries(BRANCH_GRID)) {
        if (v[0] === r && v[1] === c) { bi = parseInt(k); break }
      }
      cells.push({ row: r, col: c, palace: bi > 0 ? byBr[bi] ?? null : null, isCenter: false })
    }
  }
  return cells
})

const centerInfo = computed<CenterItem[]>(() => {
  const a: CenterItem[] = []
  if (props.fourPillars) a.push({ l: '四柱', v: `${props.fourPillars.year} ${props.fourPillars.month} ${props.fourPillars.day} ${props.fourPillars.hour}` })
  if (props.elementPhase) a.push({ l: '五行局', v: props.elementPhase })
  if (props.mingMaster) a.push({ l: '命主', v: props.mingMaster })
  if (props.shenMaster) a.push({ l: '身主', v: props.shenMaster })
  return a
})

function getStarName(id: string): string { return STAR_NAMES[id]?.nameCn || id }

function getHua(starId: string): string {
  return props.huaMap?.[starId] || ''
}

function brightClass(starId: string, bi: number): string {
  const b = getStarBrightness(starId, bi)
  if (!b) return ''
  const m: Record<string, string> = { '庙':'b-m','旺':'b-w','得地':'b-d' }
  return m[b] || ''
}

interface AuxItem { id: string; nm: string; typ: 'n'|'s' }
function auxList(p: PalaceInfo): AuxItem[] {
  const r: AuxItem[] = []
  p.minorStars.forEach(id => r.push({ id, nm: getStarName(id), typ: 'n' }))
  p.shaStars.forEach(id => r.push({ id, nm: getStarName(id), typ: 's' }))
  return r
}
</script>

<style scoped>
.square-plate {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 2px;
  background: #b8956a;
  border: 3px solid #b8956a;
  padding: 2px;
  max-width: 100%;
}

.plate-cell {
  background: #fcf8f0;
  border: 1px solid #d4c5a9;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 4px 5px;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
.plate-cell:hover { background: #f8f0e0; }
.cell-ming { background: #fef6e0 !important; border: 2px solid #d4a017 !important; }
.cell-shen { border: 2px solid #8aaa7a !important; }
.cell-center {
  background: #efe4d0 !important;
  border: none !important;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 中宫 */
.center-grid { display: flex; flex-direction: column; gap: 4px; padding: 4px; }
.center-item { display: flex; flex-direction: column; align-items: center; gap: 0; }
.center-label { font-size: 8px; color: #a09080; letter-spacing: 1px; }
.center-value { font-size: 11px; color: #5a3e2b; font-weight: bold; }

/* 宫头 */
.cell-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 2px;
  border-bottom: 1px solid #e8e0d0;
  margin-bottom: 2px;
  flex-shrink: 0;
}
.cell-palace-name { font-size: 12px; font-weight: bold; color: #6b4226; }
.cell-ganzhi { font-size: 9px; color: #a09080; }

/* 主星区 */
.cell-stars {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  min-height: 0;
  padding: 2px 0;
}
.star-line {
  display: flex;
  align-items: center;
  gap: 1px;
  line-height: 1.25;
}
.star-main {
  font-size: 13px; font-weight: 700; color: #1a1a2e;
  white-space: nowrap;
  cursor: pointer;
}
.star-main:hover { color: #cc7722; }
.star-empty { text-align: center; font-size: 10px; color: #ccc; }

/* 亮度颜色 */
.b-m { color: #c0392b !important; }
.b-w { color: #d4871a !important; }
.b-d { color: #b8860b !important; }

/* 四化 */
.star-hua {
  font-size: 8px; font-weight: bold;
  line-height: 1; margin-left: 1px;
}
.h-禄 { color: #cc0000; }
.h-权 { color: #7b2d8e; }
.h-科 { color: #1a6db5; }
.h-忌 { color: #1a1a2e; }

/* 辅煞星 */
.cell-aux {
  display: flex;
  flex-wrap: wrap;
  gap: 1px 3px;
  padding-top: 1px;
  border-top: 1px solid #ece4d4;
  flex-shrink: 0;
  line-height: 1.2;
}
.aux-n { font-size: 8px; color: #666; }
.aux-s { font-size: 8px; color: #887a6a; }
</style>
