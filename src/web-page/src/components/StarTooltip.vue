<template>
  <Transition name="fade">
    <div v-if="starId" class="scroll-panel rounded-lg p-3 shadow-lg text-sm max-w-[220px]"
         :style="{ position: 'absolute', left: x + 'px', top: y + 'px', zIndex: 100 }">
      <div class="font-bold text-mose border-b border-gray-200 pb-1 mb-1 flex items-center gap-2">
        <span>{{ starData?.name || starId }}</span>
        <span class="text-xs text-gray-400">{{ starData?.nameEn }}</span>
      </div>
      <div class="space-y-0.5 text-xs text-gray-600">
        <p>{{ starData?.group }} · {{ starData?.element }} · {{ starData?.yinyang }}</p>
        <p :class="starData?.luck === '吉' ? 'text-green-700' : starData?.luck === '凶' ? 'text-red-700' : 'text-gray-500'">
          {{ luckLabel }}
        </p>
        <p class="text-gray-500 mt-1">{{ starData?.description }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MAIN_STARS } from '@core/stars-data/main-stars'
import type { MainStarData } from '@core/stars-data/main-stars'

const props = defineProps<{
  starId: string | null
  x: number
  y: number
}>()

const starData = computed<MainStarData | undefined>(() => {
  return props.starId ? MAIN_STARS[props.starId] : undefined
})

const luckLabel = computed(() => {
  if (!starData.value) return ''
  const map: Record<string, string> = {
    '吉': '★ 吉星',
    '凶': '★ 凶星',
    '平': '☆ 平星',
    '吉带煞': '★ 吉带煞',
    '煞带吉': '★ 煞带吉',
  }
  return map[starData.value.luck] || ''
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
