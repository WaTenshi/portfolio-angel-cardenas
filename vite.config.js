import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogPlugin from './scripts/blog-plugin.mjs'

export default defineConfig({
  plugins: [react(), blogPlugin()],
  base: '/portfolio-angel-cardenas/',
})
