<template>
  <view class="input-page">
    <!-- 标题 -->
    <view class="title-section">
      <text class="title-icon">✦</text>
      <text class="title-text">紫微斗数排盘</text>
      <view class="title-line"></view>
    </view>

    <!-- 表单 -->
    <view class="form-card">
      <!-- 日期 -->
      <view class="form-row">
        <view class="form-item">
          <text class="label">年</text>
          <input class="input" type="number" v-model="year" placeholder="1990" />
        </view>
        <view class="form-item">
          <text class="label">月</text>
          <input class="input" type="number" v-model="month" placeholder="8" />
        </view>
        <view class="form-item">
          <text class="label">日</text>
          <input class="input" type="number" v-model="day" placeholder="30" />
        </view>
      </view>

      <!-- 时间 -->
      <view class="form-row">
        <view class="form-item">
          <text class="label">时</text>
          <input class="input" type="number" v-model="hour" placeholder="12" />
        </view>
        <view class="form-item">
          <text class="label">分</text>
          <input class="input" type="number" v-model="minute" placeholder="0" />
        </view>
      </view>

      <!-- 性别 -->
      <view class="form-row">
        <text class="label">性别</text>
        <view class="radio-group">
          <view class="radio-item" :class="{ active: gender === '男' }" @tap="gender='男'">
            <text>男</text>
          </view>
          <view class="radio-item" :class="{ active: gender === '女' }" @tap="gender='女'">
            <text>女</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @tap="handleSubmit">开始排盘</button>
    </view>

    <!-- 快速示例 -->
    <view class="examples">
      <text class="examples-title">快速示例：</text>
      <view class="example-tags">
        <text class="example-tag" @tap="fillExample(2024,2,10,0,0,'男')">甲辰年春节</text>
        <text class="example-tag" @tap="fillExample(1990,8,30,12,0,'男')">1990年8月</text>
        <text class="example-tag" @tap="fillExample(2000,1,1,0,0,'女')">千禧年元旦</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const year = ref(new Date().getFullYear() - 30)
const month = ref(6)
const day = ref(15)
const hour = ref(12)
const minute = ref(0)
const gender = ref('男')

function fillExample(y, m, d, h, mi, g) {
  year.value = y
  month.value = m
  day.value = d
  hour.value = h
  minute.value = mi
  gender.value = g
}

function handleSubmit() {
  const chartInput = {
    year: year.value,
    month: month.value,
    day: day.value,
    hour: hour.value,
    minute: minute.value,
    gender: gender.value,
  }
  // 存储到全局，跳转到命盘页
  getApp().globalData.chartInput = chartInput
  uni.navigateTo({ url: '/pages/chart/chart' })
}
</script>

<style>
.input-page { padding: 20rpx; }
.title-section { text-align: center; margin-bottom: 40rpx; }
.title-icon { font-size: 48rpx; color: #D4A017; }
.title-text { display: block; font-size: 36rpx; font-weight: bold; color: #1A1A2E; margin: 10rpx 0; }
.title-line { width: 120rpx; height: 4rpx; background: #D4A017; margin: 10rpx auto; }

.form-card { background: linear-gradient(to bottom, #F0E8D0, #F8F4E6); border-radius: 16rpx; padding: 30rpx; margin-bottom: 30rpx; }
.form-row { display: flex; gap: 20rpx; margin-bottom: 24rpx; align-items: center; }
.form-item { flex: 1; }
.label { display: block; font-size: 24rpx; color: #666; margin-bottom: 8rpx; }
.input { width: 100%; height: 72rpx; background: white; border: 2rpx solid #ddd; border-radius: 8rpx; padding: 0 16rpx; font-size: 28rpx; box-sizing: border-box; }

.radio-group { display: flex; gap: 20rpx; }
.radio-item { padding: 12rpx 36rpx; border: 2rpx solid #ccc; border-radius: 8rpx; font-size: 28rpx; }
.radio-item.active { border-color: #B22222; color: #B22222; background: rgba(178,34,34,0.05); }

.submit-btn { width: 100%; height: 88rpx; background: linear-gradient(135deg, #B22222, #8B0000); color: white; font-size: 32rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; margin-top: 20rpx; }
.submit-btn:active { opacity: 0.8; }

.examples { text-align: center; }
.examples-title { font-size: 24rpx; color: #999; }
.example-tags { display: flex; justify-content: center; gap: 16rpx; margin-top: 12rpx; flex-wrap: wrap; }
.example-tag { font-size: 24rpx; color: #CC7722; text-decoration: underline; text-decoration-style: dotted; }
</style>
