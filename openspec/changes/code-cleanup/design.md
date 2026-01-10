# Design: コード全体のリファクタリング

## フォルダ構成

```
src/
├── app.js           # エントリーポイント（初期化・イベント登録）
├── state.js         # 状態管理（allEvents, quizEvents等）
├── storage.js       # Local Storage操作（load/save）
├── quiz.js          # クイズ機能（開始・回答・終了）
├── ui.js            # UI操作・レンダリング（DOM生成）
└── utils.js         # ユーティリティ（formatYear, getCentury, escapeHTML等）
data/
└── sekaishi.js      # 年号データ（data.jsから移動・リネーム）
index.html           # HTMLファイル（script読み込み順を変更）
style.css            # スタイル（変更なし）
```

## 各ファイルの責務

### src/app.js
- DOMContentLoaded時の初期化
- 各モジュールの呼び出し
- イベントリスナーの登録

### src/state.js
- グローバル状態の管理
- 状態の取得・更新関数

```javascript
// 状態
let state = {
  allEvents: [],
  userAddedEvents: [],
  quizEvents: [],
  currentQuizIndex: 0,
  correctCount: 0
};

// 取得・更新関数
function getState() { return state; }
function setState(newState) { state = { ...state, ...newState }; }
```

### src/storage.js
- Local Storageへの保存
- Local Storageからの読み込み
- エラーハンドリング

### src/quiz.js
- クイズ開始（startQuiz）
- 回答チェック（checkAnswer）
- 次の問題表示（showNextQuestion）
- クイズ終了（endQuiz）

### src/ui.js
- モード切り替え（switchMode）
- 年号一覧のレンダリング（renderEventLists）
- グループ表示（renderGroupedList）
- 履歴表示（addHistoryItem）

### src/utils.js
- formatYear: 年号の表示形式変換
- getCentury: 年号→世紀変換
- escapeHTML: XSS対策（新規追加）
- shuffleArray: 配列シャッフル

```javascript
// XSS対策
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
```

## XSS対策

### 変更前（危険）
```javascript
main.innerHTML = `
  <span class="event-year">${formatYear(item.year)}</span>
  <span class="event-name">${item.event}</span>
`;
```

### 変更後（安全）
```javascript
const yearSpan = document.createElement('span');
yearSpan.className = 'event-year';
yearSpan.textContent = formatYear(item.year);

const nameSpan = document.createElement('span');
nameSpan.className = 'event-name';
nameSpan.textContent = item.event;

main.appendChild(yearSpan);
main.appendChild(nameSpan);
```

## index.htmlの変更

```html
<!-- 変更前 -->
<script src="data.js"></script>
<script src="main.js"></script>

<!-- 変更後 -->
<script src="data/sekaishi.js"></script>
<script src="src/utils.js"></script>
<script src="src/state.js"></script>
<script src="src/storage.js"></script>
<script src="src/ui.js"></script>
<script src="src/quiz.js"></script>
<script src="src/app.js"></script>
```

## 移行方針

1. 既存のmain.jsは削除せず、main.js.bakとしてバックアップ
2. 機能ごとにファイルを作成
3. 動作確認しながら段階的に移行
4. 全機能が動作確認できたらmain.js.bakを削除
