import { defineConfig } from 'vite'
import image from '@rollup/plugin-image'
import checker from 'vite-plugin-checker'

import react from '@vitejs/plugin-react'
import { join } from 'path'

const chunkify = (id: string) => {
  if (id.includes('node_modules')) {
    if (id.includes('firebase')) {
      return 'vendor_firebase'
    }
    if (id.includes('@mui')) {
      return 'vendor_mui'
    }

    return 'vendor' // all other package goes here
  }
}

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      output: {
        manualChunks: chunkify,
      },
    },
    outDir: 'build',
  },
  server: {
    port: 3001,
  },
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@/': join(__dirname, './src/'),
    },
  },
})
