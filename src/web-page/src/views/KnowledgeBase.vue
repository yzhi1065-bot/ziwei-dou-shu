<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-song font-bold text-mose mb-6">紫微知识库</h2>
    <div class="text-xs text-gray-400 mb-4">数据来源：iztro + Renhuai123/ziwei-doushu (MIT)</div>

    <div class="scroll-panel rounded-lg p-4 mb-4">
      <h3 class="font-song font-bold text-sm text-mose border-b pb-1 mb-3">14主星</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div v-for="s in stars" :key="s.id" class="p-2 rounded bg-white/50 border hover:border-zheshi cursor-pointer text-center"
             @click="sel=s.id">
          <div class="font-bold text-sm">{{ s.name }}</div>
          <div class="text-xs text-gray-400">{{ s.en }}</div>
        </div>
      </div>
    </div>

    <div v-if="selStar" class="scroll-panel rounded-lg p-4 mb-4">
      <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ selStar.nameCn }} ({{ selStar.en }})</h3>
      <div class="text-xs space-y-1">
        <p><span class="text-gray-500">属性：</span>{{ selStar.group }} · {{ selStar.element }} · {{ selStar.yinYang }}</p>
        <p><span class="text-gray-500">特性：</span>{{ selStar.keywords || '' }}</p>
        <p class="text-gray-600 mt-2">{{ selStar.description }}</p>
      </div>
    </div>

    <div class="scroll-panel rounded-lg p-4">
      <h3 class="font-song font-bold text-sm text-mose border-b pb-1 mb-3">经典古籍</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div v-for="b in books" :key="b.n" class="p-3 rounded bg-white/50 border hover:border-zheshi cursor-pointer"
             @click="selBook=b.n">
          <div class="font-bold text-xs">{{ b.n }}</div>
          <div class="text-xs text-gray-400">{{ b.d }}</div>
        </div>
      </div>
      <div v-if="selBook" class="mt-3 p-3 bg-mibai rounded text-xs leading-relaxed max-h-60 overflow-y-auto">
        <p v-for="(l,i) in bookContent" :key="i">{{ l }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MAIN_STARS, getAllMainStars } from '../../../core/stars-data/main-stars'

const stars = getAllMainStars().map(s => ({ id: s.id, name: s.name, en: s.nameEn }))
const sel = ref('')
const selStar = computed(() => sel.value ? MAIN_STARS[sel.value] : null)

const books = [
  { n: '骨髓赋', d: '紫微斗数重要经典' },
  { n: '紫微斗数全集', d: '陈抟祖师传·明代刊本' },
  { n: '紫微斗数全书', d: '罗洪先编·明代刊本' },
]
const selBook = ref('')
const bookContent = computed(() => {
  try {
    const b = selBook.value
    if (b === '骨髓赋') return ['（古籍内容参考 src/ziwei-doushu/classics/data/gusuifu.ts）']
    if (b === '紫微斗数全集') return ['（古籍内容参考 src/ziwei-doushu/classics/data/quanji.ts）']
    if (b === '紫微斗数全书') return ['（古籍内容参考 src/ziwei-doushu/classics/data/quanshu.ts）']
  } catch {}
  return []
})
</script>
