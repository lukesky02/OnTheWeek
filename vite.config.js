import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://8and3kmzu9.execute-api.ap-northeast-2.amazonaws.com', // 실제 API Gateway URL로 수정
        changeOrigin: true, // API 서버가 다른 도메인에 있을 때 true로 설정
        secure: false, // HTTPS를 사용할 경우 false로 설정
        rewrite: (path) => path.replace(/^\/api/, ''), // /api 경로를 제거하여 API Gateway에 맞게 수정
      },
    },
  },
});
