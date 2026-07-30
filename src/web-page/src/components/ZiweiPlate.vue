<!-- 方盘组件 iztro-style layout -->
<template>
  <div class="zw-box" :style="{ width: size + 'px' }">
    <div v-for="c in cells" :key="c.k" class="zw-c" :class="{ 'zw-m':c.m, 'zw-s':c.s, 'zw-cc':c.c }"
      :style="{ gridRow: c.r, gridColumn: c.c2 }" @click="c.p && $emit('sel', c.i)">
      
      <template v-if="c.c">
        <div style="font-size:9px;line-height:1.6;text-align:center">
          <div><small style="color:#999">四柱</small> <b>{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></div>
          <div><small style="color:#999">阳</small> <b>{{ solarDate }}</b></div>
          <div><small style="color:#999">局</small> <b>{{ ep }}</b> <small style="color:#999">性</small> <b>{{ gender }}</b></div>
          <div><small style="color:#999">命</small> <b>{{ mm }}</b> <small style="color:#999">身</small> <b>{{ sm }}</b></div>
        </div>
      </template>

      <template v-else-if="c.p">
        <div v-if="c.s" class="zt">身</div>
        <div class="zs">
          <div v-for="s in c.p.mainStars" :key="s" class="zr"><b>{{ s }}</b></div>
          <div v-if="!c.p.mainStars?.length" class="ze">空</div>
        </div>
        <div class="za" v-if="c.p.minorStars?.length||c.p.shaStars?.length">
          <span v-for="s in c.p.minorStars" :key="'m'+s" class="zm">{{ s }}</span>
          <span v-for="s in c.p.shaStars" :key="'s'+s" class="zs2">{{ s }}</span>
        </div>
        <div class="zf"><b>{{ c.p.name }}</b><small>{{ c.p.stem }}{{ c.p.branch }}</small></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ palaces:any[]; size?:number; fp?:any; solarDate?:string; ep?:string; mm?:string; sm?:string; gender?:string }>()
defineEmits(['sel'])

const EG:Record<string,[number,number]> = {
  '巳':[1,1],'午':[1,2],'未':[1,3],'申':[1,4],
  '辰':[2,1],'酉':[2,4],'卯':[3,1],'戌':[3,4],
  '寅':[4,1],'丑':[4,2],'子':[4,3],'亥':[4,4],
}

const cells = computed(() => {
  const r:any[] = [{ k:'cc', r:'2/span 2', c2:'2/span 2', p:null, c:true, m:false, s:false, i:-1 }]
  for (const [eb,[row,col]] of Object.entries(EG)) {
    const p = props.palaces?.find((p2:any) => p2.branch === eb) || null
    r.push({ k:eb, r:String(row), c2:String(col), p, c:false, m:p?.name==='命宫', s:!!p?.isShen, i:p?.branchIndex||0 })
  }
  return r
})
</script>

<style scoped>
.zw-box { display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr); gap:2px; background:#b8956a; border:3px solid #b8956a; padding:2px; }
.zw-c { background:#fcf8f0; border:1px solid #d4c5a9; cursor:pointer; display:flex; flex-direction:column; padding:3px 5px; position:relative; min-height:0; }
.zw-c:hover { background:#f8f0e0; }
.zw-m { background:#fef6e0!important; border-color:#d4a017!important; border-width:2px!important; }
.zw-s { border-color:#8aaa7a!important; border-width:2px!important; }
.zw-cc { background:#efe4d0!important; border:none!important; cursor:default; display:flex; align-items:center; justify-content:center; }
.zt { position:absolute; left:0; top:50%; transform:translateY(-50%); writing-mode:vertical-rl; font-size:9px; color:#6b8e8e; font-weight:bold; padding:2px; }
.zs { flex:1; display:flex; flex-direction:column; justify-content:center; gap:1px; padding:10px 0 2px; }
.zr { font-size:13px; font-weight:700; color:#1a1a2e; line-height:1.3; }
.ze { text-align:center; font-size:10px; color:#ccc; }
.za { display:flex; flex-wrap:wrap; gap:1px 3px; padding:1px 0; font-size:9px; border-top:1px solid #ece4d4; }
.zm { color:#555; }
.zs2 { color:#887a6a; }
.zf { display:flex; justify-content:space-between; border-top:1px solid #e8e0d0; padding-top:2px; font-size:10px; }
.zf b { color:#6b4226; }
.zf small { color:#a09080; }
</style>
