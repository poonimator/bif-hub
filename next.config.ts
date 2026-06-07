import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile elsewhere on the
  // machine otherwise makes Next infer the wrong root).
  turbopack: { root: path.resolve('.') },
  devIndicators: false,
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
};

export default nextConfig;
