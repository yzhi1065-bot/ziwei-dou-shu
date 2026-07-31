<template>
  <div class="max-w-7xl mx-auto" v-if="chart">
    <!-- 顶栏 -->
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <h2 class="text-lg font-song font-bold text-mose">本命盘</h2>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">四柱：<b>{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">{{ chart.elementPhase }}</span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">命{{ chart.mingMaster }} 身{{ chart.shenMaster }}</span>
      <button @click="saveChart" class="ml-auto px-2 py-0.5 text-xs rounded bg-zheshi text-white">{{ saved ? '✅ 已保存' : '💾保存' }}</button>
      <button @click="exportPng" class="px-2 py-0.5 text-xs rounded bg-jinbo text-white">📷导出PNG</button>
      <button @click="exportJson" class="px-2 py-0.5 text-xs rounded bg-mibai text-gray-700 border">📄JSON</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div class="lg:col-span-3">
        <!-- 盘面模式切换 -->
        <div class="flex gap-1 mb-2">
          <button @click="plateMode='square'" class="px-2 py-0.5 text-xs rounded" :class="plateMode==='square' ? 'bg-zheshi text-white' : 'bg-mibai text-gray-600'">方盘</button>
          <button @click="plateMode='circle'" class="px-2 py-0.5 text-xs rounded" :class="plateMode==='circle' ? 'bg-zheshi text-white' : 'bg-mibai text-gray-600'">圆盘</button>
        </div>
        <ZiweiPlate v-if="plateMode==='square'" :palaces="chart.palaces" :size="plateSize" :fp="fp" :solarDate="chart.solarDate" :timeRange="chart.timeRange"
          :ep="chart.elementPhase" :mm="chart.mingMaster" :sm="chart.shenMaster" :gender="chart.gender" @sel="selIdx=$event"
          :selfArrows="chart.selfArrows" :decadeSelfArrows="chart.decadeSelfArrows" :yearlySelfArrows="chart.yearlySelfArrows"
          :flyLines="chart.flyLines" :decadeFly="chart.decadeFly" :yearlyFly="chart.yearlyFly"
          :showSelf="store.arrowSettings.showSelf" :showFly="isFeixing && store.arrowSettings.showFly"
          :showSelfDecade="store.arrowSettings.showSelfDecade" :showSelfYearly="store.arrowSettings.showSelfYearly"
          :showDecade="isFeixing && store.arrowSettings.showDecade" :showYearly="isFeixing && store.arrowSettings.showYearly"
          :mode="store.arrowSettings.mode" :density="store.arrowSettings.density" />
        <ZiweiCircle v-else :palaces="chart.palaces" :size="plateSize" :ep="chart.elementPhase" :mm="chart.mingMaster" :sm="chart.shenMaster" :gender="chart.gender" />

        <!-- 命格局 -->
        <div class="scroll-panel rounded-lg p-3 mt-3" v-if="chart.patterns && chart.patterns.length">
          <h3 class="font-bold text-sm mb-2">命格局</h3>
          <div class="flex flex-wrap gap-2">
            <div v-for="(p,i) in chart.patterns" :key="i" class="bg-zheshi/10 border border-zheshi/30 rounded px-2 py-1 text-xs">
              <b class="text-zheshi">{{ p.name }}</b>
              <span class="text-gray-600 ml-1">{{ p.description }}</span>
            </div>
          </div>
        </div>

        <!-- 四化图例说明 -->
        <div class="scroll-panel rounded-lg p-3 mt-3 text-xs">
          <div class="flex flex-wrap gap-3">
            <div v-for="l in legend" :key="l.t" class="flex items-center gap-1">
              <span class="inline-block w-3 h-3" :style="{ background: l.c, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }"></span>
              <span><b class="font-bold">{{ l.t }}·{{ l.name }}</b><span class="text-gray-500"> {{ l.meaning }}</span></span>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 mt-2 pt-2 border-t border-gray-200 text-gray-600">
            <span><b class="text-gray-800">▲朝外</b>（尖端朝宫格外）= 离心 · 本宫自化 · 能量外散</span>
            <span><b class="text-gray-800">▼朝内</b>（尖端朝盘心）= 向心 · 视同自化 · 外力灌入</span>
          </div>
        </div>
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
          <button @click="store.arrowSettings.showSelfDecade=!store.arrowSettings.showSelfDecade" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showSelfDecade?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-400'">限自</button>
          <button @click="store.arrowSettings.showSelfYearly=!store.arrowSettings.showSelfYearly" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showSelfYearly?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-400'">流自</button>
          <button @click="store.arrowSettings.mode = store.arrowSettings.mode==='color'?'letter':'color'" class="px-1 text-xs rounded bg-blue-50 text-blue-700">
            {{ store.arrowSettings.mode==='color' ? '彩色' : 'ABCD' }}</button>
          <template v-if="isFeixing">
          <button @click="store.arrowSettings.showFly=!store.arrowSettings.showFly" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showFly?'bg-purple-100 text-purple-700':'bg-gray-100 text-gray-400'">飞星</button>
          <button @click="store.arrowSettings.showDecade=!store.arrowSettings.showDecade" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showDecade?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-400'">大限</button>
          <button @click="store.arrowSettings.showYearly=!store.arrowSettings.showYearly" class="px-1 text-xs rounded"
            :class="store.arrowSettings.showYearly?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-400'">流年</button>
          <button @click="store.arrowSettings.density = store.arrowSettings.density==='full'?'mini':'full'" class="px-1 text-xs rounded bg-gray-100 text-gray-600">
            {{ store.arrowSettings.density==='full' ? '完整' : '精简' }}</button>
          </template>
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
      <div class="flex items-center justify-between border-b pb-1 mb-2 cursor-pointer" @click="recOpen=!recOpen">
        <h3 class="font-bold text-sm">历史记录 ({{ records.length }})</h3>
        <span class="text-gray-400 text-xs">{{ recOpen ? '▾ 收起' : '▸ 展开' }}</span>
      </div>
      <div v-if="recOpen" class="flex flex-wrap gap-2">
        <div v-for="(r,i) in records" :key="r.id" class="text-xs bg-mibai px-2 py-1 rounded flex items-center gap-2">
          <span>{{ r.fp?.year||'' }}·{{ r.gender }}</span>
          <span class="text-gray-400">{{ r.savedAt }}</span>
          <button @click="loadRecord(r)" class="text-zheshi hover:underline">加载</button>
          <button @click="store.deleteRecord(i);store.loadRecords()" class="text-gray-400 hover:text-red-500">×</button>
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
import ZiweiCircle from '../components/ZiweiCircle.vue'

const store = useChartStore()
const plateMode = ref('square')
// 直接读Pinia store（路由切换不丢数据）
const chart = computed(() => store.chartResult)
// 飞星派才显示飞线+自化箭头
const isFeixing = computed(() => (chart.value?.school || 'sanhe') === 'feixing')

// 盘面尺寸自适应（移动端缩小，桌面600px）
const plateSize = ref(600)
function calcPlateSize() {
  const w = window.innerWidth
  plateSize.value = w < 480 ? Math.min(w - 32, 420) : w < 768 ? Math.min(w - 48, 560) : 600
}
calcPlateSize()
window.addEventListener('resize', calcPlateSize)
const fp = computed(() => chart.value?.fourPillars)

const selIdx = ref<number | null>(null)
const fy = ref(new Date().getFullYear())
const fm = ref(new Date().getMonth()+1)
const fd = ref(new Date().getDate())

const records = computed(() => store.savedRecords)
store.loadRecords()
const recOpen = ref(true)

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

const saved = ref(false)
function saveChart() {
  // 保存完整chart数据（含palaces/自化/飞线等）
  store.saveRecord({
    fp: fp.value,
    gender: chart.value.gender,
    solarDate: chart.value.solarDate,
    school: chart.value.school,
    elementPhase: chart.value.elementPhase,
    fullData: chart.value,
  })
  saved.value = true
  setTimeout(() => { saved.value = false }, 1500)
}

// PNG导出（html2canvas截图盘面）
async function exportPng() {
  const plate = document.querySelector('.zw-box') as HTMLElement
  if (!plate) return
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(plate, { backgroundColor: '#fcf8f0', scale: 2 })
    const a = document.createElement('a')
    a.download = `紫微命盘-${chart.value?.solarDate}-${chart.value?.gender}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  } catch (e) {
    console.error('PNG导出失败:', e)
  }
}

// JSON导出
function exportJson() {
  const blob = new Blob([JSON.stringify(chart.value, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = `紫微命盘-${chart.value?.solarDate}.json`
  a.href = URL.createObjectURL(blob)
  a.click()
  URL.revokeObjectURL(a.href)
}

function loadRecord(r: any) {
  if (r.fullData) {
    // 恢复完整命盘（走Pinia store，路由切换不丢）
    store.chartResult = r.fullData
    return
  }
  // 兼容旧记录：重新排盘
  const d = (r.solarDate || '').split('-')
  if (d.length >= 3) {
    store.generateChart(parseInt(d[0]), parseInt(d[1]), parseInt(d[2]), 0, 0, r.gender, r.school || 'sanhe')
  }
}

const iztroName = computed(() => chart.value?.elementPhase || '')

// 四化图例
const legend = [
  { t: '禄', name: '自化禄', c: '#27AE60', meaning: '机遇·自得·留福' },
  { t: '权', name: '自化权', c: '#8E44AD', meaning: '自主·要强·掌控' },
  { t: '科', name: '自化科', c: '#3498DB', meaning: '化解·名声·美化' },
  { t: '忌', name: '自化忌', c: '#E74C3C', meaning: '内耗·纠结·付出' },
]
</script>
