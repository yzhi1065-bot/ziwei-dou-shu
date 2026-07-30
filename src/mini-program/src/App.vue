<template>
  <view class="app-container">
    <slot />
  </view>
</template>

<script setup>
</script>

<style>
/* 全局国风样式 */
page {
  background-color: #F8F4E6;
  font-family: -apple-system, BlinkMacSystemFont, 'STSong', 'SimSun', serif;
  color: #1A1A2E;
}
.app-container {
  min-height: 100vh;
}
</style>
