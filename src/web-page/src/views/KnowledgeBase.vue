<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-song font-bold text-mose mb-6">知识库</h2>
    
    <div class="scroll-panel rounded-lg p-6 mb-4">
      <h3 class="font-song font-bold text-lg text-mose border-b border-gray-200 pb-2 mb-4">14主星</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3" v-if="mainStars.length">
        <div v-for="star in mainStars.slice(0,14)" :key="star.id"
             class="p-3 rounded bg-white/50 border border-gray-100 hover:border-zheshi cursor-pointer transition-colors"
             @click="selectedStarId = star.id">
          <div class="font-bold text-sm">{{ star.nameCn }}</div>
          <div class="text-xs text-gray-400">{{ star.nameEn }}</div>
        </div>
      </div>
    </div>

    <!-- 星曜详情弹窗 -->
    <div v-if="selectedStarId" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
         @click.self="selectedStarId = ''">
      <div class="scroll-panel rounded-lg p-6 max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-song font-bold text-lg">{{ currentStar?.name || '' }}</h3>
          <button @click="selectedStarId = ''" class="text-gray-400 hover:text-mose text-xl">&times;</button>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="text-gray-500">英文名：</span>{{ currentStar?.nameEn }}</p>
          <p><span class="text-gray-500">星曜属性：</span>{{ currentStar?.group }} · {{ currentStar?.element }} · {{ currentStar?.yinyang }}</p>
          <p><span class="text-gray-500">吉凶：</span>{{ currentStar?.luck }}</p>
          <p class="text-gray-600 leading-relaxed mt-3">{{ currentStar?.description }}</p>
          <p v-if="currentStar?.symbolism" class="flex flex-wrap gap-1 mt-2">
            <span v-for="s in currentStar?.symbolism" :key="s"
                  class="text-xs bg-mibai px-2 py-0.5 rounded border border-gray-200">{{ s }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="text-center py-6 text-sm text-gray-400">
      更多内容（格局释义、辅煞星详解）开发中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MAIN_STARS, getAllMainStars } from '../../../core/stars-data/main-stars'

const mainStars = getAllMainStars()
const selectedStarId = ref('')

const currentStar = computed(() => MAIN_STARS[selectedStarId.value])
</script>
