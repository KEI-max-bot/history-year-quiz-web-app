# Tasks: コード全体のリファクタリング

## 準備
- [x] main.js を main.js.bak としてバックアップ
- [x] src/ フォルダを作成
- [x] data/ フォルダを作成

## ファイル作成

### src/utils.js
- [x] escapeHTML 関数を作成
- [x] formatYear 関数を移動
- [x] getCentury 関数を移動
- [x] shuffleArray 関数を移動
- [x] getById ヘルパーを移動

### src/state.js
- [x] state オブジェクトを作成
- [x] getState 関数を作成
- [x] setState 関数を作成
- [x] CATEGORY_ORDER 定数を移動
- [x] STORAGE_KEY 定数を移動

### src/storage.js
- [x] loadUserData 関数を移動
- [x] saveUserData 関数を移動

### src/ui.js
- [x] switchMode 関数を移動
- [x] renderEventLists 関数を移動
- [x] renderGroupedList 関数を移動（XSS対策適用）
- [x] setupGroupToggles 関数を移動
- [x] addHistoryItem 関数を移動（XSS対策適用）
- [x] setQuizExtras 関数を移動

### src/quiz.js
- [x] startQuiz 関数を移動
- [x] showNextQuestion 関数を移動
- [x] checkAnswer 関数を移動
- [x] endQuiz 関数を移動
- [x] updateQuizProgress 関数を移動

### src/app.js
- [x] initializeData 関数を作成
- [x] bindUI 関数を作成
- [x] addEvent 関数を移動
- [x] setupEnterKeys 関数を移動
- [x] DOMContentLoaded イベント処理

### data/sekaishi.js
- [x] data.js を data/sekaishi.js に移動

## index.html 更新
- [x] script タグの読み込み順を変更

## XSS対策
- [x] renderGroupedList 内の innerHTML を textContent に変更
- [x] addHistoryItem 内の innerHTML を textContent に変更
- [x] setQuizExtras 内の innerHTML を textContent に変更

## 動作確認
- [x] 入力モード: データ追加ができる
- [x] 入力モード: データ削除ができる
- [x] 入力モード: 世紀別表示が正しい
- [x] 入力モード: カテゴリ別表示が正しい
- [x] クイズモード: クイズ開始ができる
- [x] クイズモード: 回答判定が正しい
- [x] クイズモード: 履歴表示が正しい
- [x] クイズモード: 終了・リスタートができる
- [x] Local Storage: データが保存される
- [x] Local Storage: ページ再読み込み後もデータが残る

## クリーンアップ
- [x] main.js.bak を削除
- [x] main.ts を削除（不要な場合）
- [x] main.js を削除（分割済み）
- [x] 不要なconsole.logを削除（エラーハンドリング用のwarn/errorのみ残存）
