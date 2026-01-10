# PR: コード全体のリファクタリング

**ブランチ**: refactor/code-cleanup → main

---

## Summary
main.js（480行）を機能別に6つのファイルに分割し、XSS脆弱性を修正しました。

## Changes
- main.jsを6つのモジュールに分割（utils, state, storage, ui, quiz, app）
- XSS対策: innerHTML → textContent/createElementに変更
- data.jsをdata/sekaishi.jsに移動
- 不要ファイル削除（main.js, main.ts）

## Related Spec
- openspec/changes/code-cleanup/proposal.md
- openspec/changes/code-cleanup/design.md
- openspec/changes/code-cleanup/tasks.md

## Test Plan
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

## Known Issues
以下のバグを発見（別途対応予定）:
- openspec/issues/issue-001-reload-mode.md
- openspec/issues/issue-002-delete-closes-group.md

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
