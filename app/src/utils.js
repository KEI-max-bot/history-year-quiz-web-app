// src/utils.js - ユーティリティ関数

// ----- 汎用 DOM ヘルパー -----
const getById = (id) => document.getElementById(id);

// ----- XSS対策 -----
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ----- 年→世紀 -----
function getCentury(year) {
    if (year < 0) return "紀元前";
    return Math.floor((year - 1) / 100 + 1) + "世紀";
}

// ----- 年号表示 -----
function formatYear(year) {
    if (year < 0) return `紀元前${Math.abs(year)}年`;
    return `${year}年`;
}

// ----- 配列シャッフル -----
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
