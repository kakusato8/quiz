import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #a8edea 75%, #fed6e3 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
      }}>
        <h1>🎯 サブカル検定</h1>
        <p>アプリが正常に動作しています！</p>
        <button style={{
          background: 'linear-gradient(45deg, #74b9ff, #0984e3)',
          border: 'none',
          borderRadius: '10px',
          padding: '15px 30px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          テストボタン
        </button>
      </div>
    </div>
  );
};

export default TestApp;