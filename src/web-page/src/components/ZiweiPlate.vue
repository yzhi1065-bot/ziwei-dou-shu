<!-- 全功能方盘：四化/三方四正/神煞/108星/大限小限 -->
<template>
  <div class="zw-wrap" :style="{ width: (size+20)+'px' }">
    <div class="zw-box" :style="{ width: size+'px', height: size+'px' }">
      <!-- SVG虚线 -->
      <svg class="zw-svg" :width="size" :height="size" v-if="hl.length">
        <line v-for="(l,i) in svgLines" :key="i" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
          stroke="#d4a017" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7" />
      </svg>
      <div v-for="c in cells" :key="c.k" class="zw-c" :class="{ 'zw-m':c.m, 'zw-s':c.s, 'zw-cc':c.c, 'zw-h':c.h }"
        :style="{ gridRow: c.r, gridColumn: c.c2 }" @click="onClick(c)">
        <!-- 中宫 -->
        <template v-if="c.c">
          <div class="zcc"><div class="zcl">四柱</div><div class="zcv"><b>{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></div></div>
          <div class="zcc"><div class="zcl">阳</div><div class="zcv">{{ solarDate }}</div><div class="zcl" style="margin-left:3px">时</div><div class="zcv">{{ timeRange }}</div></div>
          <div class="zcc"><div class="zcl">局</div><div class="zcv">{{ ep }}</div><div class="zcl" style="margin-left:3px">性</div><div class="zcv">{{ gender }}</div></div>
          <div class="zcc"><div class="zcl">命</div><div class="zcv">{{ mm }}</div><div class="zcl" style="margin-left:3px">身</div><div class="zcv">{{ sm }}</div></div>
        </template>
        <!-- 宫位 -->
        <template v-else-if="c.p">
          <div v-if="c.s" class="zt">身</div>
          <div class="zh"><span class="zn">{{ c.p.name }}</span><span class="zg">{{ c.p.stem }}{{ c.p.branch }}</span></div>
          <!-- 主星 + 四化 -->
          <div class="zs">
            <div v-for="s in c.p.mainStars" :key="s.name" class="zr">
              <span class="zm" :class="bc(s)">{{ s.name }}</span>
              <span v-if="s.brightness" class="zb">{{ s.brightness }}</span>
              <span v-if="s.mutagen" class="zhua" :class="'h-'+s.mutagen">{{ s.mutagen }}</span>
            </div>
            <div v-if="!c.p.mainStars?.length" class="ze">空</div>
          </div>
          <!-- 辅星 -->
          <div class="za" v-if="c.p.minorStars?.length||c.p.adjStars?.length">
            <span v-for="s in [...(c.p.minorStars||[]),...(c.p.adjStars||[])]" :key="s.name" class="zax" :class="s.type==='tough'?'zs2':'zm'">{{ s.name }}<small v-if="s.mutagen" :class="'h-'+s.mutagen">{{ s.mutagen }}</small></span>
          </div>
          <!-- 十二神煞 + 大限 -->
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
import { computed, ref } from 'vue'
const props = defineProps<{ palaces:any[]; size?:number; fp?:any; solarDate?:string; ep?:string; mm?:string; sm?:string; gender?:string; timeRange?:string }>()
const emit = defineEmits(['sel'])

const selEb = ref('')
const hl = ref<string[]>([])

const EG:Record<string,[number,number]> = {
  '巳':[1,1],'午':[1,2],'未':[1,3],'申':[1,4],
  '辰':[2,1],'酉':[2,4],'卯':[3,1],'戌':[3,4],
  '寅':[4,1],'丑':[4,2],'子':[4,3],'亥':[4,4],
}
const EI:Record<string,number> = {'子':0,'丑':1,'寅':2,'卯':3,'辰':4,'巳':5,'午':6,'未':7,'申':8,'酉':9,'戌':10,'亥':11}

function getSanF(eb:string):string[] {
  const i = EI[eb]; if (i===undefined) return []
  return [eb, EB[(i+6)%12], EB[(i+4)%12], EB[(i+8)%12]]
}
const EB = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const cells = computed(() => {
  const r:any[] = [{ k:'cc', r:'2/span 2', c2:'2/span 2', p:null, c:true, m:false, s:false, h:false, i:-1 }]
  for (const [eb,[row,col]] of Object.entries(EG)) {
    const p = props.palaces?.find((p2:any) => p2.branch === eb) || null
    r.push({ k:eb, r:String(row), c2:String(col), p, c:false, m:p?.name==='命宫', s:!!p?.isShen, h:hl.value.includes(eb), i:p?.branchIndex||0 })
  }
  return r
})

function onClick(c:any) {
  if (!c.p) return
  selEb.value = c.p.branch
  hl.value = getSanF(c.p.branch)
  emit('sel', c.p.branchIndex)
}

const cellCenter = (eb:string) => {
  const p = EG[eb]; if (!p) return null
  const s = props.size||600; const cw = s/4
  return { x:(p[1]-0.5)*cw, y:(p[0]-0.5)*cw }
}
const svgLines = computed(() => {
  if (hl.value.length<2) return []
  const pts = hl.value.map(eb => cellCenter(eb)).filter(Boolean) as {x:number;y:number}[]
  const ls:{x1:number;y1:number;x2:number;y2:number}[] = []
  for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) ls.push({x1:pts[i].x,y1:pts[i].y,x2:pts[j].x,y2:pts[j].y})
  return ls
})

function bc(s:any) {
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
.zm { color:#555; } .zs2 { color:#887a6a; } .zax small { font-size:6px; font-weight:bold; }
.zp { display:flex; justify-content:space-between; font-size:7px; color:#bbb; border-top:1px solid #f0e8d8; padding-top:1px; flex-shrink:0; margin-top:auto; }
.zdl { color:#8aaa7a; font-weight:bold; }
</style>
