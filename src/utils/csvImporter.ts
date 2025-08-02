import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Question } from '../types';

export interface CSVRow {
  category: string;
  series: string;
  subcategory: string;
  id: string;
  text: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: number;
  explanation: string;
  difficulty: number;
}

export class CSVImporter {
  private readonly COLLECTION_NAME = 'questions';

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) {
      result.push(current.trim());
    }
    
    return result;
  }

  private csvRowToQuestion(row: CSVRow): Question {
    return {
      id: row.id,
      category: row.category,
      series: row.series,
      subcategory: row.subcategory,
      text: row.text,
      choice1: row.choice1,
      choice2: row.choice2,
      choice3: row.choice3,
      choice4: row.choice4,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation,
      difficulty: row.difficulty,
      timeLimit: 20
    };
  }

  async importFromCSV(csvText: string): Promise<number> {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      let importedCount = 0;
      
      const batch = writeBatch(db);
      let batchCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = this.parseCSVLine(line);
        if (columns.length >= 12) {
          const csvRow: CSVRow = {
            category: columns[0],
            series: columns[1],
            subcategory: columns[2],
            id: columns[3],
            text: columns[4],
            choice1: columns[5],
            choice2: columns[6],
            choice3: columns[7],
            choice4: columns[8],
            correctAnswer: parseInt(columns[9]),
            explanation: columns[10],
            difficulty: parseInt(columns[11])
          };
          
          const question = this.csvRowToQuestion(csvRow);
          const docRef = doc(db, this.COLLECTION_NAME, question.id);
          batch.set(docRef, question);
          
          batchCount++;
          importedCount++;
          
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      return importedCount;
    } catch (error) {
      console.error('Failed to import CSV:', error);
      throw error;
    }
  }

  async clearAllQuestions(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Failed to clear questions:', error);
      throw error;
    }
  }

  async importAllCSVFiles(): Promise<void> {
    const csvFiles = [
      'ワンピース.csv',
      '僕のヒーローアカデミア.csv',
      'HUNTER×HUNTER.csv',
      'ポケットモンスター赤緑.csv',
      '名探偵コナン.csv',
      '呪術廻戦.csv',
      '鋼の錬金術師.csv',
      '進撃の巨人.csv',
      'ジョジョの奇妙な冒険.csv'
    ];

    for (const filename of csvFiles) {
      try {
        const response = await fetch(`/specifications/data/quiz/${filename}`);
        const csvText = await response.text();
        
        const count = await this.importFromCSV(csvText);
        console.log(`Imported ${count} questions from ${filename}`);
      } catch (error) {
        console.error(`Failed to import ${filename}:`, error);
      }
    }
  }
}