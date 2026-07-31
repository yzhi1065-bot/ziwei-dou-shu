<template>
  <div class="max-w-5xl mx-auto">
    <div v-if="store.chartResult" class="mb-4">
      <h2 class="text-lg font-song font-bold text-mose mb-3">运势推演</h2>

      <!-- 时间选择 -->
      <div class="scroll-panel rounded-lg p-3 mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span class="text-gray-500 text-xs">选择时间：</span>
        <input v-model.number="y" type="number" class="w-20 border rounded px-2 py-0.5" />
        <span class="text-gray-400">年</span>
        <select v-model.number="m" class="border rounded px-1 py-0.5">
          <option v-for="i in 12" :key="i" :value="i">{{ i }}月</option>
        </select>
        <select v-model.number="d" class="border rounded px-1 py-0.5">
          <option v-for="i in 31" :key="i" :value="i">{{ i }}日</option>
        </select>
        <select v-model.number="h" class="border rounded px-1 py-0.5">
          <option v-for="i in 12" :key="i" :value="(i-1)*2">{{ (i-1)*2 }}:00-{{ i*2 }}:00</option>
        </select>
        <button @click="calc" class="ml-2 px-3 py-0.5 rounded bg-zheshi text-white text-xs">推演</button>
      </div>

      <!-- 层级切换 -->
      <div class="flex flex-wrap gap-1 mb-3">
        <button v-for="t in tabs" :key="t.k" @click="tab=t.k"
          class="px-3 py-1 text-xs rounded"
          :class="tab===t.k ? 'bg-zheshi text-white' : 'bg-mibai text-gray-600'">{{ t.n }}</button>
      </div>

      <div v-if="data" class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <!-- 四化 -->
        <div class="scroll-panel rounded-lg p-3">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ curTab?.n }}四化</h3>
          <div class="space-y-1 text-xs">
            <p v-for="(s,i) in data.mutagen" :key="i" class="flex items-center gap-2">
              <span class="w-3 h-3 inline-block rounded-sm" :style="{background: huaColors[i]}"></span>
              <b>{{ s }}</b>
              <span class="text-gray-400">{{ huaNames[i] }}入{{ data.palaceNames?.[i] || '' }}</span>
            </p>
          </div>
        </div>

        <!-- 宫位落位 -->
        <div class="scroll-panel rounded-lg p-3">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ curTab?.n }}十二宫落位</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            <div v-for="(pn,i) in data.palaceNames" :key="i" class="flex justify-between border-b border-gray-100 pb-0.5">
              <span class="text-gray-700">{{ i===0 ? '命宫' : flowNames[i] }}</span>
              <span class="text-zheshi">落本命{{ pn }}</span>
            </div>
          </div>
        </div>

        <!-- 运势解析 -->
        <div class="scroll-panel rounded-lg p-3 lg:col-span-2">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ curTab?.n }}运势解析</h3>
          <div class="text-xs space-y-2 text-gray-700 leading-relaxed">
            <p v-for="(p, i) in analysis" :key="i">{{ p }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-gray-400 text-sm">选择时间后点击「推演」</div>
    </div>
    <div v-else class="text-center py-20 text-gray-400">
      <p>请先排盘</p>
      <router-link to="/" class="text-zheshi underline mt-2 inline-block text-sm">去录入 →</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChartStore } from '../stores/chart'

const store = useChartStore()
const now = new Date()
const y = ref(now.getFullYear())
const m = ref(now.getMonth() + 1)
const d = ref(now.getDate())
const h = ref(0)
const tab = ref('yearly')
const data = ref<any>(null)

const tabs = [
  { k: 'decadal', n: '大限' },
  { k: 'yearly', n: '流年' },
  { k: 'monthly', n: '流月' },
  { k: 'daily', n: '流日' },
  { k: 'hourly', n: '流时' },
]
const curTab = computed(() => tabs.find(t => t.k === tab.value))

const huaNames = ['化禄','化权','化科','化忌']
const huaColors = ['#27AE60','#8E44AD','#3498DB','#E74C3C']
const flowNames = ['兄弟','夫妻','子女','财帛','疾厄','迁移','仆役','官禄','田宅','福德','父母']

function calc() {
  const a = store.rawAstrolabe
  if (!a) return
  try {
    const dateStr = `${y.value}-${m.value}-${d.value}`
    const horo = a.horoscope(dateStr)
    const layer = horo[tab.value]
    if (!layer) return
    data.value = {
      name: layer.name,
      palaceNames: layer.palaceNames || [],
      mutagen: layer.mutagen || [],
    }
  } catch (e) {
    console.error('运势计算失败:', e)
  }
}

// 运势解析
const analysis = computed(() => {
  if (!data.value) return []
  const arr: string[] = []
  const mgen = data.value.mutagen || []
  const pn = data.value.palaceNames || []
  const label = curTab.value?.n || ''

  if (mgen.length) {
    arr.push(`本${label}四化：${huaNames[0]}（${mgen[0]}）入${pn[0]||'命宫'}，${huaNames[1]}（${mgen[1]}）入${pn[1]||''}，${huaNames[2]}（${mgen[2]}）入${pn[2]||''}，${huaNames[3]}（${mgen[3]}）入${pn[3]||''}。`)
  }

  // 四化吉凶简析
  if (mgen[0]) arr.push(`◆ 化禄（${mgen[0]}）：该${label}禄星入${pn[0]||'命宫'}，机遇与财禄汇聚之地，宜把握事业发展与财运机遇。`)
  if (mgen[3]) arr.push(`◆ 化忌（${mgen[3]}）：忌星入${pn[3]||''}，该宫位相关事务易有阻力、消耗与波折，需谨慎应对，避免冲动决策。`)
  if (mgen[1]) arr.push(`◆ 化权（${mgen[1]}）：权星入${pn[1]||''}，该宫位事务有掌控力与上升空间，可主动争取主导权。`)
  if (mgen[2]) arr.push(`◆ 化科（${mgen[2]}）：科星入${pn[2]||''}，该宫位事务得名望助力，人缘与口碑向好，适合求名与化解矛盾。`)

  arr.push(`※ 建议：${label}期间重点关注${pn[0]||'命宫'}（禄）与${pn[3]||''}（忌）两处宫位事务，吉处进取、忌处谨慎，把握运势节奏。`)
  return arr
})

// 初始计算
watch(tab, calc, { immediate: true })
</script>
