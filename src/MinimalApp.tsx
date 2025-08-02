import React from 'react';

const MinimalApp: React.FC = () => {
  console.log('🟢 MinimalApp is running!');
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎯 最小テストアプリ</h1>
      <p>このメッセージが表示されている場合、Reactは正常に動作しています。</p>
      <p>現在時刻: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default MinimalApp;