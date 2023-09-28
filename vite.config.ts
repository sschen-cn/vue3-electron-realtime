import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { EletronDevPlugin } from './plugins/vite.electron.dev'
import { ElectrongBuildPlugin } from './plugins/vite.electron.build'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), EletronDevPlugin(), ElectrongBuildPlugin()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
