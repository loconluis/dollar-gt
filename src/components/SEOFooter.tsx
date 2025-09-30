"use client";

import Link from "next/link";
import { Building2, TrendingUp, Globe, Calculator, Clock } from "lucide-react";

export function SEOFooter() {
  const currentYear = new Date().getFullYear();

  const mainServices = [
    {
      href: "#tasas-bancos-heading",
      label: "Tasas de Cambio",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      href: "#conversor-moneda-heading",
      label: "Conversor USD/GTQ",
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      href: "#graficos-analisis-heading",
      label: "Gráficos Históricos",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      href: "#mejores-tasas-heading",
      label: "Mejores Tasas",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const relatedPages = [
    {
      href: "/tipo-de-cambio-dolar-quetzal",
      label: "Tipo de Cambio Dólar Quetzal",
    },
    { href: "/dolar-hoy-guatemala", label: "Dólar Hoy Guatemala" },
    { href: "/precio-dolar-gtq", label: "Precio Dólar GTQ" },
    { href: "/banco-guatemala-tipo-cambio", label: "Banco de Guatemala" },
    { href: "/banguat-dolar-hoy", label: "Banguat Dolar Hoy" },
    { href: "/mejor-tasa-dolar-guatemala", label: "Mejor Tasa Dólar" },
  ];

  return (
    <footer className="bg-muted/30 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Additional SEO Content */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="text-center space-y-4">
            <div className="max-w-3xl mx-auto">
              <h4 className="font-semibold text-foreground mb-2">
                Sobre el Tipo de Cambio en Guatemala
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DólarGT es la plataforma líder para consultar el{" "}
                <strong>tipo de cambio dólar a quetzal guatemalteco</strong> en
                tiempo real. Ofrecemos información actualizada de los
                principales bancos de Guatemala, incluyendo{" "}
                <strong>Banco de Guatemala (Banguat)</strong>,
                <strong>Banco Industrial</strong>,{" "}
                <strong>Banco G&T Continental</strong>,{" "}
                <strong>Banco Agrícola</strong> y más. Nuestro servicio incluye{" "}
                <strong>gráficos históricos</strong>,{" "}
                <strong>conversor de moneda</strong> y análisis de tendencias
                para ayudarte a tomar las mejores decisiones de cambio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left max-w-4xl mx-auto">
              <div className="space-y-2">
                <h5 className="font-medium text-foreground">
                  ¿Por qué usar DólarGT?
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Datos en tiempo real</li>
                  <li>• Comparación de tasas</li>
                  <li>• Gráficos históricos</li>
                  <li>• Conversor integrado</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-foreground">
                  Información Actualizada
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Actualización periódica</li>
                  <li>• Datos de fuentes confiables</li>
                  <li>• Histórico de 30 días Banco de Guatemala</li>
                  <li>• Análisis de tendencias</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-foreground">
                  Cobertura Nacional
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ciudad de Guatemala</li>
                  <li>• Quetzaltenango</li>
                  <li>• Mixco</li>
                  <li>• Villa Nueva</li>
                  <li>• Todo Guatemala</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>© {currentYear} DólarGT. Hecho con ❤️ en Guatemala.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Servicio de información de tipo de cambio USD/GTQ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
