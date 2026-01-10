# Storage Specification

## Purpose
ユーザーが追加した年号データをLocal Storageに保存し、ページ再読み込み後も永続化する。

## Requirements

### Requirement: データの保存
システムはユーザーが追加したデータをLocal Storageに保存しなければならない。

#### Scenario: データ追加時の自動保存
- GIVEN ユーザーが入力モードでデータを追加する
- WHEN 「追加」ボタンが押される
- THEN システムはデータをLocal Storageに保存する

#### Scenario: データ削除時の自動保存
- GIVEN ユーザーがデータを削除する
- WHEN 削除が完了する
- THEN システムは更新されたデータをLocal Storageに保存する

---

### Requirement: データの復元
システムは起動時にLocal Storageからデータを復元しなければならない。

#### Scenario: 起動時のデータ読み込み
- GIVEN アプリケーションが起動する
- WHEN DOMContentLoadedイベントが発火する
- THEN システムはLocal Storageからユーザー追加データを読み込む
- AND data.jsの初期データとマージする

#### Scenario: Local Storageが空の場合
- GIVEN Local Storageにデータがない
- WHEN アプリケーションが起動する
- THEN システムはdata.jsの初期データのみを使用する

---

### Requirement: データの分離
システムは初期データとユーザー追加データを区別しなければならない。

#### Scenario: 初期データは削除不可
- GIVEN data.jsに含まれる初期データがある
- WHEN ユーザーが削除ボタンを押す
- THEN 初期データは削除されない（または警告を表示）

#### Scenario: ユーザー追加データのみ保存
- GIVEN ユーザーがデータを追加した
- WHEN Local Storageに保存する
- THEN ユーザーが追加したデータのみを保存する（初期データは含めない）

---

### Requirement: ストレージキー
システムは一意のキーでデータを管理しなければならない。

#### Scenario: キー名
- GIVEN データを保存する
- WHEN Local Storageにアクセスする
- THEN キー名は "nengo-quiz-user-data" を使用する

---

### Requirement: エラーハンドリング
システムはLocal Storageのエラーを適切に処理しなければならない。

#### Scenario: ストレージ容量超過
- GIVEN Local Storageの容量が上限に達している
- WHEN データを保存しようとする
- THEN システムはエラーメッセージを表示し、操作は継続可能

#### Scenario: データ破損
- GIVEN Local Storageのデータが破損している
- WHEN データを読み込もうとする
- THEN システムは初期データのみで起動し、破損データを無視する
