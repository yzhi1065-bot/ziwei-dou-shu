<!-- 
  紫微斗数方盘组件
  布局参考: 8haoNetwork/vue-ziwei (MIT) — PalaceContent.vue 宫位排版
  数据来源: SylarLong/iztro (MIT) — 亮度/地支/四化数据
-->
<template>
  <div class="zw-plate" :style="{ width: size + 'px' }">
    <div v-for="(cell, idx) in grid" :key="idx"
         class="zw-cell"
         :class="{
           'zw-cell-ming': cell.palace?.isMing,
           'zw-cell-shen': cell.palace?.isShen,
           'zw-cell-center': cell.isCenter
         }"
         :style="{ gridRow: cssRow(cell), gridColumn: cssCol(cell) }"
         @click="cell.palace && $emit('selectPalace', cell.palace.palaceIndex)">

      <!-- 中宫 -->
      <template v-if="cell.isCenter">
        <div class="zw-center">
          <div class="zc-row" v-for="item in centerInfo" :key="item.l">
            <span class="zc-lb">{{ item.l }}</span>
            <span class="zc-val">{{ item.v }}</span>
          </div>
        </div>
      </template>

      <!-- 宫位格 -->
      <template v-else-if="cell.palace">
        <!-- 身宫竖标 -->
        <div v-if="cell.palace.isShen" class="zs-tag">身</div>

        <!-- 星曜区 -->
        <div class="zs-stars">
          <!-- 主星(每颗一行,竖排) + 四化 -->
          <div v-for="starId in cell.palace.mainStars" :key="'M'+starId" class="zs-star-row">
            <span class="zs-main" :class="bClass(starId, cell.palace.branchIndex)"
                  @click.stop="$emit('selectStar', starId)">
              {{ getStarName(starId) }}
            </span>
            <span class="zs-bright" v-if="getBrightnessLabel(starId, cell.palace.branchIndex)">
              {{ getBrightnessLabel(starId, cell.palace.branchIndex) }}
            </span>
            <span v-if="getHua(starId)" class="zs-hua" :class="'h-' + getHua(starId)">{{ getHua(starId) }}</span>
          </div>
          <div v-if="cell.palace.mainStars.length === 0" class="zs-empty">空宫</div>
        </div>

        <!-- 辅煞星 -->
        <div class="zs-aux" v-if="auxStars(cell.palace).length">
          <span v-for="a in auxStars(cell.palace)" :key="a.id"
                :class="a.typ === 's' ? 'zs-sha' : 'zs-minor'">{{ a.nm }}</span>
        </div>

        <!-- 底部: 宫名 + 干支 -->
        <div class="zs-foot">
          <span class="zs-name">{{ cell.palace.name }}</span>
          <span class="zs-gz">{{ cell.palace.stem }}{{ cell.palace.branch }}</span>
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

interface CI { l: string; v: string }

const props = defineProps<{
  palaces: PalaceInfo[]; size?: number
  fourPillars?: Record<string,string>; elementPhase?: string
  mingMaster?: string; shenMaster?: string; huaMap?: Record<string, HuaType>
}>()

defineEmits<{ selectPalace: [idx: number]; selectStar: [starId: string] }>()

// 地支→4×4网格坐标 (巳午未申 上排)
const BG: Record<number,[number,number]> = {
  6:[0,0],7:[0,1],8:[0,2],9:[0,3],5:[1,0],10:[1,3],
  4:[2,0],11:[2,3],3:[3,0],2:[3,1],1:[3,2],12:[3,3]
}

interface GC { row:number; col:number; rs?:number; cs?:number; palace:PalaceInfo|null; isCenter:boolean }

const grid = computed<GC[]>(() => {
  const bm: Record<number,PalaceInfo> = {}
  props.palaces.forEach(p => { bm[p.branchIndex] = p })
  const cells: GC[] = []
  cells.push({ row:1, col:1, rs:2, cs:2, palace:null, isCenter:true })
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) {
    if ((r===1||r===2)&&(c===1||c===2)) continue
    let bi=-1; for (const [k,v] of Object.entries(BG)) { if (v[0]===r&&v[1]===c) { bi=parseInt(k); break } }
    cells.push({ row:r, col:c, palace:bi>0?bm[bi]??null:null, isCenter:false })
  }
  return cells
})

const centerInfo = computed<CI[]>(() => {
  const a: CI[] = []
  if (props.fourPillars) a.push({ l:'四柱', v:`${props.fourPillars.year} ${props.fourPillars.month} ${props.fourPillars.day} ${props.fourPillars.hour}` })
  if (props.elementPhase) a.push({ l:'五行局', v:props.elementPhase })
  if (props.mingMaster) a.push({ l:'命主', v:props.mingMaster })
  if (props.shenMaster) a.push({ l:'身主', v:props.shenMaster })
  return a
})

function cssRow(c: GC): string { return c.rs ? `${c.row+1}/span ${c.rs}` : `${c.row+1}` }
function cssCol(c: GC): string { return c.cs ? `${c.col+1}/span ${c.cs}` : `${c.col+1}` }

function getStarName(id:string): string { return STAR_NAMES[id]?.nameCn || id }
function getHua(id:string): string { return props.huaMap?.[id] || '' }

function bClass(id:string, bi:number): string {
  const b = getStarBrightness(id, bi)
  if (!b) return ''
  const m: Record<string,string> = { '庙':'bm','旺':'bw','得地':'bd' }
  return m[b] || ''
}

function getBrightnessLabel(id:string, bi:number): string {
  const b = getStarBrightness(id, bi)
  if (!b) return ''
  return b
}

interface AI { id:string; nm:string; typ:'n'|'s' }
function auxStars(p: PalaceInfo): AI[] {
  const r: AI[] = []
  p.minorStars.forEach(id => r.push({ id, nm: getStarName(id), typ:'n' }))
  p.shaStars.forEach(id => r.push({ id, nm: `[${getStarName(id)}]`, typ:'s' }))
  return r
}
</script>

<style scoped>
.zw-plate {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-template-rows: repeat(4,1fr);
  gap: 2px;
  background: #b8956a;
  border: 3px solid #b8956a;
  padding: 2px;
  max-width: 100%;
}
.zw-cell {
  background: #fcf8f0;
  border: 1px solid #d4c5a9;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 3px 4px;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
.zw-cell:hover { background: #f8f0e0; }
.zw-cell-ming { background: #fef6e0 !important; border: 2px solid #d4a017 !important; }
.zw-cell-shen { border: 2px solid #8aaa7a !important; }
.zw-cell-center { background: #efe4d0 !important; border: none !important; cursor: default; display: flex; align-items: center; justify-content: center; }

/* 身宫竖标 */
.zs-tag {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  writing-mode: vertical-rl; font-size: 8px; color: #6b8e8e; font-weight: bold;
  letter-spacing: 1px; padding: 2px;
}

/* 中宫 */
.zw-center { display: flex; flex-direction: column; gap: 3px; padding: 2px; }
.zc-row { display: flex; flex-direction: column; align-items: center; }
.zc-lb { font-size: 7px; color: #a09080; }
.zc-val { font-size: 10px; color: #5a3e2b; font-weight: bold; }

/* 星曜区 - 主星纵排 */
.zs-stars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 1px; padding: 8px 0 2px; }
.zs-star-row { display: flex; align-items: center; gap: 1px; line-height: 1.3; }
.zs-main { font-size: 13px; font-weight: 700; color: #1a1a2e; white-space: nowrap; cursor: pointer; }
.zs-main:hover { color: #cc7722; }
.zs-bright { font-size: 7px; color: #999; margin-left: 1px; }
.zs-empty { text-align: center; font-size: 10px; color: #ccc; }
.bm { color: #c0392b !important; }
.bw { color: #d4871a !important; }
.bd { color: #b8860b !important; }

/* 四化 */
.zs-hua { font-size: 7px; font-weight: bold; padding: 0 1px; border-radius: 1px; }
.h-禄 { color: #cc0000; }
.h-权 { color: #7b2d8e; }
.h-科 { color: #1a6db5; }
.h-忌 { color: #1a1a2e; }

/* 辅煞星 */
.zs-aux { display: flex; flex-wrap: wrap; gap: 1px 2px; padding: 1px 0; flex-shrink: 0; line-height: 1.2; }
.zs-minor { font-size: 8px; color: #666; }
.zs-sha { font-size: 8px; color: #887a6a; }

/* 底部宫名干支 */
.zs-foot { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #e8e0d0; padding-top: 1px; flex-shrink: 0; }
.zs-name { font-size: 10px; font-weight: bold; color: #6b4226; }
.zs-gz { font-size: 8px; color: #a09080; }
</style>
