import { CSVImporter } from '../src/utils/csvImporter';

async function importNewQuizzes() {
  const importer = new CSVImporter();
  
  console.log('🚀 新しいクイズデータのインポートを開始します...');
  
  try {
    await importer.importAllCSVFiles();
    console.log('✅ すべてのクイズデータのインポートが完了しました！');
  } catch (error) {
    console.error('❌ インポート中にエラーが発生しました:', error);
  }
}

importNewQuizzes();