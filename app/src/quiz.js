// src/quiz.js - クイズ機能

// ----- カテゴリ選択からクイズ開始 -----
function startQuizFromCategory(category) {
    // category-selectの値を設定（互換性維持）
    const categorySelect = getById("category-select");
    if (categorySelect) {
        categorySelect.value = category;
    }

    // クイズ画面に遷移
    showQuizPlay(category);

    // クイズを開始
    startQuiz();
}

// ----- クイズ開始 -----
function startQuiz() {
    const categorySelect = getById("category-select");
    const quizArea = getById("quiz-area");
    if (!categorySelect || !quizArea) return;

    const { allEvents } = getState();
    const selectedCategory = categorySelect.value;
    let pool = allEvents;
    if (selectedCategory !== "全て") {
        pool = allEvents.filter((item) => item.category === selectedCategory);
    }
    if (!pool.length) {
        alert("このカテゴリにはデータがありません。");
        return;
    }

    const quizEvents = shuffleArray([...pool]);
    const quizResults = new Array(quizEvents.length).fill(null);
    setState({
        quizEvents,
        currentQuizIndex: 0,
        correctCount: 0,
        quizResults
    });

    // 履歴リセット
    const historyList = getById("quiz-history-list");
    if (historyList) historyList.innerHTML = "";

    quizArea.style.opacity = "1";
    quizArea.style.transform = "translateY(0)";

    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    if (resultEl) resultEl.textContent = "";
    if (scoreEl) scoreEl.textContent = "";

    const answerInput = getById("quiz-answer");
    if (answerInput) {
        answerInput.disabled = false;
        answerInput.value = "";
        answerInput.focus();
    }
    showNextQuestion();
}

// ----- 進捗表示 -----
function updateQuizProgress(isFinished = false) {
    const progressEl = getById("quiz-progress");
    const { quizEvents, currentQuizIndex } = getState();
    if (!progressEl || !quizEvents.length) return;
    const total = quizEvents.length;
    const current = isFinished ? total : currentQuizIndex + 1;
    progressEl.textContent = `第${current}問 / 全${total}問`;
}

// ----- プログレスバー描画 -----
function renderProgressBar() {
    const container = getById("progress-bar-container");
    if (!container) return;

    const { quizEvents, currentQuizIndex, quizResults, correctCount } = getState();
    if (!quizEvents.length) {
        container.style.display = "none";
        return;
    }

    container.style.display = "flex";
    const total = quizEvents.length;
    const answered = quizResults.filter(r => r !== null).length;

    // プログレスバーのセグメントを生成
    const progressBar = getById("progress-bar");
    if (progressBar) {
        progressBar.innerHTML = "";
        for (let i = 0; i < total; i++) {
            const segment = document.createElement("div");
            segment.className = "progress-segment";

            if (quizResults[i] === "correct") {
                segment.classList.add("correct");
            } else if (quizResults[i] === "wrong") {
                segment.classList.add("wrong");
            } else if (i === currentQuizIndex) {
                segment.classList.add("current");
            } else {
                segment.classList.add("pending");
            }
            progressBar.appendChild(segment);
        }
    }

    // 問題数表示（終了時はtotalを超えないようにする）
    const countEl = getById("progress-count");
    if (countEl) {
        const displayIndex = Math.min(currentQuizIndex + 1, total);
        countEl.textContent = `${displayIndex}/${total}問`;
    }

    // 正答率表示（常に表示してレイアウトを固定）
    const accuracyEl = getById("progress-accuracy");
    if (accuracyEl) {
        if (answered > 0) {
            const rate = Math.round((correctCount / answered) * 100);
            accuracyEl.textContent = `正答率 ${rate}%`;
            accuracyEl.classList.remove("good", "bad");
            if (rate >= 70) {
                accuracyEl.classList.add("good");
            } else if (rate < 50) {
                accuracyEl.classList.add("bad");
            }
        } else {
            accuracyEl.textContent = "正答率 --%";
            accuracyEl.classList.remove("good", "bad");
        }
    }
}

// ----- 次の問題表示 -----
function showNextQuestion() {
    const questionEl = getById("quiz-question");
    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    const answerInput = getById("quiz-answer");
    if (!questionEl || !resultEl || !scoreEl) return;

    const { quizEvents, currentQuizIndex, correctCount } = getState();
    if (!quizEvents.length) return;

    if (currentQuizIndex >= quizEvents.length) {
        updateQuizProgress(true);
        renderProgressBar();
        questionEl.textContent = "クイズ終了！";
        scoreEl.textContent = `正解数: ${correctCount} / ${quizEvents.length}`;
        setQuizExtras(null);
        if (answerInput) answerInput.disabled = true;
        return;
    }
    updateQuizProgress();
    renderProgressBar();
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

// ----- クイズ回答チェック -----
function checkAnswer() {
    const { quizEvents, currentQuizIndex, correctCount, quizResults } = getState();
    if (!quizEvents.length || currentQuizIndex >= quizEvents.length) return;

    const answerInput = getById("quiz-answer");
    const resultEl = getById("quiz-result");
    if (!answerInput || !resultEl) return;

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

    let newCorrectCount = correctCount;
    if (isCorrect) {
        resultEl.textContent = "正解！";
        newCorrectCount++;
    } else {
        resultEl.textContent = `不正解！ 正解は ${formatYear(correctYear)} です。`;
    }

    if (answerInput) {
        if (isCorrect) {
            answerInput.classList.add("answer-correct");
        } else {
            answerInput.classList.add("answer-wrong");
        }
        setTimeout(() => {
            answerInput.classList.remove("answer-correct", "answer-wrong");
        }, 400);
    }

    addHistoryItem(currentItem, answer, isCorrect);

    // 回答結果を記録
    const newQuizResults = [...quizResults];
    newQuizResults[currentQuizIndex] = isCorrect ? "correct" : "wrong";

    setState({
        currentQuizIndex: currentQuizIndex + 1,
        correctCount: newCorrectCount,
        quizResults: newQuizResults
    });

    window.setTimeout(() => {
        resultEl.textContent = "";
        showNextQuestion();
    }, 900);
}

// ----- クイズ終了 -----
function endQuiz() {
    const questionEl = getById("quiz-question");
    const resultEl = getById("quiz-result");
    const scoreEl = getById("quiz-score");
    const answerInput = getById("quiz-answer");
    if (!questionEl || !resultEl || !scoreEl) return;

    const { correctCount, currentQuizIndex } = getState();
    questionEl.textContent = "クイズ終了！";
    resultEl.textContent = "";
    scoreEl.textContent = `正解数: ${correctCount} / ${currentQuizIndex}`;
    if (answerInput) answerInput.disabled = true;
}
