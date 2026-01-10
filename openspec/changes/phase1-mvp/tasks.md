# Tasks: Phase 1 MVP リリース準備

## 実装タスク一覧

### 1. ロゴ画像の準備
- [ ] `app/images/` ディレクトリを作成
- [ ] 提供されたロゴ画像を `app/images/logo.png` として保存
- [ ] favicon用に `app/images/favicon.ico` を作成（または png を使用）

### 2. アプリ名を「年号一問一答」に変更
- [ ] `app/index.html`: `<title>` を変更
- [ ] `app/index.html`: `og:title`, `og:description` を変更
- [ ] `app/index.html`: `.brand-title` を「年号一問一答」に変更
- [ ] `app/index.html`: `.brand-subtitle` を「世界史年号クイズ」に変更
- [ ] `app/index.html`: `.header-description` を更新
- [ ] `app/index.html`: footer を更新
- [ ] `index.html`: `<title>` を変更

### 3. ロゴ改善
- [ ] `app/index.html`: `.brand-mark` を画像に置換
- [ ] `app/index.html`: favicon を追加
- [ ] `app/style.css`: `.brand-mark` のスタイルを画像用に変更

### 4. 一覧のスクロール問題を解消
- [ ] `app/style.css`: `#centuryEvents`, `#categorizedEvents` にスクロール制限追加
- [ ] `app/style.css`: `.group.is-open .group-content` の `max-height` を調整

### 5. クイズ画面を一画面に収める
- [ ] `app/style.css`: `.quiz-area` の高さを調整
- [ ] `app/style.css`: `.quiz-bottom-row` の高さを調整

### 6. 画像サイズ統一
- [ ] `app/style.css`: `.quiz-image-container` の高さを制限
- [ ] `app/style.css`: `#quiz-image` のスタイルを調整

### 7. Google Analytics 導入（保留）
- [ ] 測定 ID 取得後に `app/index.html` に追加

---

## 完了条件

- [ ] 全タスク完了（GA除く）
- [ ] test-spec.md に基づく動作確認
- [ ] スマホ・PC両方で表示確認

---

## 動作確認（test-spec.md 参照）

### 入力モード
- [ ] データ追加が正常に動作する
- [ ] データ削除が正常に動作する
- [ ] 一覧表示（世紀別・カテゴリ別）が正常に動作する

### クイズモード
- [ ] クイズ開始が正常に動作する
- [ ] 回答チェックが正常に動作する
- [ ] 解答履歴が正常に表示される
- [ ] クイズ終了が正常に動作する

### その他
- [ ] モード切り替えが正常に動作する
- [ ] Local Storage にデータが保存・復元される
