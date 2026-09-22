/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion', 'lucide-react']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // SEO landing paths listed in sitemap.ts and SEOFooter — serve the main
  // tracker page until dedicated pages exist (avoids 404s on indexed URLs).
  rewrites: async () => [
    {
      source: '/tipo-de-cambio-dolar-quetzal',
      destination: '/',
    },
    {
      source: '/dolar-hoy-guatemala',
      destination: '/',
    },
    {
      source: '/precio-dolar-gtq',
      destination: '/',
    },
    {
      source: '/banco-guatemala-tipo-cambio',
      destination: '/',
    },
    {
      source: '/conversor-dolar-quetzal',
      destination: '/',
    },
    {
      source: '/tasas-cambio-bancos-guatemala',
      destination: '/',
    },
    {
      source: '/historial-dolar-quetzal',
      destination: '/',
    },
    {
      source: '/mejor-tasa-dolar-guatemala',
      destination: '/',
    },
    {
      source: '/banguat-dolar-hoy',
      destination: '/',
    },
    {
      source: '/cambio-moneda-guatemala',
      destination: '/',
    },
    {
      source: '/tasa-cambio/:bank',
      destination: '/',
    },
    {
      source: '/tipo-cambio/:location',
      destination: '/',
    },
  ],
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=30' }
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
      ],
    },
  ],
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

export default nextConfig;
