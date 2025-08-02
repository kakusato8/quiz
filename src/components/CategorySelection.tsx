import React, { useState, useEffect } from 'react';
import { QuestionService } from '../services/questionService';
import { DataImporter } from './DataImporter';

interface CategorySelectionProps {
  onCategorySelect: (category: string) => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({ onCategorySelect }) => {
  const [series, setSeries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImporter, setShowImporter] = useState(false);
  const questionService = new QuestionService();

  const [seriesStats, setSeriesStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [seriesList, stats] = await Promise.all([
          questionService.getSeries(),
          questionService.getSeriesStats()
        ]);
        
        setSeries(seriesList);
        setSeriesStats(stats);
        
        // データが存在しない場合はインポーターを表示
        if (seriesList.length === 0) {
          setShowImporter(true);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setShowImporter(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRandomSelect = () => {
    onCategorySelect('random');
  };

  if (loading) {
    return (
      <div className="category-selection">
        <h2>サブカル検定</h2>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="category-selection">
      <h2>サブカル検定</h2>
      <p>どのシリーズからクイズに挑戦しますか？</p>
      
      {showImporter && <DataImporter />}
      
      <div className="category-list">
        {series.length > 0 && (
          <button
            className="category-button random-button"
            onClick={handleRandomSelect}
          >
            🎲 全シリーズからランダム出題
          </button>
        )}
        
        {series.map((s) => (
          <button
            key={s}
            className="category-button"
            onClick={() => onCategorySelect(s)}
          >
            📺 {s}
            {seriesStats[s] && (
              <span className="question-count">({seriesStats[s]}問)</span>
            )}
          </button>
        ))}
        
        {series.length === 0 && !showImporter && (
          <div>
            <p>利用可能なシリーズがありません</p>
            <button 
              onClick={() => setShowImporter(true)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              データをインポート
            </button>
          </div>
        )}
      </div>
    </div>
  );
};