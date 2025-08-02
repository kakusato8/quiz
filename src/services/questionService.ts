import { FirestoreService } from './firestoreService';
import type { Question, DifficultyLevel } from '../types';

export class QuestionService {
  private firestoreService = new FirestoreService();

  async getSeries(): Promise<string[]> {
    try {
      return await this.firestoreService.getSeries();
    } catch (error) {
      console.error('Failed to get series:', error);
      return [];
    }
  }

  async getSeriesStats(): Promise<Record<string, number>> {
    try {
      return await this.firestoreService.getSeriesStats();
    } catch (error) {
      console.error('Failed to get series stats:', error);
      return {};
    }
  }

  async getQuestionsBySeries(series: string): Promise<Question[]> {
    try {
      const { questions } = await this.firestoreService.getQuestions([series]);
      return questions;
    } catch (error) {
      console.error('Failed to get questions by series:', error);
      return [];
    }
  }

  async getQuestionsBySeriesAndDifficulty(
    series: string[], 
    difficulty: DifficultyLevel
  ): Promise<Question[]> {
    try {
      const { questions } = await this.firestoreService.getQuestions(series, difficulty);
      return questions;
    } catch (error) {
      console.error('Failed to get questions by series and difficulty:', error);
      return [];
    }
  }

  async getRandomQuestions(
    series?: string[], 
    difficulty?: DifficultyLevel, 
    count: number = 10
  ): Promise<Question[]> {
    try {
      return await this.firestoreService.getRandomQuestions(series, difficulty, count);
    } catch (error) {
      console.error('Failed to get random questions:', error);
      return [];
    }
  }

  async getRandomMixedQuestions(count: number = 10): Promise<Question[]> {
    try {
      return await this.firestoreService.getRandomQuestions(undefined, undefined, count);
    } catch (error) {
      console.error('Failed to get random mixed questions:', error);
      return [];
    }
  }

  async getDifficultyStats(series?: string): Promise<Record<number, number>> {
    try {
      return await this.firestoreService.getDifficultyStats(series);
    } catch (error) {
      console.error('Failed to get difficulty stats:', error);
      return { 1: 0, 2: 0, 3: 0, 4: 0 };
    }
  }
}