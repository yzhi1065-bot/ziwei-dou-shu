<template>
  <div class="max-w-6xl mx-auto">
    <!-- 顶部信息 -->
    <div v-if="chart" class="mb-6">
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <h2 class="text-xl font-song font-bold text-mose">本命盘</h2>
        <div class="flex items-center gap-3 text-sm text-gray-600">
          <span class="bg-mibai px-2 py-1 rounded border border-gray-200">
            四柱：<strong>{{ chart.fourPillars.year }} {{ chart.fourPillars.month }} {{ chart.fourPillars.day }} {{ chart.fourPillars.hour }}</strong>
          </span>
          <span class="bg-mibai px-2 py-1 rounded border border-gray-200">
            五行局：<strong>{{ chart.elementPhase }}</strong>
          </span>
          <span class="bg-mibai px-2 py-1 rounded border border-gray-200">
            命主：<strong>{{ chart.mingMaster }}</strong>
          </span>
          <span class="bg-mibai px-2 py-1 rounded border border-gray-200">
            身主：<strong>{{ chart.shenMaster }}</strong>
          </span>
        </div>
      </div>

      <!-- 主区：左盘右信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 左：方盘 -->
        <div class="lg:col-span-3 scroll-panel rounded-lg p-4 flex justify-center">
          <ZiweiPlate :palaces="chart.palaces" :size="480"
            :fourPillars="chart.fourPillars"
            :elementPhase="chart.elementPhase"
            :mingMaster="chart.mingMaster"
            :shenMaster="chart.shenMaster"
            :huaMap="huaMap"
            @select-palace="selectedPalace = $event"
            @select-star="selectedStar = $event" />
        </div>

        <!-- 右：信息侧栏 -->
        <div class="lg:col-span-2 space-y-4">
          <!-- 宫位详情 -->
          <div class="scroll-panel rounded-lg p-4">
            <h3 class="font-song font-bold text-mose border-b border-gray-200 pb-2 mb-3">
              {{ selectedPalace !== null ? chart.palaces[selectedPalace].name : '宫位详情' }}
            </h3>
            <div v-if="selectedPalace !== null" class="space-y-2 text-sm">
              <p><span class="text-gray-500">干支：</span>{{ chart.palaces[selectedPalace].stem }}{{ chart.palaces[selectedPalace].branch }}</p>
              <p><span class="text-gray-500">主星：</span>
                <span v-if="chart.palaces[selectedPalace].mainStars.length === 0" class="text-gray-400 italic">空宫</span>
                <span v-else>{{ chart.palaces[selectedPalace].mainStars.map(getStarName).join('、') }}</span>
              </p>
              <p v-if="chart.palaces[selectedPalace].minorStars.length"><span class="text-gray-500">辅星：</span>{{ chart.palaces[selectedPalace].minorStars.map(getStarName).join('、') }}</p>
              <p v-if="chart.palaces[selectedPalace].shaStars.length"><span class="text-gray-500">煞星：</span>{{ chart.palaces[selectedPalace].shaStars.map(getStarName).join('、') }}</p>
              <p v-if="chart.palaces[selectedPalace].hua.length"><span class="text-gray-500">四化：</span>{{ chart.palaces[selectedPalace].hua.join('、') }}</p>
            </div>
            <div v-else class="text-gray-400 text-sm italic">点击盘面宫位查看详情</div>
          </div>

          <!-- 本命四化 -->
          <div class="scroll-panel rounded-lg p-4">
            <h3 class="font-song font-bold text-mose border-b border-gray-200 pb-2 mb-3">本命四化</h3>
            <div class="space-y-1 text-sm">
              <div v-for="hua in chart.hua" :key="hua.starId" class="flex items-center gap-2">
                <span :class="`inline-block w-4 h-4 rounded-full text-xs text-center text-white`"
                      :style="{ backgroundColor: huaColor(hua.type) }">{{ hua.type }}</span>
                <span>{{ getStarName(hua.starId) }}</span>
                <span class="text-gray-400">({{ getPalaceName(hua.palaceIndex) }})</span>
              </div>
            </div>
          </div>

          <!-- 大限简表 -->
          <div class="scroll-panel rounded-lg p-4">
            <h3 class="font-song font-bold text-mose border-b border-gray-200 pb-2 mb-3">大限</h3>
            <div class="space-y-1 text-xs">
              <div v-for="(limit, li) in chart.greatLimits" :key="li" class="flex justify-between">
                <span>{{ getPalaceName(limit.palaceIndex) }} [{{ limit.stem }}{{ limit.branch }}]</span>
                <span class="text-gray-500">{{ limit.startAge }}~{{ limit.endAge }}岁</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-else class="text-center py-20 text-gray-400">
      <p class="text-2xl mb-2">✦</p>
      <p>请先录入生辰信息排盘</p>
      <router-link to="/" class="text-zheshi hover:underline mt-2 inline-block">去录入 →</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChartStore } from '../stores/chart'
import { PALACE_NAMES } from '../../../core/types'
import type { HuaType } from '../../../core/types'
import { STAR_NAMES } from '../../../core/stars-data/star-names'
import ZiweiPlate from '../components/ZiweiPlate.vue'

const chartStore = useChartStore()
const chart = chartStore.chartResult

const selectedPalace = ref<number | null>(null)
const selectedStar = ref<string | null>(null)

const huaMap = computed<Record<string, HuaType>>(() => {
  const map: Record<string, HuaType> = {}
  if (chart.value) {
    chart.value.hua.forEach(h => { map[h.starId] = h.type })
  }
  return map
})

function getStarName(id: string): string {
  return STAR_NAMES[id]?.nameCn || id
}

function getPalaceName(branchIndex: number): string {
  const c = chart.value
  if (!c) return ''
  const p = c.palaces.find(p => p.branchIndex === branchIndex)
  return p?.name || ''
}

const huaColorMap: Record<string, string> = {
  '禄': '#e74c3c',
  '权': '#8e44ad',
  '科': '#2980b9',
  '忌': '#1a1a2e',
}
function huaColor(type: HuaType): string {
  return huaColorMap[type] || '#999'
}
</script>
