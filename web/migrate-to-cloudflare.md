# Cloudflare Next.js Migration Plan

## 概要

現在の静的エクスポート方式からCloudflare公式のOpenNext.jsテンプレートベースの構成に移行する計画。これにより、より豊富なNext.js機能とCloudflare Workersの性能を最大限活用可能。

## 現在の構成 vs テンプレート構成

### 現在の構成（静的エクスポート）
- `wrangler.toml` + 静的ファイル配信
- `output: 'export'` なし（Bundle Analyzer分析後に削除）
- 基本的なアセット配信のみ
- middleware.ts使用（next-intl用）

### テンプレート構成（OpenNext.js）
- `wrangler.jsonc` + OpenNext.js
- SSR/API Routes対応
- Cloudflare Workers最適化
- より高度なキャッシュ戦略

## 移行のメリット

### 1. 機能拡張
- **SSR対応**: サーバーサイドレンダリング有効化
- **API Routes**: バックエンド機能追加可能
- **動的ルーティング**: より柔軟なURL構造
- **Middleware完全対応**: next-intlとの互換性向上

### 2. パフォーマンス向上
- **Edge Computing**: Cloudflare Workers最適化
- **インクリメンタルキャッシュ**: R2ストレージ活用可能
- **より効率的な配信**: OpenNext.js最適化

### 3. 開発体験向上
- **型安全性**: Cloudflare環境型定義
- **ローカル開発**: Cloudflareコンテキスト対応
- **モダンツールチェーン**: 最新OpenNext.js

## 移行計画

### Phase 1: 依存関係とツール設定

#### 1.1 新規依存関係追加
```bash
npm install @opennextjs/cloudflare@^1.6.1
```

#### 1.2 package.json スクリプト更新
```json
{
  "scripts": {
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts"
  }
}
```

### Phase 2: 設定ファイル作成・更新

#### 2.1 新規ファイル作成

##### `cloudflare-env.d.ts`
```typescript
interface CloudflareEnv {
  // Cloudflare Workers環境変数の型定義
}
```

##### `open-next.config.ts`
```typescript
import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  // 基本設定（必要に応じてカスタマイズ）
};

export default config;
```


#### 2.2 既存ファイル更新

##### `next.config.ts`
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// 開発環境でOpenNext.js初期化
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // trailingSlash: Next.jsデフォルトはfalseなので削除
  // images: Next.jsデフォルト画像最適化を使用（unoptimized削除）
  // distDir: 'out' は削除（OpenNext.jsが管理）
};

export default withNextIntl(nextConfig);
```

##### `wrangler.toml`（形式維持）
```toml
name = "steaminviter"
main = ".open-next/worker.js"
compatibility_date = "2025-03-01"
compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]

[assets]
binding = "ASSETS"
directory = ".open-next/assets"

[observability.logs]
enabled = true
```

> **注記**: OpenNext.jsでは `wrangler.jsonc` が推奨されているが、TOMLも完全サポート。既存プロジェクトでは形式維持を優先。

### Phase 3: 国際化（next-intl）互換性確保

#### 3.1 現在の実装確認項目
- ✅ `src/middleware.ts` - OpenNext.jsとの互換性
- ✅ `src/i18n/routing.ts` - ルーティング設定
- ✅ `messages/*.json` - メッセージファイル
- ✅ `LocalizedSvg` - SVG国際化コンポーネント

#### 3.2 OpenNext.js環境での動作確認
- SSR環境でのロケール検出
- Cookieベースの言語切り替え
- 静的メッセージファイルの読み込み

### Phase 4: テスト・検証

#### 4.1 ローカル開発環境
```bash
npm run dev  # 開発サーバー起動
npm run preview  # プレビュー環境でテスト
```

#### 4.2 機能テスト項目
- [ ] 言語切り替え機能
- [ ] SVG国際化表示
- [ ] レスポンシブデザイン
- [ ] メタデータ（OGP）表示
- [ ] パフォーマンス測定

#### 4.3 プレビューテスト
```bash
npm run preview  # プレビュー環境でテスト（本番デプロイは禁止）
```
