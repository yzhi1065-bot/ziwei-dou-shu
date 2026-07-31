import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 核心算法库别名：@core → src/core
      '@core': fileURLToPath(new URL('../core', import.meta.url)),
      // 本地类型别名
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
