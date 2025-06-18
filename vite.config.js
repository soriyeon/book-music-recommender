import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/book-music-recommender/', // 꼭 넣기!
  plugins: [react()],
})
