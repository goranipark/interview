import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react(),
    // JS·CSS를 index.html 안에 모두 집어넣어 "파일 하나"로 만듭니다.
    // 이렇게 해야 USB나 학교 PC에서 index.html을 더블클릭했을 때(file:// 주소)
    // 브라우저 보안 정책(CORS)에 막히지 않고 바로 실행됩니다.
    viteSingleFile(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    // 파일을 쪼개지 않고 하나로 합침
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
