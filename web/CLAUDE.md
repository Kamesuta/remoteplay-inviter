# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Steam Remote Play TogetherをDiscordで簡単に招待できるBOTツールのランディングページ。Next.js App Routerで構築された静的サイトで、日本語・英語の多言語対応を実装している。

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド（静的エクスポート）
npm run build

# リント実行
npm run lint

# Cloudflareにデプロイ
npm run deploy
```

## アーキテクチャ

### 静的サイト生成設定
- `next.config.ts`で`output: 'export'`を設定
- 画像最適化無効（`images.unoptimized: true`）
- ビルド出力: `out/`ディレクトリ
- Cloudflare Workers/Pagesでホスティング

### 国際化（i18n）実装
next-intlを使用した国際化システムを採用：

- **next-intl**: 公式のNext.js国際化ライブラリ
- **メッセージファイル**: `messages/ja.json`, `messages/en.json`
- **翻訳関数**: 
  - `useTranslations(namespace)`: 文字列翻訳
  - `useLocale()`: 現在のロケール取得
- **ルーティング**: `src/i18n/routing.ts`でロケール設定

### ルーティング戦略
- `/`: デフォルトページ（英語コンテンツ）
- `/ja`, `/en`: 言語別アクセス時に`/`にリダイレクト
- `middleware.ts`でリダイレクト処理とCookie設定

### コンポーネント構造
```
src/components/
├── HomePageContent.tsx      # メインコンテンツコンテナ
├── LanguageSwitcher.tsx     # 言語切り替えUI
├── LocalizedSvg.tsx         # SVGのi18n対応コンポーネント
└── sections/                # セクション別コンポーネント
    ├── Navigation.tsx       # ナビゲーション
    ├── HeroSection.tsx      # ヒーローセクション
    ├── FeaturesSection.tsx  # 機能紹介
    └── ... (8個の他セクション)
```

## 重要な技術選択

### 静的エクスポート + next-intl
next-intlを使用した国際化システム：
- 静的エクスポートとの互換性
- 型安全な翻訳機能
- App Routerとの統合

### メタデータ管理
- `src/utils/metadata.ts`: 共通メタデータ生成関数
- 言語別OGP対応
- Twitter Card設定済み

### スタイリング
- Tailwind CSS 4使用
- Steamブランドカラー（`#1B2838`, `#66C0F4`等）
- Discordテーマカラー（`#5865F2`）
- Font Awesome（CDN経由）

### SVGのi18n対応
`LocalizedSvg`コンポーネントでSVG内テキストの翻訳を実現：
- SVGファイルを動的に読み込み、テキスト要素を置換
- `textTranslations`プロパティで翻訳マッピングを定義
- `useLocale()`で現在のロケールを取得し、適切な翻訳を適用
- SVG内の相対パス（`xlink:href`、`href`）を絶対パスに自動変換
- `concept-diagram.svg`でDiscordとSteamの使用フローを多言語化

## 開発時の注意点

### メッセージファイル編集
`messages/*.json`でコンテンツを編集する際：
- `useTranslations(namespace)`で名前空間を指定
- 文字列メッセージは`t(key)`で取得
- 両言語ファイルの構造を同期保持
- SVGのi18n対応では`diagram`セクションで画像内テキストを管理

### 静的エクスポート制約
- Dynamic Routes は事前定義必要
- Server-side機能（API Routes等）使用不可
- 画像最適化は無効化済み

### デプロイフロー
1. `npm run build`で静的ファイル生成
2. `out/`ディレクトリがCloudflare Workersにアップロード
3. `wrangler.toml`設定でアセット配信

## ファイル構造の特徴

### App Router構造
```
src/app/
├── layout.tsx           # ルートレイアウト（デフォルト言語）
├── page.tsx            # ホームページ
└── globals.css         # Tailwind CSSインポート
```

### 国際化メッセージ構造
各言語ファイルに以下のセクションが含まれる：
- `hero`: ヒーローセクション（タイトル配列、スライド配列）
- `nav`: ナビゲーション
- `features`: 機能紹介
- `setup`: セットアップ手順
- `faq`: よくある質問
- `footer`: フッター情報
- `diagram`: SVG内テキストの翻訳（LocalizedSvgコンポーネント用）

## デバッグとトラブルシューティング

### よくある問題
1. **翻訳キーエラー**: `useTranslations(namespace)`の名前空間確認
2. **言語切り替え反映されない**: `useLocale()`の実装確認
3. **静的エクスポートエラー**: Dynamic機能の使用有無確認
4. **メタデータ未反映**: `metadata.ts`の引数確認
5. **SVGのi18n未動作**: `LocalizedSvg`コンポーネントの`textTranslations`プロパティ確認
6. **SVG内画像が表示されない**: `LocalizedSvg`コンポーネントが相対パスを絶対パスに自動変換するため、SVG内の相対パスが原因の可能性を確認

### TypeScript設定
- Strict mode有効
- パスエイリアス: `@/*` → `./src/*`
- ES2017ターゲット