<template>
  <div class="min-h-screen bg-xuanzhi">
    <!-- 顶部国风导航栏 -->
    <nav class="bg-mose text-mibai px-6 py-3 flex items-center justify-between shadow-lg"
         style="background: linear-gradient(135deg, #1a1a2e 0%, #2F4F4F 100%)">
      <div class="flex items-center gap-2">
        <span class="text-jinbo text-2xl">✦</span>
        <router-link to="/" class="text-xl font-song font-bold tracking-wider hover:text-jinbo transition-colors">
          紫微斗数
        </router-link>
      </div>
      <div class="flex gap-3 md:gap-6 text-xs md:text-sm">
        <router-link to="/" class="hover:text-jinbo transition-colors" active-class="text-jinbo">排盘</router-link>
        <router-link to="/chart" class="hover:text-jinbo transition-colors" active-class="text-jinbo">命盘</router-link>
        <router-link to="/fortune" class="hover:text-jinbo transition-colors" active-class="text-jinbo">运势</router-link>
        <router-link to="/hepan" class="hover:text-jinbo transition-colors" active-class="text-jinbo">合盘</router-link>
        <router-link to="/knowledge" class="hover:text-jinbo transition-colors" active-class="text-jinbo">知识库</router-link>
      </div>
    </nav>

    <!-- 内容区 -->
    <main class="max-w-7xl mx-auto p-4 md:p-6">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="text-center text-sm text-gray-400 py-6 border-t border-gray-200 mt-8">
      紫微斗数排盘系统 · 开源算法 · MIT License
    </footer>
  </div>
</template>

<script setup lang="ts">
// 根组件
</script>
