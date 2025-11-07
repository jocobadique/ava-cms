/** @type {import('next').NextConfig} */
const proto = (`${process?.env?.DEPLOY_ENV}` === 'local') ? 'http://' : 'https://' ;
const bend_port = (`${process?.env?.DEPLOY_ENV}` === 'local') ? `:${process.env.MDX_BEND_PORT}` : '' ;
const apiNode = `${proto}${process.env.MDX_BEND_HOST}${bend_port}/:path*/` ;

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: apiNode,
      },
    ];
  },
};

export default nextConfig;
