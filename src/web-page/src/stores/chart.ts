import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChartResult, Gender, School } from '../../../core/types'
import { createChart } from '../../../core/chart'

export const useChartStore = defineStore('chart', () => {
  const chartResult = ref<ChartResult | null>(null)
  const currentYear = ref(new Date().getFullYear())

  function generateChart(
    year: number, month: number, day: number,
    hour: number, minute: number,
    gender: Gender = '男',
    school: School = 'sanhe',
    longitude?: number
  ) {
    chartResult.value = createChart({
      year, month, day, hour, minute,
      gender, school, longitude, isLunar: false
    })
  }

  function setCurrentYear(year: number) {
    currentYear.value = year
  }

  return { chartResult, currentYear, generateChart, setCurrentYear }
})
