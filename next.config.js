/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '*.ytimg.com',
            },
        ],
    },
};

module.exports = withAxiom(nextConfig);
