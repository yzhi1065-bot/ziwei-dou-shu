import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../core/index.ts'),
      name: 'ZiweiCore',
      formats: ['umd', 'es'],
      fileName: (format) => `ziwei-core.${format}.js`,
    },
    outDir: resolve(__dirname, '../mini-program/src/utils'),
    emptyOutDir: false,
    minify: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
})
