// src/app.js - エントリーポイント（初期化・イベント登録）

// ----- 起動処理 -----
document.addEventListener("DOMContentLoaded", () => {
    initializeData();
    bindUI();
    renderEventLists();
    setupColumnResize(); // カラムリサイズ機能を初期化
    // 保存されたモードを復元
    const savedMode = getSavedMode();
    switchMode(savedMode);
    // クイズモードならカテゴリ選択画面を表示
    if (savedMode === "quiz") {
        showQuizSelect();
    }
});

// ----- data.js の読み込み -----
function initializeData() {
    // data.js の global const data を利用
    let initialData = [];
    if (typeof data !== "undefined" && data && Array.isArray(data.sekaishi)) {
        initialData = data.sekaishi.map((item) => ({
            ...item,
            century: getCentury(item.year),
            isInitial: true
        }));
    } else {
        console.warn("data.sekaishi が見つかりませんでした。");
    }

    // Local Storageからユーザー追加データを読み込み
    const userAddedEvents = loadUserData();

    // 初期データとユーザー追加データをマージ
    const allEvents = [...initialData, ...userAddedEvents];

    setState({ allEvents, userAddedEvents });
}

// ----- UI イベント登録 -----
function bindUI() {
    // モード切り替え
    const inputModeBtn = document.querySelector('[data-mode="input"]');
    const quizModeBtn = document.querySelector('[data-mode="quiz"]');
    if (inputModeBtn && quizModeBtn) {
        inputModeBtn.addEventListener("click", () => switchMode("input"));
        quizModeBtn.addEventListener("click", () => {
            switchMode("quiz");
            showQuizSelect(); // クイズ選択画面を表示
        });
    }

    // 「選択に戻る」ボタン
    const backToSelectBtn = getById("back-to-select-btn");
    if (backToSelectBtn) {
        backToSelectBtn.addEventListener("click", () => {
            showQuizSelect();
        });
    }

    // 年号追加
    const addEventBtn = getById("add-event-btn");
    if (addEventBtn) {
        addEventBtn.addEventListener("click", addEvent);
    }

    // タブ切り替え
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;
            if (!target) return;
            tabButtons.forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            document
                .querySelectorAll(".tab-panel")
                .forEach((panel) => {
                    panel.classList.toggle("is-active", panel.id === `tab-${target}`);
                });
        });
    });

    // クイズ関連ボタン
    const startQuizBtn = getById("start-quiz-btn");
    const readyBackBtn = getById("ready-back-btn");
    const checkAnswerBtn = getById("check-answer-btn");
    const endQuizBtn = getById("end-quiz-btn");
    const restartQuizBtn = getById("restart-quiz-btn");

    if (startQuizBtn) {
        startQuizBtn.addEventListener("click", () => {
            if (selectedCategory) {
                startQuizFromCategory(selectedCategory);
            }
        });
    }
    if (readyBackBtn) {
        readyBackBtn.addEventListener("click", showQuizSelect);
    }
    if (checkAnswerBtn) checkAnswerBtn.addEventListener("click", checkAnswer);
    if (endQuizBtn) {
        endQuizBtn.addEventListener("click", () => {
            const ok = window.confirm("クイズを終了しますか？\n（途中までの結果が表示されます）");
            if (ok) endQuiz();
        });
    }
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener("click", () => {
            const ok = window.confirm("クイズをリスタートしますか？\n（現在のクイズ結果は削除されます）");
            if (ok) startQuiz();
        });
    }

    // Enter キーで登録・回答
    setupEnterKeys();
}

// ----- 年号データ追加 -----
function addEvent() {
    const yearInput = getById("year");
    const eventInput = getById("event");
    const categorySelect = getById("category");
    if (!yearInput || !eventInput || !categorySelect) return;

    const year = parseInt(yearInput.value, 10);
    const eventText = eventInput.value.trim();
    const category = categorySelect.value;

    if (Number.isNaN(year) || !eventText) {
        alert("年号と出来事を入力してください。");
        return;
    }

    const newItem = {
        year,
        event: eventText,
        category,
        century: getCentury(year),
        isInitial: false,
    };

    const { allEvents, userAddedEvents } = getState();
    allEvents.push(newItem);
    userAddedEvents.push(newItem);
    setState({ allEvents, userAddedEvents });

    saveUserData();
    yearInput.value = "";
    eventInput.value = "";
    renderEventLists();
}

// ----- Enter キーショートカット -----
function setupEnterKeys() {
    const eventInput = getById("event");
    const yearInput = getById("year");
    const quizAnswerInput = getById("quiz-answer");

    if (eventInput) {
        eventInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addEvent();
        });
    }
    if (yearInput) {
        yearInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addEvent();
        });
    }
    if (quizAnswerInput) {
        quizAnswerInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") checkAnswer();
        });
        quizAnswerInput.addEventListener("input", () => {
            if (quizAnswerInput.value.length > 5) {
                quizAnswerInput.value = quizAnswerInput.value.slice(0, 5);
            }
        });
    }
}
