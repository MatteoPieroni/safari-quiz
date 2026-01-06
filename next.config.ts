import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // need to add this because of issue with netlify
  // https://answers.netlify.com/t/something-strange-instead-of-my-domain-in-oauth-redirect-uri/131411
  experimental: {
    serverActions: {
      allowedOrigins: [
        'safari-guide-quiz.netlify.app',
        'proxy.proxy-production.svc.cluster.local:80',
      ],
    },
  },
};

export default nextConfig;
