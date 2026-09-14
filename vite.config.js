import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // './' 로 두어야 빌드 결과(dist/index.html)를 서버 없이 더블클릭으로 열 수 있음
  base: './',
  build: {
    outDir: 'dist',
  },
});
