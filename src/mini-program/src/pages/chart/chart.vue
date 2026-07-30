<template>
  <view class="chart-page">
    <!-- 盘面信息 -->
    <view v-if="chart" class="info-row">
      <view class="info-item"><text class="info-label">四柱</text><text class="info-value">{{ chart.fourPillars.year }} {{ chart.fourPillars.month }} {{ chart.fourPillars.day }} {{ chart.fourPillars.hour }}</text></view>
      <view class="info-item"><text class="info-label">五行局</text><text class="info-value">{{ chart.elementPhase }}</text></view>
      <view class="info-item"><text class="info-label">命主</text><text class="info-value">{{ chart.mingMaster }}</text></view>
      <view class="info-item"><text class="info-label">身主</text><text class="info-value">{{ chart.shenMaster }}</text></view>
    </view>

    <!-- 盘面Canvas (简化) -->
    <view class="plate-card">
      <canvas canvas-id="plateCanvas" class="plate-canvas"></canvas>
    </view>

    <!-- 宫位列表 -->
    <view class="palace-list">
      <view class="palace-item" v-for="(p, idx) in palaces" :key="idx" @tap="selectPalace(idx)">
        <view class="palace-header">
          <text class="palace-name">{{ p.name }}</text>
          <text class="palace-ganzhi">{{ p.stem }}{{ p.branch }}</text>
        </view>
        <view class="palace-stars">
          <text class="star-main" v-for="s in p.mainStars" :key="s">{{ getStarName(s) }}</text>
          <text class="star-minor" v-for="s in p.minorStars" :key="s">{{ getStarName(s) }}</text>
          <text class="star-sha" v-for="s in p.shaStars" :key="s">{{ getStarName(s) }}</text>
          <text v-if="p.mainStars.length === 0 && p.minorStars.length === 0" class="empty-star">空宫</text>
        </view>
      </view>
    </view>

    <!-- 无数据 -->
    <view v-if="!chart" class="empty-state">
      <text class="empty-icon">✦</text>
      <text class="empty-text">请先录入生辰</text>
      <button class="back-btn" @tap="goBack">去录入 →</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const app = getApp()
const chartInput = app.globalData.chartInput

// 这里使用core算法 - 导入打包后的UMD
// 实际导入方式见mini-program/src/utils/ziwei-core.umd.js
let chart = ref(null)
let palaces = ref([])

onMounted(() => {
  if (chartInput && typeof ZiweiCore !== 'undefined') {
    try {
      const result = ZiweiCore.createChart({
        year: chartInput.year,
        month: chartInput.month,
        day: chartInput.day,
        hour: chartInput.hour,
        minute: chartInput.minute,
        gender: chartInput.gender,
        school: 'sanhe',
      })
      chart.value = result
      palaces.value = result.palaces
      drawPlate(result)
    } catch(e) {
      console.error('排盘失败:', e)
    }
  }
})

function getStarName(id) {
  if (!id) return ''
  // 简化：使用预置名称映射
  const names = {
    'ziwei': '紫微','tianji': '天机','taiyang': '太阳','wuqu': '武曲',
    'tiantong': '天同','lianzhen': '廉贞','tianfu': '天府','taiyin': '太阴',
    'tanlang': '贪狼','jumen': '巨门','tianxiang': '天相','tianliang': '天梁',
    'qisha': '七杀','pojun': '破军','zuobi': '左辅','youbi': '右弼',
    'wenchang': '文昌','wenqu': '文曲','tiankui': '天魁','tianyue': '天钺',
    'lucun': '禄存','tianma': '天马','qingyang': '擎羊','tuoluo': '陀罗',
    'huoxing': '火星','lingxing': '铃星','dikong': '地空','dijie': '地劫',
  }
  return names[id] || id
}

function drawPlate(result) {
  const ctx = uni.createCanvasContext('plateCanvas')
  const cx = 175, cy = 175, r = 150
  
  ctx.setStrokeStyle('#CC7722')
  ctx.setLineWidth(2)
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)
  ctx.stroke()
  
  // 画十二宫
  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 - 90) * Math.PI / 180
    const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180
    
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle))
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.closePath()
    ctx.setFillStyle(i === 0 ? 'rgba(212,160,23,0.08)' : 'transparent')
    ctx.setStrokeStyle('#c4b998')
    ctx.setLineWidth(0.5)
    ctx.fill()
    ctx.stroke()
    
    // 宫名
    const midAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180
    ctx.setFillStyle('#8B4513')
    ctx.setFontSize(10)
    const name = result.palaces[i].name
    ctx.fillText(name, cx + r * 0.38 * Math.cos(midAngle) - 10, cy + r * 0.38 * Math.sin(midAngle) + 4)
    
    // 主星
    const stars = result.palaces[i].mainStars
    stars.forEach((starId, si) => {
      const offset = (si - (stars.length - 1) / 2) * 0.03
      const sa = midAngle + offset
      ctx.setFillStyle('#1A1A2E')
      ctx.setFontSize(11)
      ctx.fillText(getStarName(starId), cx + r * 0.65 * Math.cos(sa) - 8, cy + r * 0.65 * Math.sin(sa) + 4)
    })
  }
  
  // 中心文字
  ctx.setFillStyle('#8B4513')
  ctx.setFontSize(12)
  ctx.fillText('紫微', cx - 10, cy - 4)
  ctx.fillText('斗数', cx - 10, cy + 12)
  
  ctx.draw()
}

function selectPalace(idx) {
  if (!chart.value) return
  const p = chart.value.palaces[idx]
  uni.showModal({
    title: p.name,
    content: `干支：${p.stem}${p.branch}\n主星：${p.mainStars.map(getStarName).join(' ') || '空宫'}\n辅星：${p.minorStars.map(getStarName).join(' ') || '无'}`,
    showCancel: false,
  })
}

function goBack() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style>
.chart-page { padding: 20rpx; }
.info-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 20rpx; }
.info-item { background: #F0E8D0; padding: 12rpx 16rpx; border-radius: 8rpx; }
.info-label { font-size: 20rpx; color: #999; display: block; }
.info-value { font-size: 24rpx; color: #1A1A2E; font-weight: bold; }

.plate-card { background: #F0E8D0; border-radius: 16rpx; padding: 20rpx; margin-bottom: 20rpx; display: flex; justify-content: center; }
.plate-canvas { width: 350rpx; height: 350rpx; }

.palace-list { display: flex; flex-direction: column; gap: 6rpx; }
.palace-item { display: flex; align-items: center; padding: 12rpx 16rpx; background: white; border-radius: 8rpx; border-left: 6rpx solid #D4A017; }
.palace-header { width: 120rpx; flex-shrink: 0; }
.palace-name { font-size: 26rpx; font-weight: bold; color: #8B4513; }
.palace-ganzhi { font-size: 20rpx; color: #999; }
.palace-stars { display: flex; flex-wrap: wrap; gap: 6rpx; }
.star-main { font-size: 24rpx; color: #1A1A2E; font-weight: bold; }
.star-minor { font-size: 22rpx; color: #666; }
.star-sha { font-size: 22rpx; color: #999; }
.empty-star { font-size: 22rpx; color: #ccc; font-style: italic; }

.empty-state { text-align: center; padding: 100rpx 0; }
.empty-icon { font-size: 60rpx; color: #D4A017; display: block; }
.empty-text { font-size: 28rpx; color: #999; margin: 20rpx 0; }
.back-btn { background: #CC7722; color: white; padding: 16rpx 40rpx; border-radius: 8rpx; font-size: 28rpx; }
</style>
