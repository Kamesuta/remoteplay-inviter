# Steam Remote Play Inviter

Steam の Remote Play Together の招待を、Discord から行えるようにするツールです。

- 公式サイト: https://steaminviter.app
- ダウンロード: [Releases](https://github.com/Kamesuta/remoteplay-inviter/releases/latest)

## 構成

| フォルダ | 内容 |
|---|---|
| [`client/`](client/) | ホストの PC で動かすクライアント(Rust)。Steam と連携し、招待リンクを作ります。 |
| [`bot/`](bot/) | Discord Bot。`/steam` コマンドと招待ボタンを受け付け、WebSocket でクライアントに指示を送ります。 |
| [`web/`](web/) | 公式サイト(Next.js、Cloudflare Workers)。 |

使い方とビルド方法は、各フォルダの README を見てください。

## CI

GitHub Actions は手動で起動します。

- `Check.yml`: クライアントの fmt / clippy / test(Windows・macOS・Linux)
- `Release.yml`: クライアントのビルドと配布物の作成。`v*` のタグを push するとリリースを作ります。

## ライセンス

[MIT](LICENSE)
