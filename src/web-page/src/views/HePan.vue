<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-song font-bold text-mose mb-4">合盘分析</h2>
    <p class="text-xs text-gray-400 mb-4">输入双方生辰，对比命盘五行局、命宫主星、夫妻宫契合度</p>

    <!-- 双人输入 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div v-for="(p, pi) in persons" :key="pi" class="scroll-panel rounded-lg p-4">
        <h3 class="font-bold text-sm mb-2">{{ pi === 0 ? '👤 甲方' : '👤 乙方' }}</h3>
        <div class="grid grid-cols-3 gap-2 text-sm">
          <div><label class="text-xs text-gray-500">年</label><input v-model.number="p.year" type="number" class="w-full border rounded px-2 py-1" /></div>
          <div><label class="text-xs text-gray-500">月</label><input v-model.number="p.month" type="number" min="1" max="12" class="w-full border rounded px-2 py-1" /></div>
          <div><label class="text-xs text-gray-500">日</label><input v-model.number="p.day" type="number" min="1" max="31" class="w-full border rounded px-2 py-1" /></div>
          <div><label class="text-xs text-gray-500">时</label><input v-model.number="p.hour" type="number" min="0" max="23" class="w-full border rounded px-2 py-1" /></div>
          <div class="col-span-2">
            <label class="text-xs text-gray-500">性别</label>
            <select v-model="p.gender" class="w-full border rounded px-2 py-1">
              <option value="男">男</option><option value="女">女</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <button @click="calcHePan" class="w-full md:w-64 py-3 rounded-lg text-white font-song tracking-wider"
      style="background: linear-gradient(135deg, #B22222 0%, #8B0000 100%)">合盘分析</button>

    <!-- 结果 -->
    <div v-if="result" class="mt-6">
      <!-- 双方基础对比 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div v-for="(r, ri) in result.charts" :key="ri" class="scroll-panel rounded-lg p-4">
          <h3 class="font-bold text-sm border-b pb-1 mb-2">{{ ri === 0 ? '甲方' : '乙方' }}命盘</h3>
          <div class="text-xs space-y-1">
            <p>四柱：{{ r.fourPillars.year }} {{ r.fourPillars.month }} {{ r.fourPillars.day }} {{ r.fourPillars.hour }}</p>
            <p>五行局：<b class="text-zheshi">{{ r.elementPhase }}</b></p>
            <p>命宫主星：{{ r.mingStars.join('、') || '无主星' }}</p>
            <p>夫妻宫主星：{{ r.spouseStars.join('、') || '无主星' }}</p>
            <p>命主：{{ r.mingMaster }} · 身主：{{ r.shenMaster }}</p>
          </div>
        </div>
      </div>

      <!-- 合盘结论 -->
      <div class="scroll-panel rounded-lg p-4">
        <h3 class="font-bold text-sm border-b pb-1 mb-2">合盘结论</h3>
        <div class="space-y-2 text-sm text-gray-700">
          <p v-for="(c, i) in result.conclusions" :key="i">{{ c }}</p>
        </div>
        <div class="mt-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">契合度：</span>
            <div class="flex-1 bg-gray-200 rounded h-3 overflow-hidden">
              <div class="h-full" :style="{ width: result.score + '%', background: result.score >= 70 ? '#27AE60' : result.score >= 50 ? '#F39C12' : '#E74C3C' }"></div>
            </div>
            <b class="text-sm">{{ result.score }}分</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useChartStore } from '../stores/chart'

const store = useChartStore()
const persons = reactive([
  { year: 1990, month: 8, day: 30, hour: 12, gender: '男' },
  { year: 1992, month: 3, day: 15, hour: 14, gender: '女' },
])
const result = ref<any>(null)

async function calcHePan() {
  const charts = []
  for (const p of persons) {
    const r = await store.generateChart(p.year, p.month, p.day, p.hour, 0, p.gender, 'sanhe')
    const ming = r.palaces.find((pl: any) => pl.name === '命宫')
    const spouse = r.palaces.find((pl: any) => pl.name === '夫妻宫')
    charts.push({
      fourPillars: r.fourPillars,
      elementPhase: r.elementPhase,
      mingMaster: r.mingMaster,
      shenMaster: r.shenMaster,
      mingStars: ming?.mainStars.map((s: any) => s.name) || [],
      spouseStars: spouse?.mainStars.map((s: any) => s.name) || [],
    })
  }
  const [a, b] = charts
  // 简单评分：五行局相生+20，命宫主星相合+20，夫妻宫主星配对+20
  let score = 40
  const conclusions: string[] = []
  const wuxing: Record<string, string> = { 水: '木', 木: '火', 火: '土', 土: '金', 金: '水' }
  const pa = a.elementPhase[0], pb = b.elementPhase[0]
  if (pa === pb) { score += 15; conclusions.push(`双方五行局相同（${a.elementPhase}），同气相求，性格默契度较高。`) }
  else if (wuxing[pa] === pb) { score += 25; conclusions.push(`甲方${a.elementPhase}生乙方${b.elementPhase}，五行相生，彼此助益。`) }
  else if (wuxing[pb] === pa) { score += 20; conclusions.push(`乙方${b.elementPhase}生甲方${a.elementPhase}，五行相生，关系融洽。`) }
  else { score += 5; conclusions.push(`双方五行局为${a.elementPhase}与${b.elementPhase}，无生克关系，相处平淡。`) }

  const mingOverlap = a.mingStars.filter(s => b.spouseStars.includes(s))
  if (mingOverlap.length) { score += 15; conclusions.push(`甲方命宫星曜与乙方夫妻宫星曜呼应（${mingOverlap.join('、')}），缘分较强。`) }
  const spouseOverlap = a.spouseStars.filter(s => b.mingStars.includes(s))
  if (spouseOverlap.length) { score += 15; conclusions.push(`甲方夫妻宫星曜与乙方命宫星曜呼应（${spouseOverlap.join('、')}），彼此吸引。`) }

  score = Math.min(score, 100)
  conclusions.push(score >= 70 ? '总体来看双方契合度高，建议深入了解，好好珍惜。' : score >= 50 ? '双方有较深的缘分，但需互相包容磨合。' : '双方性格差异较大，相处需要更多耐心与理解。')
  result.value = { charts, conclusions, score }
}
</script>
