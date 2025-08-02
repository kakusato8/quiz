import React, { useState } from 'react';
import { allQuestions } from '../data/quizData';

export const DataImporter: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleShowData = () => {
    const seriesCount = {
      'ワンピース': allQuestions.filter(q => q.series === 'ワンピース').length,
      '僕のヒーローアカデミア': allQuestions.filter(q => q.series === '僕のヒーローアカデミア').length,
      'HUNTER×HUNTER': allQuestions.filter(q => q.series === 'HUNTER×HUNTER').length
    };
    
    setMessage(`
      ✅ サンプルデータが読み込まれています！
      
      📊 データ統計:
      • ワンピース: ${seriesCount['ワンピース']}問
      • 僕のヒーローアカデミア: ${seriesCount['僕のヒーローアカデミア']}問  
      • HUNTER×HUNTER: ${seriesCount['HUNTER×HUNTER']}問
      • 合計: ${allQuestions.length}問
      
      🎮 すぐにクイズを開始できます！
    `);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'rgba(255,255,255,0.1)', 
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3>🎯 クイズデータについて</h3>
      <p>
        このアプリケーションにはサンプルのクイズデータが含まれています。<br/>
        3つの人気シリーズからの問題でオタク度を試してみましょう！
      </p>
      
      <button 
        onClick={handleShowData}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        📊 データ統計を表示
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '5px',
          whiteSpace: 'pre-line',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        💡 <strong>本格運用時:</strong> Firestoreを有効化してCSVファイルから大量データをインポート可能です
      </div>
    </div>
  );
};