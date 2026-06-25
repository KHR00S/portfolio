import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project page served at https://khr00s.github.io/portfolio/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
})
