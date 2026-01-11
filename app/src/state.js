// src/state.js - 状態管理

// ----- ストレージ設定 -----
const STORAGE_KEY = "nengo-quiz-user-data";
const MODE_STORAGE_KEY = "nengo-quiz-mode";

// ----- カテゴリ表示の並び順 -----
const CATEGORY_ORDER = [
    "古代オリエント・地中海世界",
    "東・南アジア1",
    "東・南アジア2",
    "イスラーム世界",
    "中世ヨーロッパ",
    "近代ヨーロッパ",
    "現代世界史1",
    "現代世界史2",
    "現代世界史3",
    "その他",
];

// ----- 状態管理 -----
let state = {
    allEvents: [],
    userAddedEvents: [],
    quizEvents: [],
    currentQuizIndex: 0,
    correctCount: 0,
    quizResults: [] // 各問題の結果を保持: 'correct' | 'wrong' | null
};

// 状態取得
function getState() {
    return state;
}

// 状態更新
function setState(newState) {
    state = { ...state, ...newState };
}
