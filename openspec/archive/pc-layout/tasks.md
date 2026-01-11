# Tasks: PC版レイアウト刷新

## Phase 1: クイズ解答画面 + プログレスバー

### 1.1 プログレスバー実装
- [x] `app/style.css`: プログレスバーのCSS追加
  - `.progress-bar` コンテナ
  - `.progress-segment` 各セグメント（correct/wrong/current/pending）
- [x] `app/src/quiz.js`: プログレスバー描画関数追加
  - `renderProgressBar()` 関数
  - 回答結果の配列管理
- [x] `app/index.html`: プログレスバー用HTML追加

### 1.2 正答率表示
- [x] `app/src/state.js`: 正答率計算用の状態追加
- [x] `app/src/quiz.js`: 正答率計算・表示関数
- [x] `app/index.html`: 正答率表示エリア追加

### 1.3 クイズ解答画面レイアウト（PC版）
- [x] `app/style.css`: PC用メディアクエリ追加（768px以上）
- [x] `app/style.css`: 2カラムレイアウト（左:画像+問題、右:履歴）
- [x] `app/style.css`: 画像を上部に大きく表示
- [x] `app/style.css`: 1画面完結（height: 100vh - header）

---

## Phase 2: クイズ選択画面

### 2.1 画面構造
- [x] `app/index.html`: クイズ選択画面のHTML追加
  - `#quiz-select` セクション
  - カテゴリカードのコンテナ
- [x] `app/src/ui.js`: クイズ選択画面の表示/非表示切り替え

### 2.2 カテゴリカード
- [x] `app/style.css`: カテゴリカードのCSS
  - `.category-card` 基本スタイル
  - `.category-card-image` 画像エリア
  - `.category-card-info` テキストエリア
  - ホバーエフェクト
- [x] `app/src/quiz.js`: カテゴリごとの問題数取得関数
- [x] `app/src/ui.js`: カテゴリカード描画関数

### 2.3 カテゴリ画像
- [x] `app/images/categories/` ディレクトリ作成
- [ ] カテゴリ画像の追加（ユーザーが後で追加）
- [x] `app/style.css`: 画像フォールバック（グラデーション背景）

### 2.4 画面遷移
- [x] `app/src/quiz.js`: カテゴリ選択 → クイズ開始の連携
- [x] `app/src/ui.js`: 「選択に戻る」ボタンの実装
- [x] `app/src/state.js`: 選択中カテゴリの状態管理（既存のcategory-selectを活用）

---

## Phase 3: 全体調整

### 3.1 ヘッダー調整
- [x] `app/style.css`: PC版ヘッダーの微調整
- [x] `app/index.html`: 戻るボタンの追加（クイズ解答画面用）

### 3.2 レスポンシブ対応確認
- [ ] 768px以上: PC版レイアウト適用確認
- [ ] 767px以下: モバイル版（現状維持）確認

### 3.3 動作テスト
- [ ] クイズ選択 → 解答 → 終了の一連フロー
- [ ] プログレスバーの正常動作
- [ ] 正答率の正確な計算
- [ ] 「選択に戻る」の動作

---

## 完了条件

- [ ] PC画面でスクロールなしで操作完結
- [ ] プログレスバーが正解/不正解/現在/未回答を正しく表示
- [ ] 正答率がリアルタイムで更新される
- [ ] カテゴリ選択画面からクイズを開始できる
- [ ] モバイル表示に影響がない

---

## 備考

- カテゴリ画像はユーザーが後で追加予定
- 画像がない場合はグラデーション背景でフォールバック
