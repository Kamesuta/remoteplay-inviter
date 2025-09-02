import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();

// i18n対応のためのプラグイン
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // trailingSlash: Next.jsデフォルトはfalseなので削除
  // images: Next.jsデフォルト画像最適化を使用（unoptimized削除）
  // distDir: 'out' は削除（OpenNext.jsが管理）
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
