<template>
  <div class="max-w-6xl mx-auto" v-if="chart">
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <h2 class="text-lg font-song font-bold text-mose">本命盘</h2>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">四柱：<b>{{ fp?.year }} {{ fp?.month }} {{ fp?.day }} {{ fp?.hour }}时</b></span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">五行局：<b>{{ chart.elementPhase }}</b></span>
      <span class="bg-mibai px-2 py-0.5 rounded border text-xs">命主：<b>{{ chart.mingMaster }}</b> · 身主：<b>{{ chart.shenMaster }}</b></span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div class="lg:col-span-3 scroll-panel rounded-lg p-3 flex justify-center items-start">
        <ZiweiPlate :palaces="chart.palaces" :size="540" :fp="fp" :solarDate="chart.solarDate"
          :ep="chart.elementPhase" :mm="chart.mingMaster" :sm="chart.shenMaster" :gender="chart.gender"
          @sel="selIdx=$event" />
      </div>
      <div class="lg:col-span-2 space-y-3">
        <div class="scroll-panel rounded-lg p-3">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ selP?.name || chart.palaces[0]?.name }}</h3>
          <div class="text-xs space-y-1">
            <p>主星：{{ selP?.mainStars?.join('、') || '空宫' }}</p>
            <p v-if="selP?.minorStars?.length">辅星：{{ selP.minorStars.join('、') }}</p>
            <p v-if="selP?.decadal">大限：{{ selP.decadal }}</p>
            <p v-if="selP?.ages?.length">小限：{{ selP.ages.join('、') }}</p>
          </div>
        </div>
        <div class="scroll-panel rounded-lg p-3">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">大限</h3>
          <div class="text-xs space-y-0.5">
            <div v-for="p in limits" :key="p.n" class="flex justify-between">{{ p.n }}<span class="text-gray-500">{{ p.d }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-400">
    <p>请先录入生辰排盘</p>
    <router-link to="/" class="text-zheshi underline mt-2 inline-block text-sm">去录入</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChartStore } from '../stores/chart'
import ZiweiPlate from '../components/ZiweiPlate.vue'

const store = useChartStore()
if ((window as any).__CHART_DATA) store.chartResult = (window as any).__CHART_DATA
const chart = computed(() => store.chartResult)
const fp = computed(() => chart.value?.fourPillars)

const selIdx = ref<number | null>(null)
const selP = computed(() => {
  if (selIdx.value === null || !chart.value?.palaces) return null
  return chart.value.palaces.find((p:any) => p.branchIndex === selIdx.value) || null
})

const limits = computed(() => 
  (chart.value?.palaces || []).filter((p:any) => p.decadal).map((p:any) => ({ n: p.name, d: p.decadal }))
)
</script>
