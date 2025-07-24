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
