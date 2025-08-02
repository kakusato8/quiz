import React, { useState, useEffect } from 'react';
import type { Question, QuizAnswer, DifficultyLevel } from '../types';
import { QuestionService } from '../services/questionService';

interface QuizProps {
  category: string;
  difficulty: number;
  onQuizComplete: (questions: Question[], answers: QuizAnswer[]) => void;
  onBack: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ 
  category, 
  difficulty, 
  onQuizComplete, 
  onBack 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const questionService = new QuestionService();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        let quizQuestions: Question[] = [];
        
        if (category === 'random') {
          quizQuestions = await questionService.getRandomMixedQuestions(10);
        } else {
          quizQuestions = await questionService.getRandomQuestions([category], difficulty as DifficultyLevel, 10);
        }
        
        if (quizQuestions.length === 0) {
          setError('この難易度の問題が見つかりません');
          return;
        }
        
        setQuestions(quizQuestions);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('問題の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [category, difficulty]);

  const handleAnswerSelect = (answerNumber: number) => {
    setSelectedAnswer(answerNumber);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      timeSpent: 0
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      onQuizComplete(questions, updatedAnswers);
    }
  };

  if (loading) {
    return (
      <div className="quiz">
        <p>問題を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz">
        <p className="error">{error}</p>
        <button onClick={onBack}>戻る</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz">
        <p>問題が見つかりません</p>
        <button onClick={onBack}>戻る</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const choices = [
    currentQuestion.choice1,
    currentQuestion.choice2,
    currentQuestion.choice3,
    currentQuestion.choice4
  ];

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="question-counter">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question">
        <div className="question-meta">
          <span className="series-tag">{currentQuestion.series}</span>
          <span className="difficulty-tag">難易度: {currentQuestion.difficulty}</span>
        </div>
        <h3>{currentQuestion.text}</h3>
      </div>

      <div className="choices">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`choice-button ${selectedAnswer === index + 1 ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(index + 1)}
          >
            <span className="choice-number">{index + 1}.</span>
            <span className="choice-text">{choice}</span>
          </button>
        ))}
      </div>

      <div className="quiz-actions">
        <button 
          className="next-button"
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
        </button>
      </div>
    </div>
  );
};