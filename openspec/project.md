# Project Context

## Purpose
世界史の年号を効率的に学習するためのWebベースのクイズアプリケーション。
高校生向けに設計された「年号一問一答」ツール。

## Tech Stack
- HTML5
- CSS3
- JavaScript (ES6+)
- TypeScript (オプション)
- Vanilla JS（フレームワークなし）

## Project Conventions

### Code Style
- インデント: スペース2つ
- 変数名: キャメルケース (camelCase)
- 関数名: キャメルケース (camelCase)
- 定数: 大文字スネークケース (UPPER_SNAKE_CASE)
- 日本語コメント可

### Architecture Patterns
- 単一HTMLファイルにUIを定義
- グローバルステートによる状態管理
- イベント委譲パターン
- DOM動的生成

### Testing Strategy
- ブラウザでの手動テスト
- 将来的にはJestなどの自動テスト導入を検討

### Git Workflow
- mainブランチで開発
- コミットメッセージは日本語または英語
- 機能追加時はfeatureブランチを検討

## Domain Context
- 世界史の年号データ（紀元前〜現代）
- カテゴリ別分類（古代オリエント、中世ヨーロッパ、現代世界史など）
- 約850件以上の年号データを収録
- 紀元前は負の数で表現（例: -612 = 紀元前612年）

## Important Constraints
- フレームワーク依存なし（Vanilla JS）
- モダンブラウザ対応（IE非対応）
- 画像はWikimedia Commonsから取得
- オフライン動作可能であること

## External Dependencies
- Wikimedia Commons（画像リソース）
