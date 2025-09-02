# Remote Play Inviter（クライアント）

Steam の Remote Play Together を、Discord などの外部サービス経由で友だちに招待するためのクライアントです。起動中の Steam クライアントと連携し、バックエンド（WebSocket サーバー）からの指示に応じて現在のゲームIDの取得や招待リンクの生成を行います。

- 実装言語: Rust + C++（OpenSteamworks を利用）
- 対応OS: Windows / macOS（Intel, Apple Silicon）/ Linux（AppImage 配布）
- ランタイム: Steam クライアントが動作していることが前提

## 特長
- 起動中ゲームの AppID を検出し、Remote Play Together 対応可否を判定
- WebSocket 経由でバックエンドと通信し、招待リンクを生成・応答
- 参加/離脱イベント（ゲストID）をコールバックで受け取りログ表示
- 指示があればメッセージをクリップボードにコピー
- Linux 向け AppImage を GitHub Actions で自動ビルド

## 動作要件
- Steam クライアントが起動済み
- Remote Play Together 対応タイトルが起動中
- バックエンドの WebSocket サーバー（`ENDPOINT_URL`）
- Rust ツールチェーン（nightly-2024-07-27 を使用）
- C/C++ ビルドツール（cmake, clang/VS Build Tools 等）
- OS ごとの依存（例）
  - Windows: MSVC 環境（`x86_64-pc-windows-msvc`）
  - macOS: Xcode Command Line Tools（動的シンボル解決を使用）
  - Linux: `cmake`, `clang`, `build-essential`, など（CI では `libssl-dev`, `libxcb-xfixes0-dev` も導入）

## インストール / ビルド
このリポジトリはサブクレート `steam-stuff`（C++/CMake 連携）と OpenSteamworks（サブモジュール）を含みます。

1) Rust ツールチェーンをインストール
- `rust-toolchain.toml` により `nightly-2024-07-27` が固定されます。

2) 依存ツールのインストール
- Windows: Visual Studio Build Tools（MSVC）, CMake
- macOS: Xcode Command Line Tools, CMake
- Linux: `cmake clang build-essential`（必要に応じて `libssl-dev libxcb-xfixes0-dev`）

3) エンドポイント設定（ビルド時）
- 既定の接続先はビルド時に `.env` の `ENDPOINT_URL` から埋め込まれます。
  - 例: `.env` に `ENDPOINT_URL=ws://localhost:8080` を記載

4) ビルド
- リリースビルド: `cargo build --release`
- 生成物: `target/<target-triple>/release/remoteplay-inviter[.exe]`

GitHub Releases は `v*` タグの push でトリガーされ、以下を出力します。
- Windows: `remoteplay-inviter.exe`
- macOS (Intel/Apple Silicon): `remoteplay-inviter-macos[-intel]`
- Linux: `remoteplay-inviter.AppImage`

## 使い方
1) Steam を起動し、Remote Play Together 対応ゲームを起動
2) 本クライアントを起動
3) バックエンド（例: Discord ボットと連携するサーバー）からの指示に従い、ゲームIDの提供や招待リンクの生成を行います

コマンドラインオプション:
- `-v, --version`: バージョン表示
- `-h, --help`: ヘルプ表示

起動後の主なログ例:
- `-> Create Panel : claimer=..., game_id=...`
- `-> Create Invite Link : claimer=..., guest_id=..., invite_url=...`
- `-> Player Joined/Left : claimer=..., guest_id=..., steam_id=...`

終了は `Ctrl+C`。

## 設定
接続先 URL は以下の優先順で決まります。

1) 実行ファイルと同じ場所の `remoteplay-inviter.endpoint.toml`
- 内容例:
  ```toml
  url = "wss://example.com/ws"
  ```

2) ビルド時に `.env` から埋め込まれた `ENDPOINT_URL`
- `.env.sample` に例が含まれます（`ws://localhost:8080`）。

初回起動時に、同ディレクトリへ UUID を含む `remoteplay-inviter.config.toml` が生成されます。これはサーバー側でクライアント識別に用いられます。

## リポジトリ構成（概要）
- `src/`
  - `main.rs`: WebSocket クライアント本体。サーバーと通信し、ハンドラを呼び出し。
  - `handlers.rs`: サーバーからのメッセージ処理、Steam 連携、招待リンク生成。
  - `config.rs`: 実行ファイル隣接の `*.endpoint.toml` / `*.config.toml` の読み書き。
  - `models.rs`: サーバー/クライアント間メッセージ（JSON）モデル。
  - `ws_error_handler.rs`: バージョン不整合などの WS エラー処理（必要に応じてブラウザでDLページを開く）。
  - `console.rs`: 進捗表示・行上書き出力ユーティリティ。
- `steam-stuff/`
  - Rust から C++ ライブラリ（OpenSteamworks）を呼び出すブリッジ。
  - `cmake/`: OpenSteamworks を含む C++ 実装（Remote Play 招待生成、コールバック）。
- `.github/workflows/Release.yml`: 各OS向けビルド/リリース定義。
- `AppImageBuilder.yml`, `scripts/`: Linux AppImage 用スクリプトと設定。

## アーキテクチャ
- Rust (Tokio) で WebSocket に接続し、非同期でサーバーからの指示を処理
- `steam-stuff` クレート経由で C++ 実装（OpenSteamworks 利用）にブリッジ
- 招待リンク生成時に C++ 側コールバックを Rust 側が受け取り、Discord ユーザーとゲストIDの対応を管理

## セキュリティ/注意事項
- WebSocket は `ws://`/`wss://` のどちらでも利用可能です（TLS 利用時は `wss://` を推奨）。
- OpenSteamworks は非公式のインターフェースを含みます。利用は自己責任でお願いします。

## トラブルシューティング
- 「Steam クライアントに接続できません」
  - Steam が起動済みか確認
  - macOS では権限や Gatekeeper の影響を確認
- 「接続がタイムアウトする/再接続を繰り返す」
  - `ENDPOINT_URL`（もしくは `*.endpoint.toml`）が正しいか確認
  - サーバー到達性（Firewall/プロキシ）を確認
- 「ゲームが未対応と表示される」
  - Remote Play Together 対応タイトルか確認（非Steamアプリは未対応）

## 開発
- Rust: `cargo fmt`, `cargo clippy` 等で整形/静的解析（プロジェクトに設定があれば）
- C++: `steam-stuff/cmake` 以下を CMake でビルド（通常は `cargo build` が自動呼び出し）
- Windows のリソース埋め込みは `build.rs` で実行（`resources/app.ico`）

## 謝辞
- RemotePlayWhatever ( https://github.com/m4dEngi/RemotePlayWhatever )

## ライセンス
- MIT License © 2024-2025 Kamesuta
