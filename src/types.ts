export interface Question {
  id: string;
  category: string; // 大分類 (漫画)
  series: string; // 中分類 (ワンピース)
  subcategory: string; // 小分類 (東の海編)
  text: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: number;
  explanation: string;
  difficulty: number; // 1-4 (1:初級, 2:中級, 3:上級, 4:超オタク級)
  timeLimit: number; // seconds
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizResult {
  questions: Question[];
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  totalTime: number;
  otakuLevel: OtakuLevel;
}

export interface OtakuLevel {
  level: string;
  title: string;
  description: string;
  color: string;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAnonymous: boolean;
}

export interface UserResult {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  difficulty: string;
  genres: string[];
  otakuLevel: OtakuLevel;
  completedAt: Date;
}

export type GameState = 'category-select' | 'difficulty-select' | 'quiz' | 'results';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export type QuizMode = 'series' | 'random';