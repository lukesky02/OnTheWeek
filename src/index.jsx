import './styles/index.css'; // 전역 스타일
import App from './App.jsx'; // 메인 App 컴포넌트
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
