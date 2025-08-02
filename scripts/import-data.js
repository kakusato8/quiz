const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyAKL0TY26Z54Mdk5cS9kraIkvBnP6KumnM",
  authDomain: "quiz-e08fc.firebaseapp.com",
  projectId: "quiz-e08fc",
  storageBucket: "quiz-e08fc.firebasestorage.app",
  messagingSenderId: "1079346785407",
  appId: "1:1079346785407:web:6b788c5fb0361184c3234a",
  measurementId: "G-R856RK1LMB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSVLine(line) {
  const result = [];
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

function csvRowToQuestion(columns) {  
  return {
    id: columns[3],
    category: columns[0],
    series: columns[1],
    subcategory: columns[2],
    text: columns[4],
    choice1: columns[5],
    choice2: columns[6],
    choice3: columns[7],
    choice4: columns[8],
    correctAnswer: parseInt(columns[9]),
    explanation: columns[10],
    difficulty: parseInt(columns[11]),
    timeLimit: 20
  };
}

async function clearCollection() {
  console.log('Clearing existing questions...');
  const querySnapshot = await getDocs(collection(db, 'questions'));
  
  if (querySnapshot.empty) {
    console.log('No existing questions to clear');
    return;
  }
  
  const batch = writeBatch(db);
  querySnapshot.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });
  
  await batch.commit();
  console.log(`Deleted ${querySnapshot.size} existing questions`);
}

async function importCSV(filePath) {
  console.log(`Importing ${path.basename(filePath)}...`);
  
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  const batch = writeBatch(db);
  let batchCount = 0;
  let importedCount = 0;
  
  for (const line of dataLines) {
    if (!line.trim()) continue;
    
    const columns = parseCSVLine(line);
    if (columns.length >= 12) {
      try {
        const question = csvRowToQuestion(columns);
        const docRef = doc(db, 'questions', question.id);
        batch.set(docRef, question);
        
        batchCount++;
        importedCount++;
        
        // Commit batch when it reaches 500 documents (Firestore limit)
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`  Committed batch of ${batchCount} documents`);
          batchCount = 0;
        }
      } catch (error) {
        console.error(`  Error processing line: ${line.substring(0, 50)}...`, error.message);
      }
    }
  }
  
  // Commit remaining documents
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  Committed final batch of ${batchCount} documents`);
  }
  
  console.log(`✅ Imported ${importedCount} questions from ${path.basename(filePath)}`);
  return importedCount;
}

async function main() {
  try {
    console.log('🚀 Starting data import...\n');
    
    // Clear existing data
    await clearCollection();
    console.log('');
    
    const csvFiles = [
      '../specifications/data/quiz/ワンピース.csv',
      '../specifications/data/quiz/僕のヒーローアカデミア.csv',
      '../specifications/data/quiz/HUNTER×HUNTER.csv',
      '../specifications/data/quiz/ジョジョの奇妙な冒険.csv',
      '../specifications/data/quiz/名探偵コナン.csv',
      '../specifications/data/quiz/呪術廻戦.csv',
      '../specifications/data/quiz/進撃の巨人.csv',
      '../specifications/data/quiz/鋼の錬金術師.csv'
    ];
    
    let totalImported = 0;
    
    for (const file of csvFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const count = await importCSV(filePath);
        totalImported += count;
        console.log('');
      } else {
        console.log(`❌ File not found: ${filePath}`);
      }
    }
    
    console.log(`🎉 Import completed! Total questions imported: ${totalImported}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();