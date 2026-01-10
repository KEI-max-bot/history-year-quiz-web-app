// 年号道場 UI ロジック（TypeScript版）
// data.js の data.sekaishi をベースに動きます。
// ----- 汎用 DOM ヘルパー -----
const getById = (id) => document.getElementById(id);
// ----- 状態管理 -----
let allEvents = [];
let quizEvents = [];
let currentQuizIndex = 0;
let correctCount = 0;
// カテゴリ表示の並び順
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
// ---------- 起動処理 ----------
document.addEventListener("DOMContentLoaded", () => {
    initializeData();
    bindUI();
    renderEventLists();
    // 起動時はクイズモード（入力モードが良ければ "input" に変更）
    switchMode("quiz");
});
// ---------- data.js の読み込み ----------
function initializeData() {
    // data.js の global const data を利用
    if (typeof data === "undefined" ||
        !data ||
        !Array.isArray(data.sekaishi)) {
        console.warn("data.sekaishi が見つかりませんでした。");
        allEvents = [];
        return;
    }
    allEvents = data.sekaishi.map((item) => (Object.assign(Object.assign({}, item), { century: getCentury(item.year) })));
}
// ---------- UI イベント登録 ----------
function bindUI() {
    // モード切り替え
    const inputModeBtn = document.querySelector('[data-mode="input"]');
    const quizModeBtn = document.querySelector('[data-mode="quiz"]');
    if (inputModeBtn && quizModeBtn) {
        inputModeBtn.addEventListener("click", () => switchMode("input"));
        quizModeBtn.addEventListener("click", () => switchMode("quiz"));
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
            if (!target)
                return;
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
    const checkAnswerBtn = getById("check-answer-btn");
    const endQuizBtn = getById("end-quiz-btn");
    const restartQuizBtn = getById("restart-quiz-btn");
    if (startQuizBtn)
        startQuizBtn.addEventListener("click", startQuiz);
    if (checkAnswerBtn)
        checkAnswerBtn.addEventListener("click", checkAnswer);
    if (endQuizBtn) {
        endQuizBtn.addEventListener("click", () => {
            const ok = window.confirm("クイズを終了しますか？\n（途中までの結果が表示されます）");
            if (ok)
                endQuiz();
        });
    }
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener("click", () => {
            const ok = window.confirm("クイズをリスタートしますか？\n（現在のクイズ結果は削除されます）");
            if (ok)
                startQuiz();
        });
    }
    // Enter キーで登録・回答
    setupEnterKeys();
}
// ---------- モード切り替え ----------
function switchMode(mode) {
    const panels = document.querySelectorAll(".mode-panel");
    panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === `${mode}-mode`);
    });
    const buttons = document.querySelectorAll(".mode-button");
    buttons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.mode === mode);
    });
}
// ---------- 年号データ追加 ----------
function addEvent() {
    const yearInput = getById("year");
    const eventInput = getById("event");
    const categorySelect = getById("category");
    if (!yearInput || !eventInput || !categorySelect)
        return;
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
    };
    allEvents.push(newItem);
    yearInput.value = "";
    eventInput.value = "";
    renderEventLists();
}
// ---------- 一覧の再描画 ----------
function renderEventLists() {
    const centuryContainer = getById("centuryEvents");
    const categoryContainer = getById("categorizedEvents");
    if (!centuryContainer || !categoryContainer)
        return;
    renderGroupedList(allEvents, "century", centuryContainer);
    renderGroupedList(allEvents, "category", categoryContainer);
    setupGroupToggles();
}
// ---------- グループごとのリスト描画 ----------
function renderGroupedList(items, key, container) {
    container.innerHTML = "";
    if (!items || items.length === 0) {
        container.innerHTML =
            '<p class="empty-text">まだデータが登録されていません。</p>';
        return;
    }
    const groups = {};
    items.forEach((item) => {
        const groupKey = key === "century" ? getCentury(item.year) : (item.category || "未分類");
        if (!groups[groupKey])
            groups[groupKey] = [];
        groups[groupKey].push(item);
    });
    const groupKeys = Object.keys(groups);
    groupKeys.sort((a, b) => {
        if (key === "century") {
            const parseCentury = (c) => c === "紀元前" ? -9999 : parseInt(c, 10) || 0;
            return parseCentury(a) - parseCentury(b);
        }
        if (key === "category") {
            const idxA = CATEGORY_ORDER.indexOf(a);
            const idxB = CATEGORY_ORDER.indexOf(b);
            if (idxA === -1 && idxB === -1) {
                return a.localeCompare(b, "ja");
            }
            if (idxA === -1)
                return 1;
            if (idxB === -1)
                return -1;
            return idxA - idxB;
        }
        return a.localeCompare(b, "ja");
    });
    groupKeys.forEach((groupName) => {
        const groupSection = document.createElement("section");
        groupSection.className = "group";
        const headerBtn = document.createElement("button");
        headerBtn.type = "button";
        headerBtn.className = "group-header";
        headerBtn.innerHTML = `
      <div class="group-header-main">
        <span class="group-title">${groupName}</span>
        <span class="group-count">${groups[groupName].length}</span>
      </div>
      <span class="group-chevron">⌃</span>
    `;
        const content = document.createElement("div");
        content.className = "group-content";
        const list = document.createElement("ul");
        list.className = "event-list";
        groups[groupName]
            .slice()
            .sort((a, b) => a.year - b.year)
            .forEach((item) => {
            const li = document.createElement("li");
            li.className = "event-item";
            const main = document.createElement("div");
            main.className = "event-main";
            main.innerHTML = `
          <span class="event-year">${formatYear(item.year)}</span>
          <span class="event-name">${item.event}</span>
        `;
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "ghost-button small";
            deleteBtn.textContent = "削除";
            deleteBtn.addEventListener("click", () => {
                const idx = allEvents.indexOf(item);
                if (idx !== -1) {
                    allEvents.splice(idx, 1);
                    renderEventLists();
                }
            });
            li.appendChild(main);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
        content.appendChild(list);
        groupSection.appendChild(headerBtn);
        groupSection.appendChild(content);
        container.appendChild(groupSection);
    });
}
// ---------- グループの折りたたみ ----------
function setupGroupToggles() {
    const headers = document.querySelectorAll(".group-header");
    headers.forEach((header) => {
        header.onclick = () => {
            const group = header.closest(".group");
            if (!group)
                return;
            group.classList.toggle("is-open");
        };
    });
}
// ---------- クイズ開始 ----------
function startQuiz() {
    const categorySelect = getById("category-select");
    const quizArea = getById("quiz-area");
    if (!categorySelect || !quizArea)
        return;
    const selectedCategory = categorySelect.value;
    let pool = allEvents;
    if (selectedCategory !== "全て") {
        pool = allEvents.filter((item) => item.category === selectedCategory);
    }
    if (!pool.length) {
        alert("このカテゴリにはデータがありません。");
        return;
    }
    quizEvents = shuffleArray([...pool]);
    // 履歴リセット
    const historyList = getById("quiz-history-list");
    if (historyList)
        historyList.innerHTML = "";
    currentQuizIndex = 0;
    correctCount = 0;
    const categoryLabelEl = getById("quiz-category-label");
    if (categoryLabelEl) {
        categoryLabelEl.textContent =
            selectedCategory === "全て"
                ? "全カテゴリから出題中"
                : `${selectedCategory} から出題中`;
    }
    quizArea.style.opacity = "1";
    quizArea.style.transform = "translateY(0)";
    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    if (resultEl)
        resultEl.textContent = "";
    if (scoreEl)
        scoreEl.textContent = "";
    const answerInput = getById("quiz-answer");
    if (answerInput) {
        answerInput.disabled = false;
        answerInput.value = "";
        answerInput.focus();
    }
    showNextQuestion();
}
function updateQuizProgress(isFinished = false) {
    const progressEl = getById("quiz-progress");
    if (!progressEl || !quizEvents.length)
        return;
    const total = quizEvents.length;
    const current = isFinished ? total : currentQuizIndex + 1;
    progressEl.textContent = `第${current}問 / 全${total}問`;
}
// ---------- 次の問題表示 ----------
function showNextQuestion() {
    const questionEl = getById("quiz-question");
    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    const answerInput = getById("quiz-answer");
    if (!questionEl || !resultEl || !scoreEl)
        return;
    if (!quizEvents.length)
        return;
    if (currentQuizIndex >= quizEvents.length) {
        updateQuizProgress(true);
        questionEl.textContent = "クイズ終了！";
        scoreEl.textContent = `正解数: ${correctCount} / ${quizEvents.length}`;
        setQuizExtras(null);
        if (answerInput)
            answerInput.disabled = true;
        return;
    }
    updateQuizProgress();
    const current = quizEvents[currentQuizIndex];
    questionEl.textContent = `${current.event} は何年？`;
    resultEl.textContent = "";
    scoreEl.textContent = "";
    if (answerInput) {
        answerInput.value = "";
        answerInput.disabled = false;
        answerInput.focus();
    }
    setQuizExtras(current);
}
// ---------- ノート・画像表示 ----------
function setQuizExtras(item) {
    const noteEl = getById("quiz-note");
    const imgEl = getById("quiz-image");
    const altEl = getById("quiz-alt");
    if (!noteEl || !imgEl || !altEl)
        return;
    if (!item) {
        noteEl.textContent = "";
        imgEl.style.display = "none";
        altEl.textContent = "";
        return;
    }
    if (item.note) {
        noteEl.innerHTML = `<strong>ノート：</strong>${item.note}`;
    }
    else {
        noteEl.textContent = "";
    }
    if (item.img) {
        imgEl.src = item.img;
        imgEl.alt = item.alt || "";
        imgEl.style.display = "block";
        altEl.textContent = item.alt || "";
    }
    else {
        imgEl.style.display = "none";
        altEl.textContent = "";
    }
}
// ---------- 解答履歴追加 ----------
function addHistoryItem(item, answer, isCorrect) {
    const list = getById("quiz-history-list");
    if (!list)
        return;
    const li = document.createElement("li");
    li.className = `quiz-history-item ${isCorrect ? "correct" : "wrong"}`;
    li.innerHTML = `
    <div class="quiz-history-question">${item.event}</div>
    <div class="quiz-history-answer">
      あなた：${answer}年<br>
      正解：${formatYear(item.year)}
    </div>
  `;
    list.prepend(li);
}
// ---------- クイズ回答チェック ----------
function checkAnswer() {
    if (!quizEvents.length || currentQuizIndex >= quizEvents.length)
        return;
    const answerInput = getById("quiz-answer");
    const resultEl = getById("quiz-result");
    if (!answerInput || !resultEl)
        return;
    const raw = answerInput.value.trim();
    if (!raw) {
        resultEl.textContent = "年号を入力してください。";
        return;
    }
    const answer = parseInt(raw, 10);
    if (Number.isNaN(answer)) {
        resultEl.textContent = "数字で入力してください。";
        return;
    }
    const currentItem = quizEvents[currentQuizIndex];
    const correctYear = currentItem.year;
    const isCorrect = answer === correctYear;
    if (isCorrect) {
        resultEl.textContent = "正解！";
        correctCount++;
    }
    else {
        resultEl.textContent = `不正解！ 正解は ${formatYear(correctYear)} です。`;
    }
    if (answerInput) {
        if (isCorrect) {
            answerInput.classList.add("answer-correct");
        }
        else {
            answerInput.classList.add("answer-wrong");
        }
        setTimeout(() => {
            answerInput.classList.remove("answer-correct", "answer-wrong");
        }, 400);
    }
    addHistoryItem(currentItem, answer, isCorrect);
    currentQuizIndex++;
    window.setTimeout(() => {
        resultEl.textContent = "";
        showNextQuestion();
    }, 900);
}
// ---------- クイズ終了 ----------
function endQuiz() {
    const questionEl = getById("quiz-question");
    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    const answerInput = getById("quiz-answer");
    if (!questionEl || !resultEl || !scoreEl)
        return;
    questionEl.textContent = "クイズ終了！";
    resultEl.textContent = "";
    scoreEl.textContent = `正解数: ${correctCount} / ${currentQuizIndex}`;
    if (answerInput)
        answerInput.disabled = true;
}
// ---------- 配列シャッフル ----------
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// ---------- Enter キーショートカット ----------
function setupEnterKeys() {
    const eventInput = getById("event");
    const yearInput = getById("year");
    const quizAnswerInput = getById("quiz-answer");
    if (eventInput) {
        eventInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                addEvent();
        });
    }
    if (yearInput) {
        yearInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                addEvent();
        });
    }
    if (quizAnswerInput) {
        quizAnswerInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                checkAnswer();
        });
        quizAnswerInput.addEventListener("input", () => {
            if (quizAnswerInput.value.length > 5) {
                quizAnswerInput.value = quizAnswerInput.value.slice(0, 5);
            }
        });
    }
}
// ---------- 年→世紀 ----------
function getCentury(year) {
    if (year < 0)
        return "紀元前";
    return Math.floor((year - 1) / 100 + 1) + "世紀";
}
// ---------- 年号表示 ----------
function formatYear(year) {
    if (year < 0)
        return `紀元前${Math.abs(year)}年`;
    return `${year}年`;
}
