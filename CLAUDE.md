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