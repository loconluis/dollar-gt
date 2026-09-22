import { Building2, TrendingDown, TrendingUp } from "lucide-react";
import { LastUpdated } from "@/components/LastUpdated";
import { FormattedHistoricObject } from "@/interfaces";

interface SiteHeroProps {
  data: FormattedHistoricObject[];
}

/**
 * Server-rendered hero. H1, H2, intro paragraph and every anchor ID/label
 * are preserved verbatim from the previous design for SEO.
 */
export function SiteHero({ data }: SiteHeroProps) {
  const prices = data
    .map((d) => parseFloat(d.precio ?? "0"))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const hasData = prices.length > 0;
  const currentPrice = hasData ? prices[prices.length - 1] : 0;
  const currentPriceDate = hasData ? data[data.length - 1]?.fecha : "";
  const startPrice = hasData ? prices[0] : 0;
  const priceChange = currentPrice - startPrice;
  const percentageChange = hasData ? (priceChange / startPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-10 sm:pb-14">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:items-center">
        {/* Left: message */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Tipo de Cambio Dólar a Quetzal Guatemalteco
          </h1>
          <h2 className="mt-3 text-lg sm:text-xl font-medium text-muted-foreground">
            Seguimiento en tiempo real - Guatemala
          </h2>
          <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Consulta las tasas de cambio de bancos con gráficos históricos.
            Encuentra las mejores tasas para{" "}
            <a
              href="#conversor-moneda-heading"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              convertir dólares a quetzales
            </a>{" "}
            y visualiza el{" "}
            <a
              href="#graficos-analisis-heading"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              historial de precios
            </a>
            .
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 tnum">
              <span
                className="relative flex h-2 w-2"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40 motion-reduce:hidden"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Última actualización: <LastUpdated />
            </span>
            <span aria-hidden="true">•</span>
            <nav aria-label="Secciones" className="flex items-center gap-3">
              <a
                href="#tasas-bancos-heading"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Ver tasas por banco
              </a>
              <span aria-hidden="true">•</span>
              <a
                href="#mejores-tasas-heading"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Mejores tasas
              </a>
              <span aria-hidden="true">•</span>
              <a
                href="#conversor-moneda-heading"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Conversor
              </a>
            </nav>
          </div>
        </div>

        {/* Right: live Banguat price instrument */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 px-5 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Banco de Guatemala
            </span>
            <span className="text-xs text-muted-foreground tnum">
              {hasData ? `Al ${currentPriceDate}` : ""}
            </span>
          </div>
          <div className="px-5 py-6 sm:py-8">
            {hasData ? (
              <>
                <p className="text-xs font-medium text-muted-foreground">
                  Tipo de cambio oficial (compra)
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-5xl sm:text-6xl font-semibold tracking-tight text-foreground tnum">
                    {currentPrice.toFixed(5)}
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    GTQ
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tnum ${
                      isPriceUp
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {isPriceUp ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {isPriceUp ? "+" : ""}
                    {priceChange.toFixed(5)} ({isPriceUp ? "+" : ""}
                    {percentageChange.toFixed(2)}%) 30 días
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Fuente: Banco de Guatemala
                  </span>
                </div>
              </>
            ) : (
              <div className="py-6 text-sm text-muted-foreground">
                Precio no disponible en este momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
