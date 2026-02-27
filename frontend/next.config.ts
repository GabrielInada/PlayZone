import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Adicione opções de configuração aqui, se necessário */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com"}
    ]
  }
};

export default nextConfig;
