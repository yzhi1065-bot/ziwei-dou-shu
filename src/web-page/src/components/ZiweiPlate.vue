<!-- 全功能方盘 + 自化箭头 + 飞星四化连线 -->
<template>
  <div class="zw-wrap" :style="{ width: (size+20)+'px' }">
    <div class="zw-box" :style="{ width: size+'px', height: size+'px' }">
      <!-- SVG层：飞星连线 -->
      <svg class="zw-svg" :width="size" :height="size" v-if="showFly && flyLines.length">
        <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6Z" fill="#d4a017"/></marker></defs>
        <line v-for="(l,i) in svgFlyLines" :key="i" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
          :stroke="l.color" :stroke-width="l.w" :stroke-dasharray="l.dash" opacity="0.6" marker-end="url(#ah)" />
      </svg>

      <div v-for="c in cells" :key="c.k" class="zw-c" :class="{ 'zw-m':c.m, 'zw-s':c.s, 'zw-cc':c.c, 'zw-h':c.h }"
        :style="{ gridRow: c.r, gridColumn: c.c2 }" @click="onClick(c)">

        <!-- 中宫 -->
        <template v-if="c.c">
          <div class="zcc"><span class="zcl">四柱</span><b class="zcv">{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></div>
          <div class="zcc"><span class="zcl">阳</span><b class="zcv">{{ solarDate }}</b><span class="zcl" style="margin-left:2px">时</span><b class="zcv">{{ timeRange }}</b></div>
          <div class="zcc"><span class="zcl">局</span><b class="zcv">{{ ep }}</b><span class="zcl" style="margin-left:2px">性</span><b class="zcv">{{ gender }}</b></div>
          <div class="zcc"><span class="zcl">命</span><b class="zcv">{{ mm }}</b><span class="zcl" style="margin-left:2px">身</span><b class="zcv">{{ sm }}</b></div>
        </template>

        <!-- 宫位 -->
        <template v-else-if="c.p">
          <div v-if="c.s" class="zt">身</div>
          <!-- 自化小箭头（四角） -->
          <template v-if="showSelf">
            <div v-for="sa in c.selfs" :key="sa.t" class="sa" :class="'sa-'+sa.t+'-'+sa.d" :style="{ background: saColor[sa.t] }"></div>
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
const props = defineProps<{
  palaces:any[]; size?:number; fp?:any; solarDate?:string; timeRange?:string
  ep?:string; mm?:string; sm?:string; gender?:string
  selfArrows?:any[]; flyLines?:any[]; showSelf?:boolean; showFly?:boolean
}>()
const emit = defineEmits(['sel'])

const saColor: Record<string,string> = { '禄':'#4CAF50', '权':'#9C27B0', '科':'#2196F3', '忌':'#F44336' }
const FLY_STYLE: Record<string,any> = { '命':{color:'#555',w:2,dash:''}, '限':{color:'#FF8C00',w:2,dash:''}, '流':{color:'#FFD700',w:1.5,dash:'4,3'} }

const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const EG:Record<string,[number,number]> = {
  '巳':[1,1],'午':[1,2],'未':[1,3],'申':[1,4],'辰':[2,1],'酉':[2,4],
  '卯':[3,1],'戌':[3,4],'寅':[4,1],'丑':[4,2],'子':[4,3],'亥':[4,4],
}
const EI:Record<string,number> = Object.fromEntries(EB.map((k,i)=>[k,i]))

const hlBranches = computed<string[]>(() => hl.value)
const hl = computed<string[]>(() => [])

const cells = computed(() => {
  const r:any[] = [{ k:'cc', r:'2/span 2', c2:'2/span 2', p:null, c:true, m:false, s:false, h:false, selfs:[], i:-1 }]
  for (const [eb,[row,col]] of Object.entries(EG)) {
    const p = props.palaces?.find((p2:any) => p2.branch === eb) || null
    const bi = EI[eb]
    const selfs = (props.selfArrows||[]).filter((sa:any) => sa.palaceBranch === bi)
    r.push({ k:eb, r:String(row), c2:String(col), p, c:false, m:p?.name==='命宫', s:!!p?.isShen, h:hl.value.includes(eb), selfs, i:bi })
  }
  return r
})

// SVG飞线坐标
const cc = (eb:string) => {
  const p = EG[eb]; if (!p) return null
  const s = props.size||600; const cw = s/4
  return { x:(p[1]-0.5)*cw, y:(p[0]-0.5)*cw }
}
// 三层飞线
const allFlyLines = computed(() => {
  const r = [...(props.flyLines||[])]
  return r
})
const svgFlyLines = computed(() => {
  return allFlyLines.value.map((fl:any) => {
    const from = cc(EB[fl.fromBranch])
    const to = cc(EB[fl.toBranch])
    if (!from || !to) return null
    const style = FLY_STYLE[fl.layer] || FLY_STYLE['命']
    return { x1:from.x, y1:from.y, x2:to.x, y2:to.y, color:style.color, w:style.w, dash:style.dash }
  }).filter(Boolean)
})

const onClick = (c:any) => { if (c.p) emit('sel', c.branchIndex||0) }

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
.zw-svg { position:absolute; top:0; left:0; pointer-events:none; z-index:5; }
.zw-c { background:#fcf8f0; border:1px solid #d4c5a9; cursor:pointer; display:flex; flex-direction:column; padding:3px 5px; position:relative; min-height:0; transition:background .15s; }
.zw-c:hover { background:#f8f0e0; }
.zw-m { background:#fef6e0!important; border-color:#d4a017!important; border-width:2px!important; }
.zw-s { border-color:#8aaa7a!important; border-width:2px!important; }
.zw-cc { background:#efe4d0!important; border:none!important; cursor:default; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; }
.zw-h { background:#fff8e8!important; border-color:#d4a017!important; box-shadow:inset 0 0 12px rgba(212,160,23,.15)!important; }

/* 自化小箭头 */
.sa { position:absolute; width:6px; height:6px; z-index:3; border-radius:1px; }
.sa-禄-out { top:0; left:0; clip-path:polygon(0 0, 100% 0, 50% 100%); }
.sa-权-out { top:0; right:0; clip-path:polygon(0 0, 100% 0, 50% 100%); }
.sa-科-out { bottom:0; left:0; clip-path:polygon(0 100%, 100% 100%, 50% 0); }
.sa-忌-out { bottom:0; right:0; clip-path:polygon(0 100%, 100% 100%, 50% 0); }
.sa-禄-in { top:0; left:0; clip-path:polygon(50% 0, 100% 50%, 50% 100%); }
.sa-权-in { top:0; right:0; clip-path:polygon(50% 0, 100% 50%, 50% 100%); transform:rotate(90deg); }
.sa-科-in { bottom:0; left:0; clip-path:polygon(50% 0, 100% 50%, 50% 100%); transform:rotate(-90deg); }
.sa-忌-in { bottom:0; right:0; clip-path:polygon(50% 0, 100% 50%, 50% 100%); transform:rotate(180deg); }

.zcc { display:flex; align-items:center; gap:1px; font-size:9px; line-height:1.4; }
.zcl { color:#a09080; font-size:7px; white-space:nowrap; }
.zcv { color:#5a3e2b; font-weight:bold; font-size:9px; white-space:nowrap; }
.zt { position:absolute; left:-1px; top:50%; transform:translateY(-50%); writing-mode:vertical-rl; font-size:9px; color:#6b8e8e; font-weight:bold; z-index:2; }
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
