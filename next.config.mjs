/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ページ拡張子の優先順位を明示（TSX/TS を優先）
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // ビルド時のルートを制御（lockfile 警告対策）
  outputFileTracingRoot: process.cwd(),

  // 必要なら画像最適化のドメイン追加（S3, Firebase, Vercelなど使う場合）
  images: {
    domains: ['localhost'], // ここに外部画像ドメインを追加
  },
};

export default nextConfig;


