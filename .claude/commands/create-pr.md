# PR作成コマンド

現在のブランチからPull Requestを作成します。

## ⚠️ 整合性チェック（PR作成前に必須実行）

**PRを作成する前に、以下のチェックをすべて実行すること：**

### Step 1: タイトル・メタ情報の確認
```bash
# タイトルの確認
grep -h "<title>" index.html app/index.html
```
- `index.html` と `app/index.html` のタイトルが統一されているか確認

### Step 2: OpenSpec整理
```bash
# 完了した変更提案がarchiveに移動されているか確認
ls openspec/changes/
ls openspec/archive/
```
- 完了した機能の変更提案は `openspec/archive/` に移動する
- `openspec/changes/` には進行中のものだけ残す

### Step 3: 不要ファイルの確認
```bash
# 一時ファイルの確認
find . -name "*.bak" -o -name "*.tmp" -o -name "*~" 2>/dev/null

# console.logの確認
grep -r "console.log" app/src/ --include="*.js"
```
- 一時ファイルがあれば削除
- デバッグ用console.logがあれば削除

### Step 4: 問題があれば修正
- 上記チェックで問題が見つかった場合は、修正してコミットしてからPR作成に進む

---

## 実行手順

1. **整合性チェック実行**（上記Step 1-4）
2. 現在のブランチ名とmainブランチとの差分を確認
3. コミット履歴を確認
4. 以下のフォーマットでPRを作成

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
- **整合性チェックを必ず実行してからPRを作成する**
