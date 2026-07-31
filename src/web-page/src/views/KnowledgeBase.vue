<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-song font-bold text-mose mb-4">紫微知识库</h2>
    <div class="text-xs text-gray-400 mb-3">数据来源：iztro + ziwei-doushu (MIT) · 含经典古籍原文</div>

    <!-- Tab切换 -->
    <div class="flex gap-1 mb-4">
      <button v-for="t in tabs" :key="t.k" @click="tab=t.k"
        class="px-4 py-1.5 text-sm rounded" :class="tab===t.k ? 'bg-zheshi text-white' : 'bg-mibai text-gray-600'">{{ t.n }}</button>
    </div>

    <!-- ═══ 星曜 ═══ -->
    <div v-if="tab==='star'">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div v-for="s in stars" :key="s.id" class="p-2 rounded bg-white/60 border hover:border-zheshi cursor-pointer text-center"
             @click="selStar=s.id">
          <div class="font-bold text-sm">{{ s.name }}</div>
          <div class="text-xs text-gray-400">{{ s.en }}</div>
        </div>
      </div>
      <div v-if="curStar" class="scroll-panel rounded-lg p-4">
        <h3 class="font-bold text-base border-b pb-2 mb-3">{{ curStar.name }} <small class="text-gray-400 font-normal">{{ curStar.nameEn }}</small></h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
          <div class="bg-mibai rounded p-2"><div class="text-gray-400">阴阳</div><b>{{ curStar.yinYang }}</b></div>
          <div class="bg-mibai rounded p-2"><div class="text-gray-400">五行</div><b>{{ curStar.element }}</b></div>
          <div class="bg-mibai rounded p-2"><div class="text-gray-400">所属</div><b>{{ curStar.group }}</b></div>
        </div>
        <div class="text-sm leading-relaxed text-gray-700">
          <p>{{ curStar.description }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ 经典古籍 ═══ -->
    <div v-if="tab==='classic'">
      <!-- 搜索 -->
      <div class="scroll-panel rounded-lg p-3 mb-3 flex gap-2 items-center">
        <input v-model="kw" placeholder="搜索古籍原文…（如：紫微 天府 化忌）"
          class="flex-1 border rounded px-3 py-1.5 text-sm" />
        <button @click="doSearch" class="px-4 py-1.5 rounded bg-zheshi text-white text-sm">搜索</button>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchHits.length" class="scroll-panel rounded-lg p-4 mb-3">
        <h3 class="font-bold text-sm border-b pb-2 mb-2">搜索结果 ({{ searchHits.length }})</h3>
        <div class="space-y-2">
          <div v-for="h in searchHits" :key="h.paragraphId" class="text-xs border-b border-gray-100 pb-2">
            <div class="text-gray-500 mb-1">{{ h.bookTitle }} · {{ h.chapterTitle }}</div>
            <div class="text-gray-700 leading-relaxed" v-html="h.snippet"></div>
          </div>
        </div>
      </div>

      <!-- 书列表 -->
      <div v-for="book in books" :key="book.slug" class="scroll-panel rounded-lg p-4 mb-3">
        <div class="flex justify-between items-center mb-1 cursor-pointer" @click="toggleBook(book.slug)">
          <h3 class="font-bold text-base">{{ book.title }} <small class="text-gray-400 font-normal">{{ book.dynasty }} · {{ book.author }}</small></h3>
          <span class="text-gray-400 text-sm">{{ expanded[book.slug] ? '▾' : '▸' }}</span>
        </div>
        <p class="text-xs text-gray-500 mb-2">{{ book.intro }}</p>
        <div v-if="expanded[book.slug]">
          <div v-for="(ch, ci) in book.chapters" :key="ci" class="mb-3">
            <h4 class="font-bold text-sm text-mose mb-1">{{ ch.title }} <small class="text-gray-400 font-normal">{{ ch.subtitle }}</small></h4>
            <div class="space-y-1.5">
              <p v-for="p in ch.paragraphs" :key="p.id" class="text-sm leading-relaxed text-gray-700">
                <span class="text-gray-300 text-xs mr-1">{{ p.idx }}</span>{{ p.text }}
                <span v-if="p.niNote" class="block text-xs text-zheshi mt-0.5">倪师注：{{ p.niNote }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 倪海厦 ═══ -->
    <div v-if="tab==='nihai'">
      <div class="scroll-panel rounded-lg p-4 mb-3">
        <h3 class="font-bold text-base mb-2">倪海厦《天纪》紫微斗数</h3>
        <div class="text-sm leading-relaxed text-gray-700 space-y-2">
          <p v-for="(d,i) in nihaiZiwei.details" :key="i">{{ d }}</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <span v-for="k in nihaiZiwei.keywords" :key="k" class="bg-mibai px-2 py-0.5 rounded text-xs text-gray-600">{{ k }}</span>
        </div>
      </div>
      <div class="scroll-panel rounded-lg p-4">
        <h3 class="font-bold text-base border-b pb-2 mb-3">倪师名言</h3>
        <div class="space-y-2">
          <blockquote v-for="(q,i) in nihaiQuotes" :key="i" class="border-l-4 border-zheshi/40 pl-3 py-1 text-sm text-gray-700">
            {{ q }}
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MAIN_STARS, getAllMainStars } from '../../../core/stars-data/main-stars'
import { ALL_BOOKS, searchClassics } from '../../../ziwei-doushu/classics'
import { TIANJI_MODULES, TIANJI_QUOTES } from '../../../ziwei-doushu/nihai'

const tabs = [
  { k: 'star', n: '星曜' },
  { k: 'classic', n: '经典古籍' },
  { k: 'nihai', n: '倪海厦' },
]
const tab = ref('star')

// === 星曜 ===
const stars = getAllMainStars().map(s => ({ id: s.id, name: s.name, en: s.nameEn }))
const selStar = ref('')
const curStar = computed(() => stars.find(s => s.id === selStar.value) ? MAIN_STARS[selStar.value] : null)

// === 经典古籍 ===
const books = ref(ALL_BOOKS as any[])
const expanded = ref<Record<string, boolean>>({})
const kw = ref('')
const searchHits = ref<any[]>([])
function toggleBook(slug: string) { expanded.value[slug] = !expanded.value[slug] }
function doSearch() {
  searchHits.value = searchClassics(kw.value, 30)
}

// === 倪海厦 ===
const nihaiZiwei = computed(() => TIANJI_MODULES.find((m: any) => m.slug === 'ziwei') || TIANJI_MODULES[0])
const nihaiQuotes = computed(() => (TIANJI_QUOTES || []).slice(0, 12))
</script>
