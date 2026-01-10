// src/quiz.js - クイズ機能

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
    setState({
        quizEvents,
        currentQuizIndex: 0,
        correctCount: 0
    });

    // 履歴リセット
    const historyList = getById("quiz-history-list");
    if (historyList) historyList.innerHTML = "";

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
        questionEl.textContent = "クイズ終了！";
        scoreEl.textContent = `正解数: ${correctCount} / ${quizEvents.length}`;
        setQuizExtras(null);
        if (answerInput) answerInput.disabled = true;
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

// ----- クイズ回答チェック -----
function checkAnswer() {
    const { quizEvents, currentQuizIndex, correctCount } = getState();
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

    setState({
        currentQuizIndex: currentQuizIndex + 1,
        correctCount: newCorrectCount
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
