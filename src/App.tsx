import { useState } from 'react';
import { CategorySelection } from './components/CategorySelection';
import { DifficultySelection } from './components/DifficultySelection';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import type { GameState, Question, QuizAnswer } from './types';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>('category-select');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [quizResults, setQuizResults] = useState<{
    questions: Question[];
    answers: QuizAnswer[];
  } | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setGameState('difficulty-select');
  };

  const handleDifficultySelect = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setGameState('quiz');
  };

  const handleQuizComplete = (questions: Question[], answers: QuizAnswer[]) => {
    setQuizResults({ questions, answers });
    setGameState('results');
  };

  const handleRestart = () => {
    setGameState('category-select');
    setSelectedCategory('');
    setSelectedDifficulty(1);
    setQuizResults(null);
  };

  const handleBackToCategory = () => {
    setGameState('category-select');
  };

  const handleBackToDifficulty = () => {
    setGameState('difficulty-select');
  };


  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 onClick={handleRestart} className="app-title">
            🧠⚡ クイズ・オタク知識の泉
          </h1>
          {(gameState === 'quiz' || gameState === 'difficulty-select') && (
            <button onClick={handleRestart} className="home-button">
              🏠 ホーム
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {gameState === 'category-select' && (
          <CategorySelection onCategorySelect={handleCategorySelect} />
        )}

        {gameState === 'difficulty-select' && (
          <DifficultySelection
            onDifficultySelect={handleDifficultySelect}
            onBack={handleBackToCategory}
          />
        )}

        {gameState === 'quiz' && (
          <Quiz
            category={selectedCategory}
            difficulty={selectedDifficulty}
            onQuizComplete={handleQuizComplete}
            onBack={handleBackToDifficulty}
          />
        )}

        {gameState === 'results' && quizResults && (
          <Results
            questions={quizResults.questions}
            answers={quizResults.answers}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;
