# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Steam Remote Play Together に Discord から招待できる BOT「Remote Play Inviter」の Web サイト(https://steaminviter.app)。Next.js 15(App Router)+ next-intl で日本語・英語に対応し、OpenNext で Cloudflare Workers に置いている。

## 開発コマンド

```bash
npm run dev       # 開発サーバー(Turbopack)
npm run build     # 本番ビルド
npm run lint      # ESLint
npm run preview   # OpenNext でビルドし、Workers と同じ環境で確かめる
npm run deploy    # 本番に出す(CLOUDFLARE_ACCOUNT_ID が要る)
npm run record    # Discord 用の GIF と OG 画像を撮り直す(下記)
```

## ページ

| URL | 中身 |
|---|---|
| `/en` `/ja` | LP(`src/app/[locale]/(site)/page.tsx`) |
| `/en/guide/x360ce` `/ja/guide/x360ce` | キーボードをコントローラーにする手順 |
| `/[locale]/embed/<name>` | アニメ 1 本だけを舞台の大きさで出す録画用のページ。noindex、sitemap に載せない、GA なし |

- `/` は middleware が Accept-Language などで `/en` か `/ja` に振り分ける。
- `(site)` グループのページだけが Google Analytics を読む。
- ページはすべて `generateStaticParams` + `setRequestLocale` で静的に作る。新しいページにも `setRequestLocale(locale)` を入れる。

## 作り

```
src/
├── app/
│   ├── fonts.ts                 # next/font(Dela Gothic One・DotGothic16・Zen Kaku Gothic New・VT323・Roboto)
│   ├── globals.css              # ナイト配色の CSS 変数(--t-*)、ページ共通の動き、スマホで縮める zoom の段階
│   └── [locale]/...
├── components/
│   ├── home/                    # LP の各節(サーバー部品)
│   ├── guide/                   # 説明ページの各節、CopyButton、presets.ts
│   ├── anim/                    # アニメ(クライアント部品 + 同じ名前の CSS)
│   │   ├── useLoopAnimation.ts  # アニメの再生の仕組み
│   │   └── X360Window.tsx       # 説明ページの手順 2〜5 で使う x360ce の画面部品
│   ├── PageShell.tsx            # 背景と基本の文字
│   ├── LanguageLink.tsx         # 同じページの別の言語へ
│   └── OgCard.tsx               # OG 画像のカード
└── utils/metadata.ts            # メタデータ(canonical・hreflang・OGP)
```

### スタイル
- 見た目はデザインのマークアップをそのまま写しているので、ほとんどがインラインの `style`。色は `var(--t-…)`、字体は `var(--font-…)` を使う。
- Tailwind はテーマとユーティリティだけを読み込む(preflight は読まない)。デザインがブラウザ標準の見た目(見出しの太さ、`ol` の番号など)を前提にしているため。

### アニメ
- 各アニメは外枠 `.rpa.<接頭辞>`(例 `.rpa.ifl`)の `className` に付け外しするクラスで場面を進め、動きはすべて CSS の transition。接頭辞でほかの CSS とぶつからないようにする。
- 進め方は `LOOP = { beats: [[ms, 付けるクラス, 外すクラス], …], period }` で書き、`useLoopAnimation(ref, LOOP)` に渡す。React は再描画しない。画面外では止まる。
- OS の「アニメーション効果」がオフ(`prefers-reduced-motion: reduce`)でも止めない。使い方の説明そのものなので、止めると何も伝わらない。速さのためにオフにしている PC もある。
- 動かすのは transform と opacity だけ。スマホ幅では `globals.css` の `.zf-*` で縮める。
- アニメの中の文字は `messages/*.json` の `anim.<接頭辞>`。ブラウザに送るメッセージは `anim` だけ(`[locale]/layout.tsx`)。

### 国際化
- `messages/ja.json` と `messages/en.json` は同じキーにそろえる。名前空間は `home.*`(LP)、`guide.*`(説明ページ)、`anim.*`(アニメ)、`title`/`description`(LP のメタデータ)。
- 太字やリンクを含む文は `t.rich("key", { b0: (c) => <b>{c}</b> })` のようにタグで書く。キー名(`t1`、`h21` など)はデザインから移したときの通し番号。
- 内部リンクは `@/i18n/routing` の `Link` を使う(言語が付く)。

## Discord 用の GIF と OG 画像
- Bot の招待リンクの返信は `public/assets/discord/{en,ja}/join-{phone,pc}-v<N>.gif` を表示する。
- 作り直すとき:`npm run build && npm start` のあと、別のターミナルで `npm run record -- http://localhost:3000`。Google Chrome と ffmpeg が要る。
- GIF を変えたら、`scripts/record-gif.mjs` の版を上げて新しい名前にし、Bot の参照先も直す(Discord は URL ごとに画像をキャッシュする)。

## 外部の URL
- BOT の追加:`https://discord.com/oauth2/authorize?client_id=1252429340780527714`
- ダウンロード:`https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-windows.zip`(ほかの OS は releases/latest)
