# Remote Play Inviter - Website

このリポジトリは、「[Steam Remoteplay Inviter](https://steaminviter.app)」ツールの公式紹介ウェブサイトのソースコードです。

「Steam Remoteplay Inviter」は、Steamの「Remote Play Together」機能を使ったゲームへの招待を、Discordを通じて簡単に行うための非公式ツールです。

## このサイトについて

このウェブサイトは、ツールの機能紹介、導入手順、ダウンロードリンクなどを提供することを目的としています。

### 主な使用技術

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization (i18n)**: [next-intl](https://next-intl-docs.vercel.app/)

## 開発環境のセットアップ

1. **リポジトリをクローンする**
   ```bash
   git clone https://github.com/Kamesuta/remoteplay-inviter-web.git
   cd remoteplay-inviter-web
   ```

2. **依存関係をインストールする**
   ```bash
   npm install
   ```

3. **開発サーバーを起動する**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` を開いてください。

## 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動します。
- `npm run build`: 本番用にアプリケーションをビルドします。
- `npm run start`: ビルドされたアプリケーションを本番モードで起動します。
- `npm run lint`: `ESLint` を使ってコードの静的解析を実行します。

## 関連リポジトリ

- **クライアントアプリ**: [Kamesuta/remoteplay-inviter](https://github.com/Kamesuta/remoteplay-inviter)
- **Discord BOT**: [Kamesuta/remoteplay-inviter-bot](https://github.com/Kamesuta/remoteplay-inviter-bot)