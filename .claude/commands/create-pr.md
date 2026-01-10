# PR作成コマンド

現在のブランチからPull Requestを作成します。

## 実行手順

1. 現在のブランチ名とmainブランチとの差分を確認
2. コミット履歴を確認
3. 以下のフォーマットでPRを作成

## PRフォーマット

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

## 実行コマンド

```bash
gh pr create --title "[タイトル]" --body "[上記フォーマットの本文]"
```

## 注意事項

- PRタイトルはブランチ名から推測して日本語で作成
- mainブランチへのPRを作成
- openspec/changes/ 配下の関連ファイルをリンク
