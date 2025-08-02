import React, { useState, useEffect } from 'react';
import { FirestoreService } from './services/firestoreService';
import { calculateOtakuLevel, generateEmblem } from './utils/otakuLevelCalculator';
import { Sidebar } from './components/Sidebar';
import type { Question, QuizAnswer } from './types';

// CSS アニメーションを追加（軽減版）
const globalStyles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes timerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes urgentPulse {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1); }
    75% { transform: scale(1.05); }
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

// ホバー効果（軽減版）
const hoverStyles = `
  button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  }
  
  .choice:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  }
`;

// スタイルをヘッドに注入
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles + hoverStyles;
  document.head.appendChild(styleElement);
}

const SimpleApp: React.FC = () => {
  console.log('🚀 SimpleApp component initializing...');
  
  const [currentStep, setCurrentStep] = useState<'menu' | 'difficulty' | 'countdown' | 'quiz' | 'results'>('menu');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [series, setSeries] = useState<string[]>([]);
  const [, setSeriesStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [shuffledChoices, setShuffledChoices] = useState<{text: string, originalIndex: number}[]>([]);
  const [displayText, setDisplayText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredSeries, setFilteredSeries] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  console.log('🔧 State initialized, currentStep:', currentStep, 'loading:', loading);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #a8edea 75%, #fed6e3 100%)',
      padding: '20px',
      paddingLeft: sidebarCollapsed ? '80px' : '300px',
      fontFamily: '"Comic Sans MS", "Hiragino Sans", "Yu Gothic", sans-serif',
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'padding-left 0.3s ease'
    },
    card: {
      background: 'linear-gradient(145deg, #ffffff 0%, #fef9ff 50%, #fff8e1 100%)',
      borderRadius: '25px',
      padding: 'clamp(20px, 4vw, 60px)',
      width: '100%',
      textAlign: 'center' as const,
      color: '#2d3436',
      border: '3px solid #ffffff',
      boxSizing: 'border-box' as const,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 182, 193, 0.3)',
      position: 'relative' as const
    },
    title: {
      fontSize: 'clamp(2.5em, 5vw, 4em)',
      marginBottom: '0',
      background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 3s ease-in-out infinite',
      fontWeight: '800',
      letterSpacing: '2px',
      textAlign: 'center' as const,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
      filter: 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.3))'
    },
    subtitle: {
      fontSize: 'clamp(1.2em, 3vw, 1.8em)',
      marginBottom: '40px',
      color: '#5a5a5a',
      fontWeight: '600',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
    },
    buttonGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    singleButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '400px',
      margin: '0 auto'
    },
    button: {
      background: 'linear-gradient(45deg, #74b9ff, #0984e3, #6c5ce7)',
      border: '2px solid #ffffff',
      borderRadius: '25px',
      padding: 'clamp(15px, 2.5vw, 25px) clamp(20px, 4vw, 40px)',
      color: '#ffffff',
      fontSize: 'clamp(1em, 2.2vw, 1.4em)',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      minHeight: '60px',
      position: 'relative' as const,
      overflow: 'hidden',
      boxShadow: '0 6px 20px rgba(116, 185, 255, 0.4)',
      transform: 'translateY(0)',
      textAlign: 'left' as const,
      width: '100%',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    randomButton: {
      background: 'linear-gradient(45deg, #fd79a8, #e84393, #fd79a8)',
      border: '2px solid #ffffff',
      boxShadow: '0 6px 25px rgba(253, 121, 168, 0.5)'
    },
    quizHeader: {
      marginBottom: '30px'
    },
    progress: {
      fontSize: '1.1em',
      opacity: 0.8
    },
    question: {
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1))',
      border: '2px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '15px',
      padding: 'clamp(20px, 4vw, 35px)',
      marginBottom: '30px',
      fontSize: 'clamp(1.1em, 2.5vw, 1.4em)',
      lineHeight: '1.4',
      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.1)'
    },
    choices: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    choice: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9))',
      border: '2px solid rgba(0, 180, 219, 0.3)',
      borderRadius: '20px',
      padding: 'clamp(15px, 3vw, 25px)',
      color: '#2d3436',
      fontSize: 'clamp(1em, 2.2vw, 1.3em)',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 8px 25px rgba(0, 180, 219, 0.1)',
      position: 'relative' as const,
      textShadow: 'none'
    },
    selectedChoice: {
      border: '2px solid #ff6b9d',
      background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.9), rgba(196, 69, 105, 0.8))',
      boxShadow: '0 0 15px rgba(255, 107, 157, 0.5), 0 4px 15px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
      color: 'white'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    backButton: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '12px 24px',
      color: '#2d3436',
      fontSize: '1em',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    },
    result: {
      marginBottom: '30px'
    },
    stats: {
      marginBottom: '30px'
    },
    emblem: {
      width: 'clamp(60px, 8vw, 100px)',
      height: 'clamp(60px, 8vw, 100px)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(2em, 5vw, 3em)',
      margin: '0 auto 20px',
      border: '3px solid rgba(255, 255, 255, 0.3)'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: 'clamp(8px, 2vw, 15px) 0',
      fontSize: 'clamp(1em, 2.5vw, 1.3em)'
    },
    easyButton: {
      background: 'linear-gradient(45deg, #00b894, #00cec9)',
      border: '2px solid #ffffff',
      boxShadow: '0 6px 25px rgba(0, 184, 148, 0.4)'
    },
    normalButton: {
      background: 'linear-gradient(45deg, #fdcb6e, #e17055)',
      border: '2px solid #ffffff',
      boxShadow: '0 6px 25px rgba(253, 203, 110, 0.4)'
    },
    hardButton: {
      background: 'linear-gradient(45deg, #e17055, #d63031)',
      border: '2px solid #ffffff',
      boxShadow: '0 6px 25px rgba(225, 112, 85, 0.4)'
    },
    expertButton: {
      background: 'linear-gradient(45deg, #a29bfe, #6c5ce7)',
      border: '2px solid #ffffff',
      boxShadow: '0 6px 25px rgba(162, 155, 254, 0.4)'
    },
    countdownContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '60px 0'
    },
    countdownNumber: {
      fontSize: 'clamp(5em, 12vw, 8em)',
      fontWeight: '900',
      color: '#2d3436',
      textShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 4px 20px rgba(0, 0, 0, 0.7)',
      animation: 'float 2s ease-in-out infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '120px',
      filter: 'brightness(1.2) contrast(1.1)',
      letterSpacing: '0.05em',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      padding: '20px 40px',
      border: '3px solid rgba(0, 0, 0, 0.1)'
    },
    countdownText: {
      fontSize: 'clamp(1.2em, 3vw, 1.8em)',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center' as const,
      fontWeight: '500'
    },
    timerContainer: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '50%',
      padding: '10px',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    reviewSection: {
      marginTop: '40px',
      marginBottom: '30px'
    },
    reviewTitle: {
      fontSize: 'clamp(1.5em, 3.5vw, 2em)',
      marginBottom: '30px',
      textAlign: 'center' as const,
      color: '#ffffff'
    },
    reviewItem: {
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    questionNumber: {
      fontSize: '1.1em',
      fontWeight: '600',
      color: '#ffd700'
    },
    resultBadge: {
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.9em',
      fontWeight: '600',
      color: 'white'
    },
    reviewQuestion: {
      fontSize: 'clamp(1em, 2.2vw, 1.2em)',
      marginBottom: '15px',
      color: '#ffffff',
      lineHeight: '1.4'
    },
    reviewChoices: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      marginBottom: '15px'
    },
    reviewChoice: {
      padding: '10px 15px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.95em',
      transition: 'all 0.2s ease'
    },
    choiceNumber: {
      fontWeight: '600',
      minWidth: '20px'
    },
    correctMark: {
      marginLeft: 'auto',
      color: '#4caf50',
      fontWeight: 'bold',
      fontSize: '1.1em'
    },
    wrongMark: {
      marginLeft: 'auto',
      color: '#f44336',
      fontWeight: 'bold',
      fontSize: '1.1em'
    },
    explanation: {
      background: 'rgba(255, 215, 0, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '10px',
      padding: '15px',
      fontSize: '0.95em',
      lineHeight: '1.4',
      color: '#ffffff'
    },
    cursor: {
      animation: 'blink 1s infinite',
      fontSize: '1em',
      color: '#2d3436'
    },
    titleSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20px',
      position: 'relative' as const
    },
    notificationBox: {
      background: 'linear-gradient(135deg, #ffeb3b 0%, #ff9800 50%, #e91e63 100%)',
      border: '2px solid #ffffff',
      borderRadius: '20px',
      padding: '10px 16px',
      fontSize: 'clamp(0.8em, 1.6vw, 1em)',
      color: '#ffffff',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
      fontWeight: '600',
      position: 'absolute' as const,
      right: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      maxWidth: '280px',
      lineHeight: '1.3',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 235, 59, 0.3)',
      animation: 'float 2s ease-in-out infinite'
    }
  };

  const firestoreService = new FirestoreService();

  // ジャンルとシリーズのマッピング
  const genreMapping = {
    '漫画': [
      'ワンピース',
      'HUNTER×HUNTER', 
      'ジョジョの奇妙な冒険',
      '僕のヒーローアカデミア',
      '名探偵コナン',
      '呪術廻戦',
      '進撃の巨人',
      '鋼の錬金術師'
    ],
    'ゲーム': [
      'ポケットモンスター赤緑'
    ]
  };

  // 初期データ読み込み
  useEffect(() => {
    console.log('📡 useEffect triggered for loadInitialData');
    loadInitialData();
  }, []);

  // ジャンル選択時のフィルタリング
  useEffect(() => {
    if (selectedGenre) {
      const genreSeries = genreMapping[selectedGenre as keyof typeof genreMapping] || [];
      setFilteredSeries(genreSeries.filter(s => series.includes(s)));
    } else {
      setFilteredSeries(series);
    }
  }, [selectedGenre, series]);

  const loadInitialData = async () => {
    try {
      console.log('📊 Starting loadInitialData...');
      setLoading(true);
      setError(null);
      
      console.log('🔥 Initializing Firestore service...');
      const [seriesList, stats] = await Promise.all([
        firestoreService.getSeries(),
        firestoreService.getSeriesStats()
      ]);
      
      console.log('✅ Data loaded successfully:', { seriesList, stats });
      setSeries(seriesList);
      setSeriesStats(stats);
    } catch (err) {
      console.error('❌ Error in loadInitialData:', err);
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました');
    } finally {
      console.log('🏁 loadInitialData finished, setting loading to false');
      setLoading(false);
    }
  };

  const selectSeries = (seriesName: string) => {
    setSelectedSeries(seriesName);
    setCurrentStep('difficulty');
  };

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
  };

  const handleSeriesSelect = (seriesName: string) => {
    selectSeries(seriesName);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const startCountdown = async (difficulty: number) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedDifficulty(difficulty);
      console.log('Starting quiz for series:', selectedSeries, 'difficulty:', difficulty);
      
      let quizQuestions: Question[];
      
      if (selectedSeries === 'ランダム') {
        console.log('Getting random questions...');
        quizQuestions = await firestoreService.getRandomQuestions(undefined, difficulty as any, 10);
      } else {
        console.log('Getting questions for series:', selectedSeries);
        const result = await firestoreService.getQuestions([selectedSeries], difficulty as any, 10);
        quizQuestions = result.questions;
      }
      
      console.log('Retrieved questions:', quizQuestions.length);
      
      if (quizQuestions.length === 0) {
        throw new Error(`${selectedSeries}（難易度${difficulty}）の問題が見つかりませんでした`);
      }
      
      const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
      
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setCountdown(3);
      setCurrentStep('countdown');
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err instanceof Error ? err.message : 'クイズの開始に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // カウントダウン用のエフェクト
  useEffect(() => {
    if (currentStep === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 'countdown' && countdown === 0) {
      setTimeLeft(10);
      setCurrentStep('quiz');
    }
  }, [currentStep, countdown]);

  // クイズタイマー用のエフェクト
  useEffect(() => {
    if (currentStep === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 'quiz' && timeLeft === 0) {
      // 時間切れで自動的に次の問題へ
      handleNextQuestion();
    }
  }, [currentStep, timeLeft]);

  // タイピングアニメーション用のエフェクト
  useEffect(() => {
    if (currentStep === 'quiz' && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.text) {
        setIsTyping(true);
        setDisplayText('');
        
        const text = currentQuestion.text;
        let index = 0;
        
        const typeInterval = setInterval(() => {
          if (index < text.length) {
            setDisplayText(text.slice(0, index + 1));
            index++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 50); // 50msごとに1文字追加
        
        return () => clearInterval(typeInterval);
      }
    }
  }, [currentStep, currentQuestionIndex, questions]);

  // 新しい問題に移る時にタイマーリセットと選択肢シャッフル
  useEffect(() => {
    if (currentStep === 'quiz' && questions.length > 0) {
      setTimeLeft(10);
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        const choices = [
          { text: currentQuestion.choice1, originalIndex: 1 },
          { text: currentQuestion.choice2, originalIndex: 2 },
          { text: currentQuestion.choice3, originalIndex: 3 },
          { text: currentQuestion.choice4, originalIndex: 4 }
        ];
        // 選択肢をシャッフル
        const shuffled = [...choices].sort(() => Math.random() - 0.5);
        setShuffledChoices(shuffled);
      }
    }
  }, [currentStep, currentQuestionIndex, questions]);

  const selectRandomSeries = () => selectSeries('ランダム');

  const handleAnswerSelect = (originalIndex: number) => {
    setSelectedAnswer(originalIndex);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = 10 - timeLeft;
    
    // 回答が選択されていない場合は0（不正解）として扱う
    const answer = selectedAnswer || 0;
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer,
      timeSpent
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      setCurrentStep('results');
    }
  };

  const resetApp = () => {
    setCurrentStep('menu');
    setSelectedSeries('');
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setCountdown(3);
    setTimeLeft(10);
    setShuffledChoices([]);
  };

  const backToSeries = () => {
    setCurrentStep('menu');
    setSelectedSeries('');
    setSelectedDifficulty(null);
    setCountdown(3);
    setTimeLeft(10);
    setShuffledChoices([]);
  };

  // Results calculation
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length;
  const otakuLevel = totalQuestions > 0 ? calculateOtakuLevel(answers, questions) : null;
  const emblem = otakuLevel ? generateEmblem(otakuLevel) : '';

  if (loading) {
    console.log('🔄 Rendering loading screen...');
    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>サブカル検定</h1>
            <p style={styles.subtitle}>データを読み込み中...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>サブカル検定</h1>
            <p style={styles.subtitle}>エラーが発生しました</p>
            <p>{error}</p>
            <button style={styles.button} onClick={loadInitialData}>
              再試行
            </button>
          </div>
        </div>
      </>
    );
  }

  if (currentStep === 'menu') {
    const announcements = [
      {
        id: 1,
        date: '2025-08-02',
        title: '🎉 サブカル検定リリース！新機能続々追加予定',
        content: 'アニメ・漫画の知識を試すクイズアプリがついに登場！',
        type: 'info' as const
      }
    ];

    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>サブカル検定</h1>
              {/* 右側のお知らせボックス */}
              {announcements.length > 0 && (
                <div style={styles.notificationBox}>
                  📢 {announcements[0].title}
                </div>
              )}
            </div>
            <p style={styles.subtitle}>あなたのオタク度を測定しましょう！</p>
            
            <div style={styles.buttonGroup}>
              {!selectedGenre && (
                <button style={{...styles.button, ...styles.randomButton}} onClick={selectRandomSeries}>
                  ランダム出題
                </button>
              )}
              {filteredSeries.map(s => (
                <button key={s} style={styles.button} onClick={() => selectSeries(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (currentStep === 'difficulty') {
    const difficultyLabels = {
      1: '初級（★☆☆☆）',
      2: '中級（★★☆☆）',
      3: '上級（★★★☆）',
      4: '超級（★★★★）'
    };

    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>難易度選択</h1>
            <p style={styles.subtitle}>{selectedSeries}の難易度を選んでください</p>
            
            <div style={styles.buttonGroup}>
              {[1, 2, 3, 4].map(difficulty => (
                <button 
                  key={difficulty} 
                  style={{
                    ...styles.button,
                    ...(difficulty === 1 ? styles.easyButton : 
                       difficulty === 2 ? styles.normalButton :
                       difficulty === 3 ? styles.hardButton : styles.expertButton)
                  }} 
                  onClick={() => startCountdown(difficulty)}
                >
                  {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
                </button>
              ))}
            </div>

            <div style={{...styles.singleButtonContainer, gap: '15px'}}>
              <button style={styles.backButton} onClick={backToSeries}>
                ← シリーズ選択に戻る
              </button>
              <button style={styles.backButton} onClick={resetApp}>
                🏠 ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (currentStep === 'countdown') {
    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>🎯 準備中...</h1>
            <p style={styles.subtitle}>{selectedSeries}（難易度{selectedDifficulty}）</p>
            
            <div style={styles.countdownContainer}>
              {countdown > 0 ? (
                <div style={styles.countdownNumber}>
                  {countdown}
                </div>
              ) : (
                <div style={styles.countdownNumber}>
                  START!
                </div>
              )}
            </div>

            <p style={styles.countdownText}>
              {countdown > 0 ? `${countdown}秒後に開始します` : 'クイズスタート！'}
            </p>
            
            <button style={styles.backButton} onClick={resetApp}>
              🏠 ホームに戻る
            </button>
          </div>
        </div>
      </>
    );
  }

  // タイマーコンポーネント
  const TimerClock = () => {
    const segments = 10;
    // const progress = timeLeft / 10;
    const isUrgent = timeLeft <= 3;
    
    return (
      <div style={{
        ...styles.timerContainer,
        animation: isUrgent ? 'urgentPulse 0.5s infinite' : 'none'
      }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* 背景の円 */}
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="6"
          />
          
          {/* 10分割のセグメント */}
          {Array.from({ length: segments }, (_, i) => {
            const angle = (i * 36) - 90; // -90で12時方向から開始
            const isActive = i < (timeLeft);
            const strokeColor = isUrgent ? '#ff4757' : isActive ? '#4dd0e1' : 'rgba(255, 255, 255, 0.1)';
            
            return (
              <path
                key={i}
                d={`M 40 40 L ${40 + 30 * Math.cos((angle * Math.PI) / 180)} ${40 + 30 * Math.sin((angle * Math.PI) / 180)} A 30 30 0 0 1 ${40 + 30 * Math.cos(((angle + 36) * Math.PI) / 180)} ${40 + 30 * Math.sin(((angle + 36) * Math.PI) / 180)} Z`}
                fill={strokeColor}
                opacity={isActive ? 1 : 0.3}
              />
            );
          })}
          
          {/* 中央の数字 */}
          <text
            x="40"
            y="48"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={isUrgent ? '#ff4757' : '#ffffff'}
          >
            {timeLeft}
          </text>
        </svg>
      </div>
    );
  };

  if (currentStep === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div>問題が見つかりません</div>;

    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <TimerClock />
            
            <div style={styles.quizHeader}>
              <h2>🎯 {selectedSeries}クイズ（難易度{selectedDifficulty}）</h2>
              <div style={styles.progress}>
                問題 {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>

            <div style={styles.question}>
              <h3>
                {displayText}
                {isTyping && <span style={styles.cursor}>|</span>}
              </h3>
            </div>

            <div style={styles.choices}>
              {shuffledChoices.map((choice, index) => (
                <button
                  key={index}
                  className="choice"
                  style={{
                    ...styles.choice,
                    ...(selectedAnswer === choice.originalIndex ? styles.selectedChoice : {})
                  }}
                  onClick={() => handleAnswerSelect(choice.originalIndex)}
                >
                  {choice.text}
                </button>
              ))}
            </div>

            <div style={styles.singleButtonContainer}>
              <button 
                style={styles.button}
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
              </button>
            </div>

            <button style={styles.backButton} onClick={resetApp}>
              🏠 ホームに戻る
            </button>
          </div>
        </div>
      </>
    );
  }

  if (currentStep === 'results') {
    return (
      <>
        <Sidebar
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          onSeriesSelect={handleSeriesSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div style={styles.container}>
          <div style={styles.card}>
            <h2>🎉 クイズ結果</h2>
            
            {otakuLevel && (
              <div style={styles.result}>
                <div style={{...styles.emblem, backgroundColor: otakuLevel.color}}>
                  {emblem}
                </div>
                <h3 style={{color: otakuLevel.color}}>{otakuLevel.title}</h3>
                <p>{otakuLevel.description}</p>
              </div>
            )}

            <div style={styles.stats}>
              <div style={styles.statItem}>
                <span>正解率: {Math.round((correctAnswers / totalQuestions) * 100)}%</span>
              </div>
              <div style={styles.statItem}>
                <span>正解数: {correctAnswers}/{totalQuestions}</span>
              </div>
            </div>

            <div style={styles.reviewSection}>
              <h3 style={styles.reviewTitle}>📝 問題別レビュー</h3>
              {answers.map((answer, index) => {
                const question = questions[index];
                if (!question) return null;
                
                const choices = [
                  question.choice1,
                  question.choice2,
                  question.choice3,
                  question.choice4
                ];

                return (
                  <div key={question.id} style={styles.reviewItem}>
                    <div style={styles.reviewHeader}>
                      <span style={styles.questionNumber}>問題 {index + 1}</span>
                      <span style={{
                        ...styles.resultBadge,
                        backgroundColor: answer.isCorrect ? '#4caf50' : '#f44336'
                      }}>
                        {answer.isCorrect ? '✓ 正解' : '✗ 不正解'}
                      </span>
                    </div>
                    
                    <div style={styles.reviewQuestion}>
                      {question.text}
                    </div>
                    
                    <div style={styles.reviewChoices}>
                      {choices.map((choice, choiceIndex) => {
                        const choiceNumber = choiceIndex + 1;
                        const isCorrect = choiceNumber === question.correctAnswer;
                        const isSelected = choiceNumber === answer.selectedAnswer;
                        
                        return (
                          <div 
                            key={choiceIndex}
                            style={{
                              ...styles.reviewChoice,
                              backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.2)' : 
                                             isSelected && !isCorrect ? 'rgba(244, 67, 54, 0.2)' : 
                                             'rgba(255, 255, 255, 0.05)',
                              border: isCorrect ? '2px solid #4caf50' : 
                                     isSelected && !isCorrect ? '2px solid #f44336' : 
                                     '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <span style={styles.choiceNumber}>{choiceNumber}.</span>
                            <span>{choice}</span>
                            {isCorrect && <span style={styles.correctMark}>✓</span>}
                            {isSelected && !isCorrect && <span style={styles.wrongMark}>✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div style={styles.explanation}>
                        <strong>💡 解説:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={resetApp}>
                🔄 もう一度挑戦
              </button>
              <button style={styles.button} onClick={resetApp}>
                🏠 ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default SimpleApp;
