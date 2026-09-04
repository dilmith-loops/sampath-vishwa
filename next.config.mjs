/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined 
  ? process.env.NEXT_PUBLIC_BASE_PATH 
  : '/SampathVishwa';

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
