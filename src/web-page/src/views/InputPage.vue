<template>
  <div class="max-w-2xl mx-auto">
    <!-- 标题装饰 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-song font-bold text-mose mb-2 tracking-wider">
        紫微斗数排盘
      </h1>
      <p class="text-gray-500 text-sm">Zǐ Wēi Dòu Shù · Fortune Telling System</p>
      <div class="w-24 h-0.5 bg-jinbo mx-auto mt-4"></div>
    </div>

    <!-- 录入表单 -->
    <div class="scroll-panel rounded-lg p-6 md:p-8">
      <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 第一行：历法切换 + 年月日 -->
      <div class="flex items-center gap-3 mb-3">
        <div class="flex rounded overflow-hidden border border-gray-300 text-sm">
          <button type="button" @click="form.isLunar=false; syncLunar()"
            class="px-3 py-1" :class="!form.isLunar ? 'bg-zheshi text-white' : 'bg-white text-gray-600'">公历</button>
          <button type="button" @click="form.isLunar=true; syncLunar()"
            class="px-3 py-1" :class="form.isLunar ? 'bg-zheshi text-white' : 'bg-white text-gray-600'">农历</button>
        </div>
        <span class="text-xs text-gray-400" v-if="form.isLunar">输入农历年月日，自动转公历排盘</span>
        <span class="text-xs text-gray-400" v-else>输入公历（阳历）生辰</span>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">{{ form.isLunar ? '农历年' : '年' }}</label>
          <input v-model.number="form.year" type="number" min="1901" max="2100"
                 class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none"
                 placeholder="1990" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">{{ form.isLunar ? '农历月' : '月' }}</label>
          <select v-model.number="form.month"
                  class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none">
            <option v-for="i in 12" :key="i" :value="i">{{ i }}月</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">{{ form.isLunar ? '农历日' : '日' }}</label>
          <select v-model.number="form.day"
                  class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none">
            <option v-for="i in 30" :key="i" :value="i">{{ i }}日</option>
          </select>
        </div>
      </div>

      <!-- 第二行：时分 -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">时 (0~23)</label>
          <input v-model.number="form.hour" type="number" min="0" max="23"
                 class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none"
                 placeholder="12" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">分 (0~59)</label>
          <input v-model.number="form.minute" type="number" min="0" max="59"
                 class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none"
                 placeholder="0" />
        </div>
      </div>

        <!-- 第三行：性别和流派 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1 font-song">性别</label>
            <select v-model="form.gender"
                    class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1 font-song">流派</label>
            <select v-model="form.school"
                    class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none">
              <option value="sanhe">三合派（默认）</option>
              <option value="feixing">飞星派</option>
              <option value="sihua">四化派（钦天）</option>
              <option value="nishi">倪海厦派</option>
            </select>
          </div>
        </div>

        <!-- 出生地点（真太阳时） -->
        <div>
          <label class="block text-sm text-gray-600 mb-1 font-song">出生地点 <span class="text-gray-400 text-xs">（真太阳时修正时辰）</span></label>
          <select v-model="form.longitude"
                  class="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-jinbo outline-none">
            <option :value="120">北京（东经120°·标准时间）</option>
            <option v-for="c in cities" :key="c.city" :value="c.longitude">{{ c.city }}（东经{{ c.longitude }}°）</option>
          </select>
        </div>

        <!-- 提交按钮 -->
        <button type="submit"
                class="w-full py-3 rounded-lg text-white font-song text-lg tracking-wider transition-all duration-300"
                style="background: linear-gradient(135deg, #B22222 0%, #8B0000 100%)"
                @mouseenter="($event.target as HTMLElement).style.background = 'linear-gradient(135deg, #CC7722 0%, #B22222 100%)'"
                @mouseleave="($event.target as HTMLElement).style.background = 'linear-gradient(135deg, #B22222 0%, #8B0000 100%)'">
          开始排盘
        </button>
      </form>
    </div>

    <!-- 快速示例 -->
    <div class="mt-6 text-center">
      <span class="text-xs text-gray-400">快速示例：</span>
      <button v-for="ex in examples" :key="ex.label"
              @click="fillExample(ex)"
              class="text-xs text-zheshi hover:text-jinbo mx-1 underline decoration-dotted">
        {{ ex.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useChartStore } from '../stores/chart'
import type { Gender, School } from '@core/types'
import { solarToLunar, lunarToSolar } from '@core/calendar/lunar'
import { CITY_LOCATIONS } from '@core/calendar/timezone'

const router = useRouter()
const chartStore = useChartStore()

const form = reactive({
  year: new Date().getFullYear() - 30,
  month: 6,
  day: 15,
  hour: 12,
  minute: 0,
  gender: '男' as Gender,
  school: 'sanhe' as School,
  isLunar: false,
  longitude: 120,
})

const cities = CITY_LOCATIONS.slice(0, 36)

// 农历↔公历切换时保持日期一致
function syncLunar() {
  if (form.isLunar) {
    // 切到农历：显示当前公历对应的农历
    const l = solarToLunar(form.year, form.month, form.day)
    form.year = l.year
    form.month = l.month
    form.day = l.day
  } else {
    // 切回公历：显示农历对应的公历
    const s = lunarToSolar(form.year, form.month, form.day)
    form.year = s.year
    form.month = s.month
    form.day = s.day
  }
}

const examples = [
  { label: '甲辰年春节', year: 2024, month: 2, day: 10, hour: 0, minute: 0, gender: '男' as Gender },
  { label: '1990年8月', year: 1990, month: 8, day: 30, hour: 12, minute: 0, gender: '男' as Gender },
  { label: '千禧年元旦', year: 2000, month: 1, day: 1, hour: 0, minute: 0, gender: '女' as Gender },
]

function fillExample(ex: typeof examples[0]) {
  form.year = ex.year
  form.month = ex.month
  form.day = ex.day
  form.hour = ex.hour
  form.minute = ex.minute
  form.gender = ex.gender
}

async function handleSubmit() {
  // 农历输入时先转公历
  let sy = form.year, sm = form.month, sd = form.day
  if (form.isLunar) {
    const s = lunarToSolar(form.year, form.month, form.day)
    sy = s.year; sm = s.month; sd = s.day
  }
  await chartStore.generateChart(
    sy, sm, sd,
    form.hour, form.minute,
    form.gender, form.school,
    form.longitude
  )
  router.push('/chart')
}
</script>
