# Tasks: コード全体のリファクタリング

## 準備
- [ ] main.js を main.js.bak としてバックアップ
- [ ] src/ フォルダを作成
- [ ] data/ フォルダを作成

## ファイル作成

### src/utils.js
- [ ] escapeHTML 関数を作成
- [ ] formatYear 関数を移動
- [ ] getCentury 関数を移動
- [ ] shuffleArray 関数を移動
- [ ] getById ヘルパーを移動

### src/state.js
- [ ] state オブジェクトを作成
- [ ] getState 関数を作成
- [ ] setState 関数を作成
- [ ] CATEGORY_ORDER 定数を移動
- [ ] STORAGE_KEY 定数を移動

### src/storage.js
- [ ] loadUserData 関数を移動
- [ ] saveUserData 関数を移動

### src/ui.js
- [ ] switchMode 関数を移動
- [ ] renderEventLists 関数を移動
- [ ] renderGroupedList 関数を移動（XSS対策適用）
- [ ] setupGroupToggles 関数を移動
- [ ] addHistoryItem 関数を移動（XSS対策適用）
- [ ] setQuizExtras 関数を移動

### src/quiz.js
- [ ] startQuiz 関数を移動
- [ ] showNextQuestion 関数を移動
- [ ] checkAnswer 関数を移動
- [ ] endQuiz 関数を移動
- [ ] updateQuizProgress 関数を移動

### src/app.js
- [ ] initializeData 関数を作成
- [ ] bindUI 関数を作成
- [ ] addEvent 関数を移動
- [ ] setupEnterKeys 関数を移動
- [ ] DOMContentLoaded イベント処理

### data/sekaishi.js
- [ ] data.js を data/sekaishi.js に移動

## index.html 更新
- [ ] script タグの読み込み順を変更

## XSS対策
- [ ] renderGroupedList 内の innerHTML を textContent に変更
- [ ] addHistoryItem 内の innerHTML を textContent に変更
- [ ] setQuizExtras 内の innerHTML を textContent に変更

## 動作確認
- [ ] 入力モード: データ追加ができる
- [ ] 入力モード: データ削除ができる
- [ ] 入力モード: 世紀別表示が正しい
- [ ] 入力モード: カテゴリ別表示が正しい
- [ ] クイズモード: クイズ開始ができる
- [ ] クイズモード: 回答判定が正しい
- [ ] クイズモード: 履歴表示が正しい
- [ ] クイズモード: 終了・リスタートができる
- [ ] Local Storage: データが保存される
- [ ] Local Storage: ページ再読み込み後もデータが残る

## クリーンアップ
- [ ] main.js.bak を削除
- [ ] main.ts を削除（不要な場合）
- [ ] 不要なconsole.logを削除
