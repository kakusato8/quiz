import React from 'react';
import type { Question, QuizAnswer } from '../types';
import { calculateOtakuLevel, generateEmblem, generateShareText, otakuLevelDescriptions } from '../utils/otakuLevelCalculator';

interface ResultsProps {
  questions: Question[];
  answers: QuizAnswer[];
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ questions, answers, onRestart }) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  const otakuLevel = calculateOtakuLevel(answers, questions);
  const emblem = generateEmblem(otakuLevel);
  const shareText = generateShareText(otakuLevel, correctAnswers, totalQuestions);
  const levelDescription = otakuLevelDescriptions[otakuLevel.level as keyof typeof otakuLevelDescriptions];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'クイズ・オタク知識の泉 結果',
          text: shareText
        });
      } catch (err) {
        console.log('シェアがキャンセルされました');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('結果をクリップボードにコピーしました！');
    }
  };

  return (
    <div className="results">
      <div className="otaku-level-section">
        <h2>🎉 オタク度判定結果 🎉</h2>
        
        <div className="level-display">
          <div 
            className="level-emblem"
            style={{ backgroundColor: otakuLevel.color }}
          >
            <span className="emblem-icon">{emblem}</span>
          </div>
          <div className="level-info">
            <h3 className="level-title" style={{ color: otakuLevel.color }}>
              {otakuLevel.title}
            </h3>
            <p className="level-description">{otakuLevel.description}</p>
          </div>
        </div>

        <div className="score-details">
          <div className="score-stat">
            <span className="stat-label">正解率</span>
            <span className="stat-value">{score}%</span>
          </div>
          <div className="score-stat">
            <span className="stat-label">正解数</span>
            <span className="stat-value">{correctAnswers}/{totalQuestions}</span>
          </div>
        </div>

        {levelDescription && (
          <div className="level-advice">
            <h4>📝 アドバイス</h4>
            <p>{levelDescription.advice}</p>
          </div>
        )}

        <div className="action-buttons">
          <button className="share-button" onClick={handleShare}>
            📱 結果をシェア
          </button>
          <button className="restart-button" onClick={onRestart}>
            🔄 もう一度挑戦
          </button>
        </div>
      </div>

      <div className="answer-review">
        <h3>解答と解説</h3>
        {questions.map((question, index) => {
          const answer = answers[index];
          const choices = [
            question.choice1,
            question.choice2,
            question.choice3,
            question.choice4
          ];

          return (
            <div key={question.id} className="question-result">
              <div className="question-header">
                <span className="question-number">問題 {index + 1}</span>
                <span className="question-series">{question.series}</span>
                <span className={`result-badge ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  {answer.isCorrect ? '○' : '×'}
                </span>
              </div>
              
              <div className="question-text">
                {question.text}
              </div>

              <div className="answer-choices">
                {choices.map((choice, choiceIndex) => {
                  const choiceNumber = choiceIndex + 1;
                  const isCorrect = choiceNumber === question.correctAnswer;
                  const isSelected = choiceNumber === answer.selectedAnswer;
                  
                  let className = 'answer-choice';
                  if (isCorrect) className += ' correct-answer';
                  if (isSelected && !isCorrect) className += ' wrong-answer';
                  if (isSelected) className += ' selected';

                  return (
                    <div key={choiceIndex} className={className}>
                      <span className="choice-number">{choiceNumber}.</span>
                      <span className="choice-text">{choice}</span>
                      {isCorrect && <span className="correct-mark">✓</span>}
                      {isSelected && !isCorrect && <span className="wrong-mark">✗</span>}
                    </div>
                  );
                })}
              </div>

              <div className="explanation">
                <strong>解説:</strong> {question.explanation}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};