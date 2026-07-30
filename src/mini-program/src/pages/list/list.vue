<template>
  <view class="list-page">
    <view class="empty-state" v-if="records.length === 0">
      <text class="empty-icon">✦</text>
      <text class="empty-text">暂无历史记录</text>
      <text class="empty-hint">排盘后自动保存</text>
    </view>

    <view class="record-list" v-else>
      <view class="record-item" v-for="(r, idx) in records" :key="idx" @tap="viewRecord(r)">
        <view class="record-info">
          <text class="record-date">{{ r.date }}</text>
          <text class="record-time">{{ r.time }}</text>
          <text class="record-gender">{{ r.gender === '男' ? '♂' : '♀' }}</text>
        </view>
        <text class="record-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const records = ref([])

onMounted(() => {
  try {
    const data = uni.getStorageSync('ziwei_records')
    records.value = data ? JSON.parse(data) : []
  } catch(e) {
    records.value = []
  }
})

function viewRecord(r) {
  getApp().globalData.chartInput = r.input
  uni.navigateTo({ url: '/pages/chart/chart' })
}
</script>

<style>
.list-page { padding: 20rpx; }
.empty-state { text-align: center; padding: 120rpx 0; }
.empty-icon { font-size: 60rpx; color: #D4A017; display: block; }
.empty-text { font-size: 28rpx; color: #999; margin: 16rpx 0; }
.empty-hint { font-size: 24rpx; color: #ccc; }

.record-list { display: flex; flex-direction: column; gap: 12rpx; }
.record-item { display: flex; align-items: center; justify-content: space-between; padding: 24rpx; background: #F0E8D0; border-radius: 12rpx; }
.record-info { display: flex; align-items: center; gap: 16rpx; }
.record-date { font-size: 28rpx; color: #1A1A2E; }
.record-time { font-size: 24rpx; color: #999; }
.record-gender { font-size: 28rpx; color: #CC7722; }
.record-arrow { font-size: 36rpx; color: #999; }
</style>
