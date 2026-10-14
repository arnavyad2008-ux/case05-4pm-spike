/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Synergy-Simulation', value: 'True' },
          { key: 'X-Simulation-Watermark', value: '[SIMULATED ADVISORY - NOT DIRECT ACTUATION]' },
        ],
      },
    ];
  },
};

export default nextConfig;
