<template>
  <div class="max-w-7xl mx-auto" v-if="chart">
    <!-- 顶栏 -->
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <h2 class="text-lg font-song font-bold text-mose">本命盘</h2>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">四柱：<b>{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">{{ chart.elementPhase }}</span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">命{{ chart.mingMaster }} 身{{ chart.shenMaster }}</span>
      <button @click="saveChart" class="ml-auto px-2 py-0.5 text-xs rounded bg-zheshi text-white">💾保存</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div class="lg:col-span-3">
        <ZiweiPlate :palaces="chart.palaces" :size="600" :fp="fp" :solarDate="chart.solarDate" :timeRange="chart.timeRange"
          :ep="chart.elementPhase" :mm="chart.mingMaster" :sm="chart.shenMaster" :gender="chart.gender" @sel="selIdx=$event"
          :selfArrows="chart.selfArrows" :flyLines="chart.flyLines" :decadeFly="chart.decadeFly" :yearlyFly="chart.yearlyFly"
          :showSelf="store.arrowSettings.showSelf" :showFly="store.arrowSettings.showFly"
          :showDecade="store.arrowSettings.showDecade" :showYearly="store.arrowSettings.showYearly"
          :mode="store.arrowSettings.mode" :density="store.arrowSettings.density" />
      </div>
      <div class="lg:col-span-2 space-y-2 text-xs">
        <!-- 时间流切换 -->
        <div class="scroll-panel rounded-lg p-2 flex flex-wrap gap-1 items-center">
          <span class="text-gray-500">流年</span>
          <button @click="fy--" class="px-1 bg-mibai rounded">◀</button>
          <input v-model.number="fy" class="w-14 text-center border rounded" />
          <button @click="fy++" class="px-1 bg-mibai rounded">▶</button>
          <select v-model.number="fm" class="border rounded w-14">
            <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
          </select>
          <input v-model.number="fd" class="w-10 text-center border rounded" placeholder="日" />
          <span class="text-gray-300 mx-1">|</span>
          <button @click="store.arrowSettings.showSelf=!store.arrowSettings.showSelf" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showSelf?'bg-green-100 text-green-700':'bg-gray-100 text-gray-400'">自化</button>
          <button @click="store.arrowSettings.showFly=!store.arrowSettings.showFly" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showFly?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-400'">飞星</button>
          <button @click="store.arrowSettings.showDecade=!store.arrowSettings.showDecade" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showDecade?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-400'">大限</button>
          <button @click="store.arrowSettings.showYearly=!store.arrowSettings.showYearly" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showYearly?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-400'">流年</button>
          <button @click="store.arrowSettings.mode = store.arrowSettings.mode==='color'?'letter':'color'" class="px-1 text-xs rounded bg-blue-50 text-blue-700">
            {{ store.arrowSettings.mode==='color' ? '彩色' : 'ABCD' }}</button>
          <button @click="store.arrowSettings.density = store.arrowSettings.density==='full'?'mini':'full'" class="px-1 text-xs rounded bg-gray-100 text-gray-600">
            {{ store.arrowSettings.density==='full' ? '完整' : '精简' }}</button>
        </div>

        <!-- 宫位详情 -->
        <div class="scroll-panel rounded-lg p-2">
          <h3 class="font-bold border-b pb-1 mb-1">{{ selP?.name||chart.palaces[0]?.name }}
            <small class="text-gray-400 font-normal">{{ selP?.stem }}{{ selP?.branch }}</small></h3>
          <div class="space-y-0.5">
            <p>主星：<template v-for="s in selP?.mainStars" :key="s.name">{{ s.name }}{{ s.brightness }}{{ s.mutagen }} </template><span v-if="!selP?.mainStars?.length" class="text-gray-400 italic">空宫</span></p>
            <p v-if="selP?.minorStars?.length">辅煞：{{ selP.minorStars.map((s:any)=>s.name+(s.mutagen||'')).join(' ') }}</p>
            <p v-if="selP?.changsheng12">长生：{{ selP.changsheng12 }} 博士：{{ selP.boshi12 }} 将前：{{ selP.jiangqian12 }} 岁前：{{ selP.suiqian12 }}</p>
            <p v-if="selP?.decadal">大限：{{ selP.decadal.range[0] }}-{{ selP.decadal.range[1] }}岁 ({{ selP.decadal.stem }}{{ selP.decadal.branch }})</p>
            <p v-if="selP?.ages?.length">小限：{{ selP.ages.join(' ') }}</p>
          </div>
        </div>

        <!-- 大限表 -->
        <div class="scroll-panel rounded-lg p-2">
          <h3 class="font-bold border-b pb-1 mb-1">大限·小限</h3>
          <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div v-for="p in limits" :key="p.n" class="flex justify-between">
              <span :class="p.a?'text-zhuque font-bold':'text-gray-600'">{{ p.n }}</span>
              <span class="text-gray-500">{{ p.d }}岁</span>
            </div>
          </div>
        </div>

        <!-- 本命四化 -->
        <div class="scroll-panel rounded-lg p-2" v-if="mutagens.length">
          <h3 class="font-bold border-b pb-1 mb-1">本命四化</h3>
          <div class="flex gap-2">{{ mutagens }}</div>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="scroll-panel rounded-lg p-3 mt-4" v-if="records.length">
      <h3 class="font-bold text-sm border-b pb-1 mb-2">历史记录 ({{ records.length }})</h3>
      <div class="flex flex-wrap gap-2">
        <div v-for="(r,i) in records" :key="r.id" class="text-xs bg-mibai px-2 py-1 rounded flex items-center gap-2">
          <span>{{ r.fp?.year||'' }}·{{ r.gender }}</span>
          <span class="text-gray-400">{{ r.savedAt }}</span>
          <button @click="loadRecord(r)" class="text-zheshi">加载</button>
          <button @click="store.deleteRecord(i);store.loadRecords()" class="text-gray-400">×</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-400">
    <p>请先录入排盘</p>
    <router-link to="/" class="text-zheshi underline mt-2 inline-block text-sm">去录入</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChartStore } from '../stores/chart'
import ZiweiPlate from '../components/ZiweiPlate.vue'

const store = useChartStore()
// 优先用store里的最新数据（generateChart已填充selfArrows/flyLines）
// 只有store为空时才从window读取（防止旧数据覆盖新数据）
if (!store.chartResult) {
  const winData = (window as any).__CHART_DATA
  if (winData) store.chartResult = winData
}
const chart = computed(() => store.chartResult)
const fp = computed(() => chart.value?.fourPillars)

const selIdx = ref<number | null>(null)
const fy = ref(new Date().getFullYear())
const fm = ref(new Date().getMonth()+1)
const fd = ref(new Date().getDate())

const records = computed(() => store.savedRecords)
store.loadRecords()

const selP = computed(() => {
  const p = chart.value?.palaces
  if (!p) return null
  if (selIdx.value !== null) return p.find((p2:any) => p2.branchIndex === selIdx.value) || p[0]
  return p[0]
})

// 四化汇总
const mutagens = computed(() => {
  if (!chart.value?.palaces) return []
  const m:any[] = []
  chart.value.palaces.forEach((p:any) => {
    p.mainStars?.forEach((s:any) => { if (s.mutagen) m.push(`${p.name}·${s.name}【${s.mutagen}】`) })
  })
  return m
})

const limits = computed(() => {
  const p = chart.value?.palaces
  if (!p) return []
  const age = new Date().getFullYear() - parseInt(chart.value?.solarDate?.split('-')[0]||'1990') + 1
  return p.filter((p2:any) => p2.decadal).map((p2:any) => ({ n: p2.name, d: p2.decadal.range.join('-'), a: age >= p2.decadal.range[0] && age <= p2.decadal.range[1] }))
})

function saveChart() {
  store.saveRecord({ fp: fp.value, gender: chart.value.gender, solarDate: chart.value.solarDate, type: iztroName.value })
  const btn = document.activeElement as HTMLElement
  if (btn) { btn.textContent = '✅'; setTimeout(() => { btn.textContent = '💾保存' }, 1500) }
}

const iztroName = computed(() => chart.value?.elementPhase || '')
</script>
