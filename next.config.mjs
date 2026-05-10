/** @type {import('next').NextConfig} */
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const proto = (`${process?.env?.DEPLOY_ENV}` === 'local') ? 'http://' : 'https://' ;
const bend_port = (`${process?.env?.DEPLOY_ENV}` === 'local') ? `:${process.env.MDX_BEND_PORT}` : '' ;
const apiNode = `${proto}${process.env.MDX_BEND_HOST}${bend_port}/:path*/` ;

const nextConfig = {
  async rewrites() {
    if (isDemoMode) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: apiNode,
      },
    ];
  },
};

export default nextConfig;
