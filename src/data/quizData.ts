import type { Question } from '../types';

// ワンピースのサンプル問題（実際のCSVデータから抜粋）
export const onePieceQuestions: Question[] = [
  {
    id: "1",
    category: "漫画",
    series: "ワンピース",
    subcategory: "東の海編",
    text: "ルフィが麦わら帽子をシャンクスから預かったのは何歳の時？",
    choice1: "5歳",
    choice2: "7歳", 
    choice3: "9歳",
    choice4: "11歳",
    correctAnswer: 2,
    explanation: "ルフィがシャンクスに麦わら帽子を預けられたのは7歳の時です。",
    difficulty: 1,
    timeLimit: 20
  },
  {
    id: "2",
    category: "漫画",
    series: "ワンピース", 
    subcategory: "東の海編",
    text: "ゾロがミホークと戦った場所は？",
    choice1: "バラティエ",
    choice2: "フーシャ村",
    choice3: "シロップ村", 
    choice4: "ココヤシ村",
    correctAnswer: 1,
    explanation: "ゾロはミホークと海上レストラン・バラティエで戦いました。",
    difficulty: 2,
    timeLimit: 20
  },
  {
    id: "3",
    category: "漫画",
    series: "ワンピース",
    subcategory: "東の海編", 
    text: "ナミがベルメールさんのために隠していた財産はいくら？",
    choice1: "1億ベリー",
    choice2: "5000万ベリー",
    choice3: "3000万ベリー",
    choice4: "1億ベリー以上",
    correctAnswer: 1,
    explanation: "ナミがベルメールさんのために隠していた財産は1億ベリーでした。",
    difficulty: 2,
    timeLimit: 20
  }
];

// 僕のヒーローアカデミアのサンプル問題
export const heroAcademiaQuestions: Question[] = [
  {
    id: "HHQ_601",
    category: "漫画",
    series: "僕のヒーローアカデミア",
    subcategory: "キャラクター",
    text: "主人公緑谷出久の個性は？",
    choice1: "ワン・フォー・オール",
    choice2: "オール・フォー・ワン",
    choice3: "爆破",
    choice4: "無個性",
    correctAnswer: 1,
    explanation: "ワン・フォー・オールは代々受け継がれてきた個性です。",
    difficulty: 1,
    timeLimit: 20
  },
  {
    id: "HHQ_602", 
    category: "漫画",
    series: "僕のヒーローアカデミア",
    subcategory: "キャラクター",
    text: "爆豪勝己の個性は？",
    choice1: "爆破",
    choice2: "半冷半燃",
    choice3: "無重力",
    choice4: "硬化",
    correctAnswer: 1,
    explanation: "爆豪勝己は掌から爆破を起こすことができます。",
    difficulty: 1,
    timeLimit: 20
  },
  {
    id: "HHQ_603",
    category: "漫画", 
    series: "僕のヒーローアカデミア",
    subcategory: "キャラクター",
    text: "麗日お茶子の個性は？",
    choice1: "無重力",
    choice2: "創造",
    choice3: "電気",
    choice4: "高速",
    correctAnswer: 1,
    explanation: "麗日お茶子は触れたものを無重力にすることができます。",
    difficulty: 1,
    timeLimit: 20
  }
];

// HUNTER×HUNTERのサンプル問題
export const hunterHunterQuestions: Question[] = [
  {
    id: "001",
    category: "漫画",
    series: "HUNTER×HUNTER", 
    subcategory: "ハンター試験編",
    text: "ゴンが初めてキルアと出会ったハンター試験の場所はどこ？",
    choice1: "ゾルディック家",
    choice2: "ビスケの森",
    choice3: "シークレットサイト",
    choice4: "ブランクス山",
    correctAnswer: 3,
    explanation: "ハンター試験の第一次試験中に、ゴンはブランクス山でキルアと出会いました。",
    difficulty: 1,
    timeLimit: 20
  },
  {
    id: "002",
    category: "漫画",
    series: "HUNTER×HUNTER",
    subcategory: "ハンター試験編", 
    text: "ハンター試験の第一次試験で出された課題は？",
    choice1: "グルメハンターとしての料理",
    choice2: "森の動物を捕獲する",
    choice3: "目的地までたどり着く",
    choice4: "迷路を突破する",
    correctAnswer: 1,
    explanation: "第一次試験は、サトツの「グルメハンターとしての料理」でした。",
    difficulty: 1,
    timeLimit: 20
  },
  {
    id: "003",
    category: "漫画",
    series: "HUNTER×HUNTER",
    subcategory: "ハンター試験編",
    text: "ハンター試験の第二次試験で、メンチが出した課題は？",
    choice1: "寿司を作る",
    choice2: "巨大な豚を捕まえる", 
    choice3: "卵料理を作る",
    choice4: "薬草を探す",
    correctAnswer: 3,
    explanation: "第二次試験は、メンチによる「卵料理を作る」という課題でした。",
    difficulty: 1,
    timeLimit: 20
  }
];

// 全問題データ
export const allQuestions: Question[] = [
  ...onePieceQuestions,
  ...heroAcademiaQuestions, 
  ...hunterHunterQuestions
];