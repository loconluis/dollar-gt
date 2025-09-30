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
  title:
    "DólarGT - Guatemala - Rastreador de Precio | Tipo de Cambio USD a GTQ en Vivo",
  description:
    "Consulta el tipo de cambio del dólar a quetzal guatemalteco en tiempo real. Gráficos históricos, análisis y conversor de moneda. Tasa de cambio actualizada de bancos de Guatemala.",
  keywords: [
    "tipo de cambio",
    "dólar a quetzal",
    "USD GTQ",
    "Guatemala",
    "banco",
    "tasa de cambio",
    "conversor de moneda",
    "precio del dólar",
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
  },
  openGraph: {
    title:
      "DólarGT - Guatemala - Rastreador de Precio | Tipo de Cambio USD a GTQ en Vivo",
    description:
      "Consulta el tipo de cambio del dólar a quetzal guatemalteco en tiempo real. Gráficos históricos, análisis y conversor de moneda.",
    url: "https://dolar.luislocon.dev",
    siteName: "Dollar GT",
    locale: "es_GT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "DólarGT - Guatemala - Rastreador de Precio | Tipo de Cambio USD a GTQ en Vivo",
    description:
      "Consulta el tipo de cambio del dólar a quetzal guatemalteco en tiempo real. Gráficos históricos y análisis.",
    creator: "@dollargt",
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
