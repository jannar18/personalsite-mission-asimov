/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/images/**",
      "./public/videos/**",
      "./public/textures/**",
    ],
  },
  async redirects() {
    return [
      {
        source: "/now",
        destination: "/archive",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
