// src/ui.js - UI操作・レンダリング

// ----- モード切り替え -----
function switchMode(mode) {
    const panels = document.querySelectorAll(".mode-panel");
    panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === `${mode}-mode`);
    });
    const buttons = document.querySelectorAll(".mode-button");
    buttons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.mode === mode);
    });
    // モードをLocal Storageに保存
    localStorage.setItem(MODE_STORAGE_KEY, mode);

    // 入力モードのアニメーション
    if (mode === "input") {
        animateInputMode();
    }
}

// ----- 保存されたモードを取得 -----
function getSavedMode() {
    return localStorage.getItem(MODE_STORAGE_KEY) || "input";
}

// ----- 開いているグループを取得 -----
function getOpenGroups() {
    const openGroups = [];
    document.querySelectorAll(".group.is-open").forEach((group) => {
        const title = group.querySelector(".group-title");
        if (title) openGroups.push(title.textContent);
    });
    return openGroups;
}

// ----- 開いているグループを復元 -----
function restoreOpenGroups(openGroups) {
    document.querySelectorAll(".group").forEach((group) => {
        const title = group.querySelector(".group-title");
        if (title && openGroups.includes(title.textContent)) {
            group.classList.add("is-open");
        }
    });
}

// ----- 一覧の再描画 -----
function renderEventLists() {
    const { allEvents } = getState();
    const centuryContainer = getById("centuryEvents");
    const categoryContainer = getById("categorizedEvents");
    if (!centuryContainer || !categoryContainer) return;

    // 開いているグループを記録
    const openGroups = getOpenGroups();

    renderGroupedList(allEvents, "century", centuryContainer);
    renderGroupedList(allEvents, "category", categoryContainer);
    setupGroupToggles();

    // 開いていたグループを復元
    restoreOpenGroups(openGroups);

}

// ----- グループごとのリスト描画（XSS対策適用）-----
function renderGroupedList(items, key, container) {
    container.innerHTML = "";
    if (!items || items.length === 0) {
        const emptyText = document.createElement("p");
        emptyText.className = "empty-text";
        emptyText.textContent = "まだデータが登録されていません。";
        container.appendChild(emptyText);
        return;
    }
    const groups = {};
    items.forEach((item) => {
        const groupKey = key === "century" ? getCentury(item.year) : (item.category || "未分類");
        if (!groups[groupKey]) groups[groupKey] = [];
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
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
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

        // XSS対策: createElementとtextContentを使用
        const headerMain = document.createElement("div");
        headerMain.className = "group-header-main";

        const titleSpan = document.createElement("span");
        titleSpan.className = "group-title";
        // カテゴリ別の場合は年代範囲付きの表示名を使用
        titleSpan.textContent = key === "category" ? getCategoryDisplayName(groupName) : groupName;

        const countSpan = document.createElement("span");
        countSpan.className = "group-count";
        countSpan.textContent = groups[groupName].length;

        headerMain.appendChild(titleSpan);
        headerMain.appendChild(countSpan);

        const chevronSpan = document.createElement("span");
        chevronSpan.className = "group-chevron";
        chevronSpan.textContent = "⌃";

        headerBtn.appendChild(headerMain);
        headerBtn.appendChild(chevronSpan);

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

                // XSS対策: createElementとtextContentを使用
                const yearSpan = document.createElement("span");
                yearSpan.className = "event-year";
                yearSpan.textContent = formatYear(item.year);

                const nameSpan = document.createElement("span");
                nameSpan.className = "event-name";
                nameSpan.textContent = item.event;

                main.appendChild(yearSpan);
                main.appendChild(nameSpan);
                li.appendChild(main);

                // ユーザー追加データのみ削除可能
                if (!item.isInitial) {
                    const deleteBtn = document.createElement("button");
                    deleteBtn.type = "button";
                    deleteBtn.className = "ghost-button small";
                    deleteBtn.textContent = "削除";
                    deleteBtn.addEventListener("click", () => {
                        const ok = window.confirm(`「${item.event}」を削除しますか？`);
                        if (!ok) return;
                        const { allEvents, userAddedEvents } = getState();
                        // allEventsから削除
                        const idx = allEvents.indexOf(item);
                        if (idx !== -1) {
                            allEvents.splice(idx, 1);
                        }
                        // userAddedEventsから削除
                        const userIdx = userAddedEvents.indexOf(item);
                        if (userIdx !== -1) {
                            userAddedEvents.splice(userIdx, 1);
                        }
                        setState({ allEvents, userAddedEvents });
                        saveUserData();
                        renderEventLists();
                    });
                    li.appendChild(deleteBtn);
                }
                list.appendChild(li);
            });
        content.appendChild(list);
        groupSection.appendChild(headerBtn);
        groupSection.appendChild(content);
        container.appendChild(groupSection);
    });
}

// ----- グループの折りたたみ -----
function setupGroupToggles() {
    const headers = document.querySelectorAll(".group-header");
    headers.forEach((header) => {
        header.onclick = () => {
            const group = header.closest(".group");
            if (!group) return;
            group.classList.toggle("is-open");
        };
    });
}

// ----- 解答履歴追加（XSS対策適用）-----
function addHistoryItem(item, answer, isCorrect) {
    const list = getById("quiz-history-list");
    if (!list) return;
    const li = document.createElement("li");
    li.className = `quiz-history-item ${isCorrect ? "correct" : "wrong"}`;

    // XSS対策: createElementとtextContentを使用
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-history-question";
    questionDiv.textContent = item.event;

    const answerDiv = document.createElement("div");
    answerDiv.className = "quiz-history-answer";
    answerDiv.textContent = `あなた：${answer}年 / 正解：${formatYear(item.year)}`;

    li.appendChild(questionDiv);
    li.appendChild(answerDiv);
    list.prepend(li);
}

// ----- カテゴリカード描画 -----
function renderCategoryCards() {
    const grid = getById("category-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const { allEvents } = getState();

    // カテゴリごとの問題数を集計
    const categoryCounts = {};
    allEvents.forEach((item) => {
        const cat = item.category || "その他";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // カテゴリとグラデーションクラスのマッピング
    const gradientMap = {
        "古代オリエント・地中海世界": "gradient-ancient",
        "東・南アジア1": "gradient-asia1",
        "東・南アジア2": "gradient-asia2",
        "イスラーム世界": "gradient-islam",
        "中世ヨーロッパ": "gradient-medieval",
        "近代ヨーロッパ": "gradient-early-modern",
        "現代世界史1": "gradient-modern1",
        "現代世界史2": "gradient-modern2",
        "現代世界史3": "gradient-modern3",
        "その他": "gradient-other"
    };

    // カテゴリと画像ファイルのマッピング
    const imageMap = {
        "古代オリエント・地中海世界": "images/categories/モーゼの海割り.png",
    };

    // CATEGORY_ORDERに従って各カテゴリカードを作成
    CATEGORY_ORDER.forEach((category) => {
        const count = categoryCounts[category] || 0;
        if (count === 0) return; // 問題がないカテゴリはスキップ

        const card = document.createElement("div");
        card.className = "category-card";
        card.dataset.category = category;

        const imageDiv = document.createElement("div");
        imageDiv.className = `category-card-image ${gradientMap[category] || "gradient-other"}`;

        // 画像がある場合は追加
        if (imageMap[category]) {
            const img = document.createElement("img");
            img.src = imageMap[category];
            img.alt = category;
            img.loading = "lazy";
            imageDiv.appendChild(img);
        }

        const infoDiv = document.createElement("div");
        infoDiv.className = "category-card-info";

        const nameP = document.createElement("p");
        nameP.className = "category-card-name";
        nameP.textContent = category;

        const countP = document.createElement("p");
        countP.className = "category-card-count";
        countP.textContent = `${count}問`;

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(countP);
        card.appendChild(imageDiv);
        card.appendChild(infoDiv);

        card.addEventListener("click", () => {
            showQuizReady(category);
        });

        grid.appendChild(card);
    });

    // 全カテゴリカードを追加
    const totalCount = allEvents.length;
    if (totalCount > 0) {
        const allCard = document.createElement("div");
        allCard.className = "category-card category-card-all";
        allCard.dataset.category = "全て";

        const allImageDiv = document.createElement("div");
        allImageDiv.className = "category-card-image gradient-all";

        const allInfoDiv = document.createElement("div");
        allInfoDiv.className = "category-card-info";

        const allNameP = document.createElement("p");
        allNameP.className = "category-card-name";
        allNameP.textContent = "全カテゴリ";

        const allCountP = document.createElement("p");
        allCountP.className = "category-card-count";
        allCountP.textContent = `${totalCount}問`;

        allInfoDiv.appendChild(allNameP);
        allInfoDiv.appendChild(allCountP);
        allCard.appendChild(allImageDiv);
        allCard.appendChild(allInfoDiv);

        allCard.addEventListener("click", () => {
            showQuizReady("全て");
        });

        grid.appendChild(allCard);
    }

    // カードに順番にアニメーションを適用
    animateCategoryCards();
}

// ----- カードアニメーション -----
function animateCategoryCards() {
    const cards = document.querySelectorAll(".category-card");
    cards.forEach((card, index) => {
        // 遅延を付けて順番にアニメーション
        setTimeout(() => {
            card.classList.add("animate-in");
        }, 100 + index * 80); // 0.1秒後から、0.08秒間隔で
    });
}

// ----- 入力モードアニメーション -----
function animateInputMode() {
    const inputMode = getById("input-mode");
    if (!inputMode) return;

    // アニメーション対象の要素と遅延時間
    const animations = [
        { selector: ".card:first-of-type", delay: 0 },
        { selector: ".card:first-of-type .card-title", delay: 50 },
        { selector: ".card:first-of-type .card-subtitle", delay: 100 },
        { selector: ".form-grid", delay: 150 },
        { selector: ".card:last-of-type", delay: 100 },
        { selector: ".card:last-of-type .card-title", delay: 150 },
        { selector: ".card:last-of-type .card-subtitle", delay: 200 },
        { selector: ".tabs", delay: 250 },
        { selector: "#centuryEvents", delay: 300 },
        { selector: "#categorizedEvents", delay: 300 },
    ];

    // 既存のアニメーションクラスをリセット
    inputMode.querySelectorAll(".animate-in").forEach(el => {
        el.classList.remove("animate-in");
    });

    // 順番にアニメーションを適用
    animations.forEach(({ selector, delay }) => {
        const el = inputMode.querySelector(selector);
        if (el) {
            setTimeout(() => {
                el.classList.add("animate-in");
            }, delay);
        }
    });
}

// ----- クイズ画面遷移 -----
function showQuizSelect() {
    const selectEl = getById("quiz-select");
    const readyEl = getById("quiz-ready");
    const playEl = getById("quiz-play");
    if (selectEl) selectEl.style.display = "block";
    if (readyEl) readyEl.style.display = "none";
    if (playEl) playEl.style.display = "none";
    document.body.classList.remove("quiz-play-active");
    renderCategoryCards();
}

// 準備画面を表示
let selectedCategory = null;

function showQuizReady(category) {
    selectedCategory = category;

    const selectEl = getById("quiz-select");
    const readyEl = getById("quiz-ready");
    const playEl = getById("quiz-play");

    if (selectEl) selectEl.style.display = "none";
    if (readyEl) readyEl.style.display = "flex";
    if (playEl) playEl.style.display = "none";

    // カテゴリ情報を設定
    const titleEl = getById("ready-title");
    const subtitleEl = getById("ready-subtitle");
    const countEl = getById("ready-count");
    const iconEl = getById("ready-category-icon");

    const displayName = category === "全て" ? "全カテゴリ" : category;
    const subtitle = category === "全て" ? "すべてのカテゴリから出題" : getCategoryDisplayName(category);

    if (titleEl) titleEl.textContent = displayName;
    if (subtitleEl) subtitleEl.textContent = subtitle !== displayName ? subtitle : "";

    // 問題数を取得
    const { allEvents } = getState();
    const count = category === "全て"
        ? allEvents.length
        : allEvents.filter(e => e.category === category).length;
    if (countEl) countEl.textContent = count;

    // アイコン（グラデーション）を設定
    const gradientMap = {
        "古代オリエント・地中海世界": "gradient-ancient",
        "東・南アジア1": "gradient-asia1",
        "東・南アジア2": "gradient-asia2",
        "イスラーム世界": "gradient-islam",
        "中世ヨーロッパ": "gradient-medieval",
        "近代ヨーロッパ": "gradient-early-modern",
        "現代世界史1": "gradient-modern1",
        "現代世界史2": "gradient-modern2",
        "現代世界史3": "gradient-modern3",
        "その他": "gradient-other",
        "全て": "gradient-all"
    };

    if (iconEl) {
        iconEl.className = `ready-category-icon ${gradientMap[category] || "gradient-other"}`;
        // アニメーションをリセット
        iconEl.style.animation = "none";
        iconEl.offsetHeight; // リフロー
        iconEl.style.animation = "";
    }
}

function showQuizPlay(categoryName) {
    const selectEl = getById("quiz-select");
    const readyEl = getById("quiz-ready");
    const playEl = getById("quiz-play");
    const titleEl = getById("quiz-play-title");
    if (selectEl) selectEl.style.display = "none";
    if (readyEl) readyEl.style.display = "none";
    if (playEl) playEl.style.display = "block";
    document.body.classList.add("quiz-play-active");
    if (titleEl) {
        titleEl.textContent = categoryName === "全て" ? "全カテゴリ" : categoryName;
    }
}

// ----- ノート・画像表示（XSS対策適用）-----
function setQuizExtras(item) {
    const noteEl = getById("quiz-note");
    const imgEl = getById("quiz-image");
    const altEl = getById("quiz-alt");
    if (!noteEl || !imgEl || !altEl) return;
    if (!item) {
        noteEl.textContent = "";
        imgEl.style.display = "none";
        altEl.textContent = "";
        return;
    }
    if (item.note) {
        // XSS対策: textContentを使用
        noteEl.textContent = `ノート：${item.note}`;
    } else {
        noteEl.textContent = "";
    }
    if (item.img) {
        imgEl.src = item.img;
        imgEl.alt = item.alt || "";
        imgEl.style.display = "block";
        altEl.textContent = item.alt || "";
    } else {
        imgEl.style.display = "none";
        altEl.textContent = "";
    }
}

// ----- カラムリサイズ機能 -----
const RESIZE_STORAGE_KEY = "nengo-quiz-column-width";
const MIN_COLUMN_RATIO = 0.4; // 左カラム最小比率（40%）= デフォルトが最小
const MAX_COLUMN_RATIO = 0.5; // 左カラム最大比率（50%）= 少し広げられる

function setupColumnResize() {
    const handle = getById("resize-handle");
    const inputMode = getById("input-mode");
    if (!handle || !inputMode) return;

    // 保存された幅を復元
    const savedWidth = localStorage.getItem(RESIZE_STORAGE_KEY);
    if (savedWidth) {
        inputMode.style.setProperty("--input-col-width", savedWidth);
    }

    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    function onMouseDown(e) {
        isDragging = true;
        startX = e.clientX;
        const rect = inputMode.getBoundingClientRect();
        const leftCard = inputMode.querySelector(".card:first-of-type");
        if (leftCard) {
            startWidth = leftCard.getBoundingClientRect().width;
        }
        handle.classList.add("is-dragging");
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const containerWidth = inputMode.getBoundingClientRect().width;
        let newWidth = startWidth + deltaX;

        // 最小幅制限（デフォルト40%より縮められない）
        const minWidth = containerWidth * MIN_COLUMN_RATIO;
        if (newWidth < minWidth) {
            newWidth = minWidth;
        }

        // 最大幅制限（50%まで広げられる）
        const maxWidth = containerWidth * MAX_COLUMN_RATIO;
        if (newWidth > maxWidth) {
            newWidth = maxWidth;
        }

        const widthPercent = (newWidth / containerWidth) * 100;
        inputMode.style.setProperty("--input-col-width", `${widthPercent}%`);
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        handle.classList.remove("is-dragging");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        // 幅を保存
        const currentWidth = inputMode.style.getPropertyValue("--input-col-width");
        if (currentWidth) {
            localStorage.setItem(RESIZE_STORAGE_KEY, currentWidth);
        }
    }

    handle.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // タッチ対応
    handle.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        onMouseDown({ clientX: touch.clientX, preventDefault: () => e.preventDefault() });
    });

    document.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        onMouseMove({ clientX: touch.clientX });
    });

    document.addEventListener("touchend", onMouseUp);
}
