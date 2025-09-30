import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Tipo de Cambio Dólar a Quetzal Guatemalteco | Precios en Vivo - DólarGT",
    template: "%s | DólarGT - Tipo de Cambio Guatemala",
  },
  description:
    "Consulta el tipo de cambio dólar a quetzal guatemalteco en tiempo real. Precios actualizados de bancos, gráficos históricos, conversor de moneda y análisis de tendencias. Tasa de cambio USD a GTQ hoy.",
  keywords: [
    "tipo de cambio dólar a quetzal guatemalteco",
    "dólar a quetzal",
    "USD GTQ",
    "tipo de cambio guatemala",
    "precio del dólar en guatemala",
    "banco de guatemala",
    "tasa de cambio",
    "conversor de moneda",
    "dolar hoy",
    "quetzal a dolar",
    "cambio de moneda guatemala",
    "banguat",
    "dolar gt",
    "tasa de cambio hoy",
    "precio del dolar",
    "banco industrial",
    "banco g&t continental",
    "banco agricola",
    "banco de occidente",
  ],
  authors: [{ name: "Dollar GT" }],
  creator: "Dollar GT",
  publisher: "Dollar GT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dolar.luislocon.dev"),
  alternates: {
    canonical: "/",
    languages: {
      "es-GT": "/",
    },
  },
  openGraph: {
    title: "Tipo de Cambio Dólar a Quetzal Guatemalteco | Precios en Vivo - DólarGT",
    description:
      "Consulta el tipo de cambio dólar a quetzal guatemalteco en tiempo real. Precios actualizados de bancos, gráficos históricos y conversor de moneda.",
    url: "https://dolar.luislocon.dev",
    siteName: "DólarGT",
    locale: "es_GT",
    type: "website",
    countryName: "Guatemala",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tipo de Cambio Dólar a Quetzal Guatemalteco | Precios en Vivo",
    description:
      "Consulta el tipo de cambio dólar a quetzal guatemalteco en tiempo real. Precios actualizados de bancos y gráficos históricos.",
    creator: "@dollargt",
    site: "@dollargt",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icon.png", sizes: "100x100", type: "image/png" },
    ],
    other: [
      { url: "/icon.png", sizes: "100x100", type: "image/png" },
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icon.png",
        sizes: "100x100",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6485530247276914"
        crossOrigin="anonymous"
      ></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
