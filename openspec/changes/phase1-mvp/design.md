# Design: Phase 1 MVP リリース準備

## デザイン方針

**Apple風UI/UX**（ui-spec.md に準拠）
- ミニマリズム：余白を活用、詰め込まない
- 視覚的ヒエラルキー：重要な要素を強調
- 一貫性：色、角丸、影、間隔のルール統一

---

## 1. アプリ名を「年号一問一答」に変更

### 変更箇所

| ファイル | 変更内容 |
|----------|----------|
| `app/index.html` | `<title>`, `og:title`, `og:description`, `.brand-title`, `.brand-subtitle`, `.header-description`, footer |
| `index.html` | `<title>` |

### 新しい名称

- **アプリ名**: 年号一問一答
- **サブタイトル**: 世界史年号クイズ

---

## 2. ロゴ改善

### 現状

```html
<div class="brand-mark">世</div>
```

テキストのみ、シンプルすぎる。

### 改善案

提供されたシルエット画像（歴史的な軍人）を使用：

1. **画像を favicon & ロゴとして使用**
   - `app/images/logo.png` として保存
   - favicon として設定
   - ヘッダーのブランドマークを画像に置換

2. **HTML 変更**
```html
<div class="brand-mark">
  <img src="images/logo.png" alt="年号一問一答" />
</div>
```

3. **CSS 変更**
```css
.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f7, #e8e8ed);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

---

## 3. 一覧のスクロール問題を解消

### 現状の問題

- グループ展開時にページ全体が長くなる
- 複数グループを開くと下までスクロールが必要

### 解決策

一覧コンテナ全体にスクロール制限を追加：

```css
#centuryEvents,
#categorizedEvents {
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* グループ内のmax-heightを解除（親でスクロール制御） */
.group.is-open .group-content {
  max-height: none;
}
```

---

## 4. クイズ画面を一画面に収める

### 現状

- `height: 70vh` で制限されているが、画像が大きいと溢れる場合あり

### 解決策

```css
.quiz-area {
  height: calc(100vh - 280px); /* ヘッダー・ナビ分を引く */
  min-height: 400px;
  max-height: 70vh;
}

.quiz-bottom-row {
  flex: 1;
  min-height: 0;
  max-height: 40%;
}
```

---

## 5. 画像サイズ統一

### 解決策

```css
.quiz-image-container {
  max-height: 180px;
  aspect-ratio: 16 / 9;
}

.quiz-image-container::before {
  display: none; /* padding-top による高さ指定を解除 */
}

#quiz-image {
  position: relative;
  inset: auto;
  max-height: 100%;
  width: auto;
  margin: 0 auto;
}
```

---

## 6. Google Analytics 導入

### 実装方法

測定 ID 取得後、`app/index.html` の `<head>` 内に追加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**ステータス**: 測定 ID 未取得のため、後から追加

---

## ファイル変更一覧

| ファイル | 変更内容 |
|----------|----------|
| `app/index.html` | アプリ名変更、ロゴ画像、favicon |
| `app/style.css` | ロゴスタイル、スクロール改善、画像サイズ調整 |
| `app/images/logo.png` | 新規追加（ロゴ画像） |
| `index.html` | タイトル変更 |

---

## 保留事項

- [ ] Google Analytics の測定 ID（後から追加可能）
