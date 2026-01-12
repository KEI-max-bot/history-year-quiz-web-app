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

// ----- カテゴリ表示名（年代範囲付き）-----
const CATEGORY_DISPLAY_NAMES = {
    "古代オリエント・地中海世界": "古代オリエント・地中海世界（～476年）",
    "東・南アジア1": "東・南アジア1（～999年）",
    "東・南アジア2": "東・南アジア2（1000年～1799年）",
    "イスラーム世界": "イスラーム世界（～1799年）",
    "中世ヨーロッパ": "中世ヨーロッパ（477年～1476年）",
    "近代ヨーロッパ": "近代ヨーロッパ（大航海時代～ナポレオン戦争）",
    "現代世界史1": "現代世界史1（1800年～1899年）",
    "現代世界史2": "現代世界史2（1900年～1945年）",
    "現代世界史3": "現代世界史3（1946年～）",
    "その他": "その他",
};

// カテゴリ表示名を取得
function getCategoryDisplayName(category) {
    return CATEGORY_DISPLAY_NAMES[category] || category;
}

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
