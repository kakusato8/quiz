import React from 'react';

interface DifficultySelectionProps {
  onDifficultySelect: (difficulty: number) => void;
  onBack: () => void;
}

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({ 
  onDifficultySelect, 
  onBack 
}) => {
  const difficulties = [
    { 
      level: 1, 
      label: '⭐', 
      description: '初級',
      subtitle: 'にわか・見習いレベル'
    },
    { 
      level: 2, 
      label: '⭐⭐', 
      description: '中級',
      subtitle: '一般人・オタクの卵レベル'
    },
    { 
      level: 3, 
      label: '⭐⭐⭐', 
      description: '上級',
      subtitle: '古参兵レベル'
    },
    { 
      level: 4, 
      label: '⭐⭐⭐⭐', 
      description: '超オタク級',
      subtitle: '生ける伝説・神レベル'
    }
  ];

  return (
    <div className="difficulty-selection">
      <h2>🎯 難易度を選択してください</h2>
      <p>あなたのオタク度を試してみましょう！</p>
      
      <div className="difficulty-list">
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            className={`difficulty-button difficulty-${diff.level}`}
            onClick={() => onDifficultySelect(diff.level)}
          >
            <div className="difficulty-stars">{diff.label}</div>
            <div className="difficulty-description">{diff.description}</div>
            <div className="difficulty-subtitle">{diff.subtitle}</div>
          </button>
        ))}
      </div>
      
      <button className="back-button" onClick={onBack}>
        ← シリーズ選択に戻る
      </button>
    </div>
  );
};