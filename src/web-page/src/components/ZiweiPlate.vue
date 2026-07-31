<!-- 全功能方盘 v3：细长箭头，外框=向外，内框(靠盘心)=向内 -->
<template>
  <div class="zw-wrap" :style="{ width: (size+20)+'px' }">
    <div class="zw-box" :style="{ width: size+'px', height: size+'px' }">
      <!-- 顶层SVG：跨宫飞线 -->
      <svg class="zw-svg" :width="size" :height="size" v-if="showFly">
        <defs>
          <!-- marker ID加uid前缀，避免多实例冲突 -->
          <marker v-for="t in ['禄','权','科','忌']" :key="t" :id="uid+'-ah-'+t" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6Z" :fill="saColor[t]" />
          </marker>
        </defs>
        <path v-for="(l,i) in svgFlyPaths" :key="i" :d="l.d" fill="none"
          :stroke="l.color" :stroke-width="l.w" :stroke-dasharray="l.dash" :opacity="l.op"
          :marker-end="'url(#'+uid+'-ah-'+l.type+')'" />
      </svg>

      <div v-for="c in cells" :key="c.k" class="zw-c" :class="{ 'zw-m':c.m, 'zw-s':c.s, 'zw-cc':c.c }"
        :style="{ gridRow: c.r, gridColumn: c.c2 }" @click="c.p && emit('sel', c.p.branchIndex)">

        <!-- 中宫 -->
        <template v-if="c.c">
          <div class="zcc"><span class="zcl">四柱</span><b class="zcv">{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></div>
          <div class="zcc"><span class="zcl">阳</span><b class="zcv">{{ solarDate }}</b></div>
          <div class="zcc"><span class="zcl">局</span><b class="zcv">{{ ep }}</b><span class="zcl" style="margin-left:2px">性</span><b class="zcv">{{ gender }}</b></div>
          <div class="zcc"><span class="zcl">命</span><b class="zcv">{{ mm }}</b><span class="zcl" style="margin-left:2px">身</span><b class="zcv">{{ sm }}</b></div>
        </template>

        <!-- 宫位 -->
        <template v-else-if="c.p">
          <div v-if="c.s" class="zt">身</div>

          <!-- 自化箭头：细长箭杆+箭头尖（→形状） -->
          <template v-if="showSelf">
            <!-- 向外箭头：贴宫格外框边，尖端朝外 -->
            <div v-if="c.outArrows.length" class="sa-row" :class="'sa-row-'+c.outerDir">
              <span v-for="a in c.outArrows" :key="'o'+a.type" class="sa" :class="['sa-dir-'+c.outerDir, a.layer==='限'?'sa-hollow':a.layer==='流'?'sa-glow':'']"
                :style="{ color: saColor[a.type] }">
                <i class="sa-stem" :style="{ background: saColor[a.type] }"></i>
                <i class="sa-head" :style="{ borderLeftColor: saColor[a.type] }"></i>
                <b v-if="mode==='letter'" class="sa-l">{{ LETTER[a.type] }}</b>
              </span>
            </div>
            <!-- 向内箭头：贴宫格内框边（靠盘心），尖端朝盘心 -->
            <div v-if="c.inArrows.length" class="sa-row" :class="'sa-row-in-'+c.innerDir">
              <span v-for="a in c.inArrows" :key="'i'+a.type" class="sa" :class="['sa-dir-'+c.innerDir, a.layer==='限'?'sa-hollow':a.layer==='流'?'sa-glow':'']"
                :style="{ color: saColor[a.type] }">
                <i class="sa-stem" :style="{ background: saColor[a.type] }"></i>
                <i class="sa-head" :style="{ borderLeftColor: saColor[a.type] }"></i>
                <b v-if="mode==='letter'" class="sa-l">{{ LETTER[a.type] }}</b>
              </span>
            </div>
          </template>

          <!-- 宫头 -->
          <div class="zh"><span class="zn">{{ c.p.name }}</span><span class="zg">{{ c.p.stem }}{{ c.p.branch }}</span></div>
          <!-- 主星+四化 -->
          <div class="zs">
            <div v-for="s in c.p.mainStars" :key="s.name" class="zr">
              <span class="zm" :class="bc(s)">{{ s.name }}</span>
              <span v-if="s.brightness" class="zb">{{ s.brightness }}</span>
              <span v-if="s.mutagen" class="zhua" :class="'h-'+s.mutagen">{{ s.mutagen }}</span>
            </div>
            <div v-if="!c.p.mainStars?.length" class="ze">空</div>
          </div>
          <!-- 辅星 -->
          <div class="za" v-if="(c.p.minorStars||[]).length">
            <span v-for="s in c.p.minorStars||[]" :key="s.name" class="zax">{{ s.name }}<small v-if="s.mutagen" :class="'h-'+s.mutagen">{{ s.mutagen }}</small></span>
          </div>
          <!-- 神煞+大限 -->
          <div class="zp" v-if="c.p.changsheng12||c.p.decadal">
            <small>{{ c.p.changsheng12 }}</small>
            <small v-if="c.p.decadal" class="zdl">{{ c.p.decadal.range[0] }}-{{ c.p.decadal.range[1] }}岁</small>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 实例唯一ID（SVG marker避免多实例冲突）
let uidCounter = 0
const uid = `zw${++uidCounter}${Math.random().toString(36).slice(2, 7)}`
const props = defineProps<{
  palaces:any[]; size?:number; fp?:any; solarDate?:string; timeRange?:string
  ep?:string; mm?:string; sm?:string; gender?:string
  selfArrows?:any[]; decadeSelfArrows?:any[]; yearlySelfArrows?:any[]
  flyLines?:any[]; decadeFly?:any[]; yearlyFly?:any[]
  showSelf?:boolean; showFly?:boolean; showSelfDecade?:boolean; showSelfYearly?:boolean
  showDecade?:boolean; showYearly?:boolean
  mode?:string; density?:string
}>()
const emit = defineEmits(['sel'])

// 文墨标准配色
const saColor: Record<string,string> = { '禄':'#27AE60', '权':'#8E44AD', '科':'#3498DB', '忌':'#E74C3C' }
const LETTER: Record<string,string> = { '禄':'A', '权':'B', '科':'C', '忌':'D' }
const FLY_STYLE: Record<string,any> = {
  '命': { w:2, dash:'', op:0.65, glow:false },
  '限': { w:1.5, dash:'6,3', op:0.6, glow:false },
  '流': { w:1, dash:'', op:0.7, glow:true },
}

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const EG:Record<string,[number,number]> = {
  '巳':[1,1],'午':[1,2],'未':[1,3],'申':[1,4],'辰':[2,1],'酉':[2,4],
  '卯':[3,1],'戌':[3,4],'寅':[4,1],'丑':[4,2],'子':[4,3],'亥':[4,4],
}
const EI:Record<string,number> = Object.fromEntries(EB.map((k,i)=>[k,i]))

// 每宫格的内/外方向（外=远离盘心，内=朝盘心）
function getDirs(row:number, col:number): { outer:string; inner:string } {
  // 第一行：上外下内；第四行：下外上内
  if (row === 1) return { outer:'up', inner:'down' }
  if (row === 4) return { outer:'down', inner:'up' }
  // 中间两行：左列右内左外；右列左内右外
  if (col === 1) return { outer:'left', inner:'right' }
  if (col === 4) return { outer:'right', inner:'left' }
  return { outer:'up', inner:'down' }
}

interface SA { type:string; direction:string; layer?:string }

const cells = computed(() => {
  const r:any[] = [{ k:'cc', r:'2/span 2', c2:'2/span 2', p:null, c:true, m:false, s:false, outArrows:[], inArrows:[], i:-1, outerDir:'', innerDir:'' }]
  for (const [eb,[row,col]] of Object.entries(EG)) {
    const p = props.palaces?.find((p2:any) => p2.branch === eb) || null
    const bi = EI[eb]
    const allSelf:SA[] = [
      ...(props.selfArrows||[]).filter((a:any) => a.palaceBranch===bi).map((a:any)=>({type:a.type, direction:a.direction, layer:'命'})),
      ...(props.showSelfDecade ? (props.decadeSelfArrows||[]) : []).filter((a:any) => a.palaceBranch===bi).map((a:any)=>({type:a.type, direction:a.direction, layer:'限'})),
      ...(props.showSelfYearly ? (props.yearlySelfArrows||[]) : []).filter((a:any) => a.palaceBranch===bi).map((a:any)=>({type:a.type, direction:a.direction, layer:'流'})),
    ]
    const { outer, inner } = getDirs(row, col)
    const outArrows = allSelf.filter((a:any) => a.direction === 'out')
    const inArrows = allSelf.filter((a:any) => a.direction === 'in')
    r.push({ k:eb, r:String(row), c2:String(col), p, c:false, m:p?.name==='命宫', s:!!p?.isShen,
      outArrows, inArrows, outerDir:outer, innerDir:inner, i:bi })
  }
  return r
})

// === 飞线 ===
const corePalaces = ['命宫','财帛宫','官禄宫','迁移宫']
const allFlies = computed(() => {
  let r = [...(props.flyLines||[])]
  if (props.showDecade) r = [...r, ...(props.decadeFly||[])]
  if (props.showYearly) r = [...r, ...(props.yearlyFly||[])]
  if (props.density === 'mini') r = r.filter((fl:any) => {
    const p = props.palaces?.find((p2:any) => p2.branchIndex === fl.fromBranch)
    return p ? corePalaces.includes(p.name) : false
  })
  return r
})
const cc = (eb:string) => {
  const p = EG[eb]; if (!p) return null
  const s = props.size||600; const cw = s/4
  return { x:(p[1]-0.5)*cw, y:(p[0]-0.5)*cw }
}
const svgFlyPaths = computed(() => {
  const groups = new Map<string, number>()
  return allFlies.value.map((fl:any) => {
    const from = cc(EB[fl.fromBranch])
    const to = cc(EB[fl.toBranch])
    if (!from || !to) return null
    const key = `${fl.fromBranch}-${fl.toBranch}`
    const n = groups.get(key) || 0
    groups.set(key, n+1)
    const off = (n - (groups.get(key)!-1)/2) * 6
    const mx = (from.x+to.x)/2 + off
    const my = (from.y+to.y)/2 + off
    const style = FLY_STYLE[fl.layer] || FLY_STYLE['命']
    return {
      d: `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`,
      color: saColor[fl.type] || '#999',
      w: style.w, dash: style.dash, op: style.op, type: fl.type,
    }
  }).filter(Boolean)
})

const bc = (s:any) => {
  if (s.brightness==='庙') return 'b-m'
  if (s.brightness==='旺') return 'b-w'
  if (s.brightness==='得'||s.brightness==='得地') return 'b-d'
  return ''
}
</script>

<style scoped>
.zw-wrap { display:flex; justify-content:center; }
.zw-box { display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr); gap:2px; background:#b8956a; border:3px solid #b8956a; padding:2px; position:relative; }
.zw-svg { position:absolute; top:0; left:0; pointer-events:none; z-index:10; }
.zw-c { background:#fcf8f0; border:1px solid #d4c5a9; cursor:pointer; display:flex; flex-direction:column; padding:3px 5px; position:relative; min-height:0; transition:background .15s; z-index:1; overflow:visible; }
.zw-c:hover { background:#f8f0e0; }
.zw-m { background:#fef6e0!important; border-color:#d4a017!important; border-width:2px!important; }
.zw-s { border-color:#8aaa7a!important; border-width:2px!important; }
.zw-cc { background:#efe4d0!important; border:none!important; cursor:default; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; z-index:1; }

/* === 细长箭头（→形状）：杆+箭头尖 ===
   默认尖端朝右，sa-dir-* 旋转方向 */
.sa-row { position:absolute; z-index:6; display:flex; gap:2px; align-items:center; }
/* 外框边 */
.sa-row-up { top:-3px; left:50%; transform:translateX(-50%); }
.sa-row-down { bottom:-3px; left:50%; transform:translateX(-50%); }
.sa-row-left { left:-3px; top:50%; transform:translateY(-50%) rotate(-90deg); }
.sa-row-right { right:-3px; top:50%; transform:translateY(-50%) rotate(90deg); }
/* 内框边（靠盘心）：只定位，方向由箭头sa-dir-*控制 */
.sa-row-in-up { top:3px; left:50%; transform:translateX(-50%); }
.sa-row-in-down { bottom:3px; left:50%; transform:translateX(-50%); }
.sa-row-in-left { left:3px; top:50%; transform:translateY(-50%); }
.sa-row-in-right { right:3px; top:50%; transform:translateY(-50%); }

.sa { display:inline-flex; align-items:center; }
/* 箭头旋转：尖端方向 */
.sa-dir-up { transform:rotate(-90deg); }
.sa-dir-down { transform:rotate(90deg); }
.sa-dir-left { transform:rotate(180deg); }
.sa-dir-right { transform:rotate(0deg); }
.sa-stem { display:block; width:10px; height:2px; border-radius:1px; }
.sa-head { display:block; width:0; height:0; border-top:3px solid transparent; border-bottom:3px solid transparent; border-left:6px solid; }
/* 大限：透明度0.7 */
.sa-hollow { opacity:0.7; }
/* 流年：发光 */
.sa-glow { opacity:0.8; filter:drop-shadow(0 0 2px currentColor); }
.sa-l { font-size:5px; font-weight:bold; margin-left:1px; }

.zcc { display:flex; align-items:center; gap:1px; font-size:9px; line-height:1.4; }
.zcl { color:#a09080; font-size:7px; white-space:nowrap; }
.zcv { color:#5a3e2b; font-weight:bold; font-size:9px; white-space:nowrap; }
.zt { position:absolute; left:-1px; top:50%; transform:translateY(-50%); writing-mode:vertical-rl; font-size:9px; color:#6b8e8e; font-weight:bold; z-index:3; }
.zh { display:flex; justify-content:space-between; border-bottom:1px solid #e8e0d0; padding-bottom:1px; flex-shrink:0; }
.zn { font-size:11px; font-weight:bold; color:#6b4226; }
.zg { font-size:8px; color:#a09080; }
.zs { flex:1; display:flex; flex-direction:column; justify-content:center; gap:0; padding:3px 0 1px; }
.zr { display:flex; align-items:center; gap:1px; line-height:1.25; flex-wrap:wrap; }
.zm { font-size:12px; font-weight:700; color:#1a1a2e; }
.zb { font-size:7px; color:#999; }
.ze { text-align:center; font-size:10px; color:#ccc; }
.b-m { color:#c0392b!important; }
.b-w { color:#d4871a!important; }
.b-d { color:#b8860b!important; }
.zhua { font-size:7px; font-weight:bold; padding:0 1px; }
.h-禄 { color:#cc0000; } .h-权 { color:#7b2d8e; } .h-科 { color:#1a6db5; } .h-忌 { color:#1a1a2e; }
.za { display:flex; flex-wrap:wrap; gap:1px 2px; font-size:7px; border-top:1px solid #ece4d4; padding-top:1px; flex-shrink:0; line-height:1.2; }
.zax { color:#555; } .zax small { font-size:6px; font-weight:bold; }
.zp { display:flex; justify-content:space-between; font-size:7px; color:#bbb; border-top:1px solid #f0e8d8; padding-top:1px; flex-shrink:0; margin-top:auto; }
.zdl { color:#8aaa7a; font-weight:bold; }
</style>
