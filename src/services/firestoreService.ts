import { db } from '../firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import type { Question, DifficultyLevel } from '../types';

export class FirestoreService {
  private readonly COLLECTION_NAME = 'questions';

  // シリーズ一覧を取得
  async getSeries(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const series = new Set<string>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Question;
        series.add(data.series);
      });
      
      return Array.from(series).sort();
    } catch (error) {
      console.error('Failed to get series:', error);
      throw new Error('シリーズ一覧の取得に失敗しました');
    }
  }

  // シリーズ別問題数を取得
  async getSeriesStats(): Promise<Record<string, number>> {
    try {
      const series = await this.getSeries();
      const stats: Record<string, number> = {};
      
      for (const s of series) {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('series', '==', s)
        );
        const querySnapshot = await getDocs(q);
        stats[s] = querySnapshot.size;
      }
      
      return stats;
    } catch (error) {
      console.error('Failed to get series stats:', error);
      throw new Error('統計情報の取得に失敗しました');
    }
  }

  // 指定条件で問題を取得（ページネーション対応）
  async getQuestions(
    series?: string[],
    difficulty?: DifficultyLevel,
    limitCount: number = 10,
  ): Promise<{ questions: Question[] }> {
    try {
      console.log('getQuestions called with series:', series, 'difficulty:', difficulty, 'limit:', limitCount);
      
      // まずは最もシンプルなクエリから開始
      let q;
      if (series && series.length === 1) {
        // 単一シリーズの場合は==を使用
        console.log('Using == filter for single series:', series[0]);
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('series', '==', series[0]),
          limit(limitCount)
        );
      } else if (series && series.length > 1) {
        // 複数シリーズの場合はinを使用
        console.log('Using in filter for multiple series:', series);
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('series', 'in', series),
          limit(limitCount)
        );
      } else {
        // シリーズフィルタなしの場合
        console.log('No series filter');
        q = query(collection(db, this.COLLECTION_NAME), limit(limitCount));
      }
      
      // 難易度フィルタ
      if (difficulty) {
        console.log('Adding difficulty filter:', difficulty);
        q = query(q, where('difficulty', '==', difficulty));
      }
      
      const querySnapshot = await getDocs(q);
      console.log('Query returned', querySnapshot.size, 'documents');
      
      const questions = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Question));
      
      console.log('Processed questions:', questions.length);
      
      return {
        questions
      };
    } catch (error) {
      console.error('Failed to get questions:', error);
      console.error('Error details:', error);
      if (error instanceof Error) {
        throw new Error(`問題の取得に失敗しました: ${error.message}`);
      } else {
        throw new Error('問題の取得に失敗しました');
      }
    }
  }

  // ランダムな問題を効率的に取得
  async getRandomQuestions(
    series?: string[],
    difficulty?: DifficultyLevel,
    count: number = 10
  ): Promise<Question[]> {
    try {
      console.log('Getting random questions with params:', { series, difficulty, count });
      
      // まず条件に合うすべての問題を取得（制限なし）
      const { questions: allQuestions } = await this.getQuestions(series, difficulty, 5000);
      
      if (allQuestions.length === 0) {
        console.log('No questions found for the given criteria');
        return [];
      }
      
      console.log(`Found ${allQuestions.length} questions, selecting ${count} randomly`);
      
      // Fisher-Yates シャッフルでより確実にランダム化
      const shuffled = [...allQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
      console.log(`Selected ${selectedQuestions.length} random questions`);
      console.log('First question:', selectedQuestions[0]?.text?.substring(0, 50) + '...');
      
      return selectedQuestions;
    } catch (error) {
      console.error('Failed to get random questions:', error);
      console.error('Random questions error details:', error);
      if (error instanceof Error) {
        throw new Error(`ランダム問題の取得に失敗しました: ${error.message}`);
      } else {
        throw new Error('ランダム問題の取得に失敗しました');
      }
    }
  }

  // 難易度別統計を取得
  async getDifficultyStats(series?: string): Promise<Record<number, number>> {
    try {
      let q = query(collection(db, this.COLLECTION_NAME));
      
      if (series) {
        q = query(q, where('series', '==', series));
      }
      
      const querySnapshot = await getDocs(q);
      const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Question;
        stats[data.difficulty] = (stats[data.difficulty] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Failed to get difficulty stats:', error);
      throw new Error('難易度統計の取得に失敗しました');
    }
  }
}