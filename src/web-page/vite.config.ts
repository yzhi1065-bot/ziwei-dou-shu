import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages子路径部署
  base: '/ziwei-dou-shu/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '紫微斗数排盘',
        short_name: '紫微排盘',
        description: '紫微斗数排盘系统 - 四流派排盘·运势推演·合盘分析',
        theme_color: '#B22222',
        background_color: '#fcf8f0',
        display: 'standalone',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      // 核心算法库别名：@core → src/core
      '@core': fileURLToPath(new URL('../core', import.meta.url)),
      // 本地类型别名
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
