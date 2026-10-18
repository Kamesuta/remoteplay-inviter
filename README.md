# Remote Play Inviter（クライアント）

Steam の Remote Play Together を、Discord などの外部サービス経由で友だちに招待するためのクライアントです。起動中の Steam クライアントと連携し、バックエンド（WebSocket サーバー）からの指示に応じて現在のゲームIDの取得や招待リンクの生成を行います。

- 実装言語: Rust（公式 Steamworks SDK を使用）
- 対応OS: Windows / macOS（Intel, Apple Silicon）/ Linux（AppImage 配布）
- ランタイム: Steam クライアントが動作していることが前提

## 特長
- 起動中ゲームの AppID を検出(Remote Play Together 対応可否は Bot 側で判定)
- WebSocket 経由でバックエンドと通信し、招待リンクを生成・応答
- 参加/離脱イベント（ゲストID）を受け取りログ表示
- 指示があればメッセージをクリップボードにコピー
- 各OS向けのバイナリを GitHub Actions で自動ビルド

## 動作要件
- Steam クライアントが起動済み（ログイン済み）
- Remote Play Together 対応タイトルが Steam から起動中
- バックエンドの WebSocket サーバー（`ENDPOINT_URL`）
- 実行ファイルと同じ場所に Steamworks のランタイムライブラリ（`steam_api64.dll` / `libsteam_api.dylib` / `libsteam_api.so`）。配布物には同梱されています。

## インストール / 実行
GitHub Releases から OS に合ったものをダウンロードします。

- Windows: `remoteplay-inviter-windows.zip` を展開し、`remoteplay-inviter.exe` を実行（`steam_api64.dll` は同じフォルダに置いたままにしてください）
- macOS: `remoteplay-inviter-macos.tar.gz`（Apple Silicon）または `remoteplay-inviter-macos-intel.tar.gz` を展開し、`remoteplay-inviter` を実行（`libsteam_api.dylib` は同じフォルダに置いたままにしてください）
- Linux: `remoteplay-inviter.AppImage` に実行権限を付けて実行

## ビルド
1) Rust ツールチェーン（stable、1.80 以上）をインストール
- `rust-toolchain.toml` により stable が選ばれます。C/C++ のビルドツールは不要です。

2) OS ごとの依存
- Linux: `libxcb-xfixes0-dev`（クリップボード用）

3) エンドポイント設定（ビルド時）
- 既定の接続先はビルド時に `.env` の `ENDPOINT_URL` から埋め込まれます。
  - 例: `.env` に `ENDPOINT_URL=ws://localhost:8080` を記載

4) ビルド
- リリースビルド: `cargo build --release`
- 生成物: `target/<target-triple>/release/remoteplay-inviter[.exe]`
- `build.rs` が `steamworks-sys` に同梱の Steamworks ランタイムライブラリ（環境変数 `STEAM_SDK_LOCATION` があればその SDK のもの）を生成物の隣にコピーするので、`cargo run` や `cargo test` はそのまま動きます。

GitHub Releases は `v*` タグの push でトリガーされ、以下を出力します。
- Windows: `remoteplay-inviter-windows.zip`
- macOS (Intel/Apple Silicon): `remoteplay-inviter-macos[-intel].tar.gz`
- Linux: `remoteplay-inviter.AppImage`

## 使い方
1) Steam を起動し、Remote Play Together 対応ゲームを Steam から起動
2) 本クライアントを起動
3) バックエンド（例: Discord ボットと連携するサーバー）からの指示に従い、ゲームIDの提供や招待リンクの生成を行います

コマンドラインオプション:
- `-v, --version`: バージョン表示
- `-h, --help`: ヘルプ表示
- `--steam-probe`: 検出した起動中ゲームを表示して終了（トラブルシューティング用）

起動後の主なログ例:
- `-> Create Panel : claimer=..., game_id=...`
- `-> Create Invite Link : claimer=..., guest_id=..., invite_url=...`
- `-> Player Joined/Left : claimer=..., guest_id=..., steam_id=...`

終了は `Ctrl+C`。

### 注意
- 招待リンクの生成中は、本クライアントがゲームごとの補助プロセス（`remoteplay-inviter --steam-helper <AppID>`）を起動します。Steam はこの補助プロセスもゲームの一部として扱うため、**ゲームをプレイ中に本クライアントを終了すると、Steam 上ではゲームが終了した扱いになります**（ゲーム自体は動き続けます）。クライアントはゲームを終了したあとに閉じてください。

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
  - `handlers.rs`: サーバーからのメッセージ処理、招待リンク生成、参加者の管理。
  - `config.rs`: 実行ファイル隣接の `*.endpoint.toml` / `*.config.toml` の読み書き。
  - `models.rs`: サーバー/クライアント間メッセージ（JSON）モデル。
  - `ws_error_handler.rs`: バージョン不整合などの WS エラー処理（必要に応じてブラウザでDLページを開く）。
  - `console.rs`: 進捗表示・行上書き出力ユーティリティ。
  - `steam/`: Steam 連携
    - `mod.rs`: 起動中ゲームの監視と補助プロセスの管理（`SteamManager`）
    - `detector.rs`, `library.rs`: Steam ライブラリのマニフェストとプロセス一覧から起動中ゲームを検出
    - `helper_main.rs`, `helper.rs`, `protocol.rs`: 公式 Steamworks SDK（`ISteamRemotePlay`）で招待リンクを生成する補助プロセスと、その通信
- `.github/workflows/Release.yml`: 各OS向けビルド/リリース定義。
- `AppImageBuilder.yml`, `scripts/`: Linux AppImage 用スクリプトと設定。

## アーキテクチャ
- Rust (Tokio) で WebSocket に接続し、非同期でサーバーからの指示を処理
- 起動中ゲームは、Steam ライブラリのインストール先とプロセス一覧を照合して検出
- Steamworks SDK は 1 プロセスにつき 1 つの AppID にしか結び付けられないため、ゲームごとに補助プロセスを起動し、そこで公式 `ISteamRemotePlay` API により招待リンクの生成と参加/離脱の検知を行う。補助プロセスはゲームの終了後に停止する
- Discord ユーザーとゲストIDの対応は、招待リンク生成時に記録

## セキュリティ/注意事項
- WebSocket は `ws://`/`wss://` のどちらでも利用可能です（TLS 利用時は `wss://` を推奨）。
- 配布物の Steamworks ランタイムライブラリは Steamworks SDK の再配布条件に従って同梱しています。

## トラブルシューティング
- 「Steam クライアントに接続できません」「Failed to start the Steam helper」
  - Steam が起動済みでログインしているか確認
  - Steamworks のランタイムライブラリが実行ファイルと同じ場所にあるか確認
  - macOS では権限や Gatekeeper の影響を確認
- 「ゲームが検出されない」
  - ゲームを Steam から起動しているか確認
  - `remoteplay-inviter --steam-probe` で検出結果を確認
- 「接続がタイムアウトする/再接続を繰り返す」
  - `ENDPOINT_URL`（もしくは `*.endpoint.toml`）が正しいか確認
  - サーバー到達性（Firewall/プロキシ）を確認
- 「ゲームが未対応と表示される」
  - Remote Play Together 対応タイトルか確認（非Steamアプリは未対応）

## 開発
- `cargo fmt`, `cargo clippy`, `cargo test`
- Windows のリソース埋め込みは `build.rs` で実行（`resources/app.ico`）

## 謝辞
- RemotePlayWhatever ( https://github.com/m4dEngi/RemotePlayWhatever )

## ライセンス
- MIT License © 2024-2025 Kamesuta
