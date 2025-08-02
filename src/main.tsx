import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import SimpleApp from './SimpleApp.tsx'

console.log('🚀 main.tsx is executing...');

const rootElement = document.getElementById('root');
console.log('🎯 Root element found:', rootElement);

if (rootElement) {
  console.log('✅ Creating React root...');
  createRoot(rootElement).render(
    <StrictMode>
      <SimpleApp />
    </StrictMode>,
  );
  console.log('🎊 React app rendered!');
} else {
  console.error('❌ Root element not found!');
}
