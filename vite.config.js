import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/world_news_today/',          // назва репозиторію
  build: {
    outDir: 'docs',                    // ⚠️ будувати у папку docs
  },
});

