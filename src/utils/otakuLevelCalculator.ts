import type { OtakuLevel, QuizAnswer, Question } from '../types';

export function calculateOtakuLevel(
  answers: QuizAnswer[],
  questions: Question[],
  totalTime: number = 0
): OtakuLevel {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const accuracy = correctCount / totalQuestions;
  
  const avgResponseTime = totalTime > 0 ? totalTime / totalQuestions : 20;
  
  const difficultyStats = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 }
  };
  
  questions.forEach((question, index) => {
    const answer = answers[index];
    const difficulty = question.difficulty as 1 | 2 | 3 | 4;
    difficultyStats[difficulty].total++;
    if (answer && answer.isCorrect) {
      difficultyStats[difficulty].correct++;
    }
  });
  
  if (accuracy >= 0.95 && difficultyStats[4].correct > 0 && avgResponseTime < 15) {
    return {
      level: 'god',
      title: '神',
      description: '完璧すぎる...もはや人間を超越している。アニメ・漫画界の神として崇められるべき存在です。',
      color: '#FFD700'
    };
  }
  
  if (accuracy >= 0.9 && difficultyStats[4].correct > 0) {
    return {
      level: 'legend',
      title: '生ける伝説',
      description: 'アニメ・漫画界の生き字引。その知識の深さに周囲は畏敬の念を抱きます。',
      color: '#FF6B35'
    };
  }
  
  if (accuracy >= 0.8 && (difficultyStats[3].correct >= 2 || difficultyStats[4].correct > 0)) {
    return {
      level: 'veteran',
      title: '古参兵',
      description: '長年培った知識が光る、立派な古参オタク。新参者の憧れの存在です。',
      color: '#8A2BE2'
    };
  }
  
  if (accuracy >= 0.7 && difficultyStats[2].correct >= 3) {
    return {
      level: 'otaku-egg',
      title: 'オタクの卵',
      description: 'オタクの片鱗を見せています。さらなる成長に期待が高まります！',
      color: '#4169E1'
    };
  }
  
  if (accuracy >= 0.6) {
    return {
      level: 'general',
      title: '一般人',
      description: '一般的な知識レベル。アニメ・漫画に興味はあるようですね。まだまだ伸びしろがあります！',
      color: '#32CD32'
    };
  }
  
  if (accuracy >= 0.4) {
    return {
      level: 'apprentice',
      title: '見習い',
      description: '見習いレベル。これから頑張りましょう！基礎から学び直すことをお勧めします。',
      color: '#FFA500'
    };
  }
  
  return {
    level: 'newbie',
    title: 'にわか',
    description: 'まだまだこれから！もっとアニメ・漫画の世界に触れて知識を深めましょう。',
    color: '#DC143C'
  };
}

export function generateEmblem(otakuLevel: OtakuLevel): string {
  const emblems = {
    'god': '👑',
    'legend': '⚡',
    'veteran': '🛡️',
    'otaku-egg': '🥚',
    'general': '👤',
    'apprentice': '📚',
    'newbie': '🌱'
  };
  return emblems[otakuLevel.level as keyof typeof emblems] || '📝';
}

export function generateShareText(
  otakuLevel: OtakuLevel, 
  correctAnswers: number, 
  totalQuestions: number
): string {
  const emblem = generateEmblem(otakuLevel);
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  return `${emblem} オタク度判定結果 ${emblem}\n` +
         `称号: ${otakuLevel.title}\n` +
         `正解率: ${correctAnswers}/${totalQuestions} (${accuracy}%)\n` +
         `${otakuLevel.description}\n` +
         `\n#クイズオタク知識の泉 #オタク度診断`;
}

export const otakuLevelDescriptions = {
  god: {
    message: 'あなたは既に人間を超越しています。アニメ・漫画界の神として君臨します！',
    advice: 'ぜひその知識を後進の指導に活かしてください。業界関係者も一目置く存在です。'
  },
  legend: {
    message: 'アニメ・漫画界の生ける伝説です。その知識は計り知れません！',
    advice: 'アニメ・漫画業界で働くことを検討してみては？あなたの知識が世界を変えるかも。'
  },
  veteran: {
    message: '長年の経験が物を言いますね。立派な古参オタクです！',
    advice: 'さらにマニアックな作品や隠れた名作にも挑戦してみましょう。'
  },
  'otaku-egg': {
    message: 'おめでとうございます！オタクの卵として認定します！',
    advice: '好きなジャンルを極めつつ、他のジャンルも開拓してみてください。'
  },
  general: {
    message: 'アニメ・漫画が好きな一般的なファンですね。',
    advice: 'もう少し深い作品や古い名作にも挑戦してみましょう。知識の幅を広げましょう！'
  },
  apprentice: {
    message: 'アニメ・漫画の世界への第一歩を踏み出しましたね！',
    advice: '有名な作品から始めて、徐々に幅を広げていきましょう。'
  },
  newbie: {
    message: 'これからアニメ・漫画の素晴らしい世界が待っています！',
    advice: 'まずは話題の作品や名作から始めてみることをお勧めします。'
  }
};