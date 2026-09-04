/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined 
  ? process.env.NEXT_PUBLIC_BASE_PATH 
  : (isProd ? '/sampath' : '');

const nextConfig = {
  distDir: isProd ? '.next_prod' : '.next',
  ...(isProd ? { output: 'export', trailingSlash: true } : {}),
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
