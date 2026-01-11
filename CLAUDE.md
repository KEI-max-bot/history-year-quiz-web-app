<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## 開発フロー

### 仕様駆動開発（OpenSpec）

新機能の追加・変更時は以下のフローに従う：

1. **ブランチ作成**: `feature/機能名` でブランチを作成
2. **Proposal作成**: `openspec/changes/機能名/proposal.md` に変更の目的を記載
   - ⚠️ **ユーザーの承認が必須**
3. **Design作成**: ユーザーと対話しながら `design.md` で技術設計を合意
   - ⚠️ **ユーザーの承認が必須**
4. **Tasks作成**: ユーザーと対話しながら `tasks.md` で実装タスクを合意
   - ⚠️ **ユーザーの承認が必須**
5. **実装**: tasks.mdのチェックリストに沿って実装
6. **Spec更新**: 完了後、`openspec/specs/` の仕様書を更新
7. **マージ**: PRを作成してmainにマージ

### 重要ルール

- **proposal.md、design.md、tasks.md はすべてユーザーとの合意が必須**
- 合意前に実装を開始しない
- 各ステップでユーザーに確認を取り、承認を得てから次に進む

## ブランチ命名規則

| プレフィックス | 用途 | 例 |
|----------------|------|-----|
| `feature/` | 新機能追加 | `feature/xss-fix` |
| `fix/` | バグ修正 | `fix/bc-input-validation` |
| `docs/` | ドキュメント更新 | `docs/readme-update` |
| `refactor/` | リファクタリング | `refactor/split-modules` |
| `style/` | スタイル変更のみ | `style/dark-mode` |
| `test/` | テスト追加・修正 | `test/quiz-unit-tests` |

### 命名ルール

- 小文字のみ（大文字禁止）
- 単語区切りはハイフン（`-`）
- 日本語禁止（英語のみ）
- 短く明確に

## PR作成前の整合性チェック（必須）

**PRを作成する前に、必ず以下のチェックを実行すること：**

### 1. タイトル・メタ情報の整合性
- [ ] `index.html` と `app/index.html` のタイトルが統一されているか
- [ ] OGPタグ（og:title, og:description）が正しいか

### 2. OpenSpec整理
- [ ] 完了した変更提案が `openspec/archive/` に移動されているか
- [ ] `openspec/changes/` に不要なファイルが残っていないか

### 3. 不要ファイルの確認
- [ ] 一時ファイル（*.bak, *.tmp, *~）が残っていないか
- [ ] console.log のデバッグ出力が残っていないか

### 4. コードの整合性
- [ ] 未使用のCSS/JSが残っていないか
- [ ] HTML内のコメントアウトされた不要コードが残っていないか

### チェック実行方法

AIに `/create-pr` を依頼すると、PR作成前に上記チェックが自動実行される。
問題があれば修正してからPRを作成する。

---

## Pull Request フォーマット

PRを作成する際は以下のフォーマットに従う：

```markdown
## Summary
[変更内容を1-3行で簡潔に説明]

## Changes
- [変更点1]
- [変更点2]
- [変更点3]

## Related Spec
- openspec/changes/[機能名]/proposal.md
- openspec/changes/[機能名]/design.md
- openspec/changes/[機能名]/tasks.md

## Test Plan
- [ ] [テスト項目1]
- [ ] [テスト項目2]

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### カスタムコマンド

- `/create-pr` - 上記フォーマットでPRを作成

## コミットメッセージ規則

以下のプレフィックスを使用する：

| プレフィックス | 用途 | 例 |
|----------------|------|-----|
| `feat:` | 新機能追加 | `feat: Local Storage対応を追加` |
| `fix:` | バグ修正 | `fix: 紀元前の入力判定を修正` |
| `docs:` | ドキュメント更新 | `docs: READMEを更新` |
| `refactor:` | リファクタリング | `refactor: DOM操作を最適化` |
| `style:` | スタイル変更 | `style: ダークモードを追加` |
| `test:` | テスト追加・修正 | `test: クイズ機能のテストを追加` |
| `chore:` | 雑務（ビルド設定等） | `chore: package.jsonを更新` |

### コミットメッセージのルール

- プレフィックスは小文字
- コロンの後にスペース
- 本文は日本語OK
- 1行目は50文字以内を目安
- 複数行の場合は空行を挟む

## レビューチェックリスト

PR承認前に以下を確認する：

### 機能面
- [ ] 仕様（proposal.md/design.md）通りに実装されているか
- [ ] tasks.mdの全タスクが完了しているか
- [ ] エッジケースが考慮されているか

### コード品質
- [ ] 不要なconsole.logが残っていないか
- [ ] コメントは適切か（過不足なし）
- [ ] 命名は明確か

### セキュリティ
- [ ] XSS脆弱性がないか（innerHTML使用箇所）
- [ ] ユーザー入力のバリデーションは適切か

### テスト
- [ ] 動作確認を行ったか
- [ ] 複数ブラウザで確認したか（必要な場合）

---

## フォルダ構成

```
年号V6/
├── index.html          # リダイレクト用（→ app/index.html）
├── CLAUDE.md           # AI向け開発ルール
├── README.md           # プロジェクト説明
├── AGENTS.md           # OpenSpecエイリアス
│
├── app/                # アプリケーション本体
│   ├── index.html      # メインHTML
│   ├── style.css       # スタイルシート
│   ├── src/            # JavaScriptコード
│   │   ├── app.js      # エントリーポイント
│   │   ├── state.js    # 状態管理
│   │   ├── storage.js  # Local Storage操作
│   │   ├── ui.js       # UI操作・レンダリング
│   │   ├── quiz.js     # クイズ機能
│   │   └── utils.js    # ユーティリティ関数
│   └── data/           # データファイル
│       └── sekaishi.js # 世界史年号データ
│
├── openspec/           # 仕様駆動開発ドキュメント
│   ├── AGENTS.md       # OpenSpec設定
│   ├── project.md      # プロジェクト概要
│   ├── roadmap.md      # 開発ロードマップ
│   ├── specs/          # 仕様書
│   │   ├── test-spec.md
│   │   ├── ui-spec.md      # UI/UX設計方針
│   │   ├── data/spec.md
│   │   ├── quiz/spec.md
│   │   └── storage/spec.md
│   ├── changes/        # 進行中の変更提案
│   └── archive/        # 完了した変更提案
│
├── .claude/            # Claude Code設定
│   ├── settings.local.json
│   └── commands/       # カスタムコマンド
│       ├── create-pr.md
│       └── openspec/   # OpenSpecコマンド
│
└── .github/            # GitHub設定
    └── copilot-instructions.md
```

### app/src/ ファイルの役割

| ファイル | 役割 |
|----------|------|
| `app.js` | 起動処理、UIイベント登録、データ追加 |
| `state.js` | アプリ状態の管理、定数定義 |
| `storage.js` | Local Storageの読み書き |
| `ui.js` | モード切替、一覧描画、グループ展開 |
| `quiz.js` | クイズ開始・回答・終了の処理 |
| `utils.js` | DOM操作、年号フォーマット、シャッフル等 |

### 読み込み順序（index.html）

```html
<script src="data/sekaishi.js"></script>
<script src="src/utils.js"></script>
<script src="src/state.js"></script>
<script src="src/storage.js"></script>
<script src="src/ui.js"></script>
<script src="src/quiz.js"></script>
<script src="src/app.js"></script>
```