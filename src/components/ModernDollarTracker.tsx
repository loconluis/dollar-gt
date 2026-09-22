"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  AlertCircle,
  Globe,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Surface,
  SurfaceHeader,
  SurfaceContent,
  MetricCard,
  Reveal,
} from "@/components/ui/surface";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { TrendChart } from "@/components/ui/chart";
import CurrencyConverter from "@/components/ui/currency-converter";
import { StructuredData } from "@/components/StructuredData";
import { useFetchExchange } from "@/hooks/useFetch";
import { FormattedHistoricObject, IExchange } from "@/interfaces";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-border/60 py-3 first:pt-0 last:border-0 last:pb-0">
    <div className="min-w-0 space-y-0.5">
      <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="flex items-center gap-2">
      {change && (
        <span
          className={cn(
            "whitespace-nowrap text-xs font-medium tnum",
            changeType === "positive" &&
              "text-emerald-600 dark:text-emerald-400",
            changeType === "negative" && "text-red-600 dark:text-red-400",
            changeType === "neutral" && "text-muted-foreground",
          )}
        >
          {change}
        </span>
      )}
      <span className="font-mono text-base sm:text-lg font-semibold text-foreground tnum">
        {value}
      </span>
      {icon}
    </div>
  </div>
);

type SortField = "name" | "buy" | "sell";
type SortDirection = "asc" | "desc" | null;

interface ModernDollarTrackerProps {
  initialData: FormattedHistoricObject[];
  initialExchangeData: IExchange[];
}

export function ModernDollarTracker({
  initialData,
  initialExchangeData,
}: ModernDollarTrackerProps) {
  const { exchangeData, loadingExchange } = useFetchExchange(initialExchangeData);
  const [selectedExchangeRate, setSelectedExchangeRate] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [filterType, setFilterType] = React.useState<
    "all" | "online" | "agencies"
  >("all");

  const data = initialData;

  // Calculate best BUY (highest) and SELL (lowest) values
  const bestBuyValue =
    exchangeData.length > 0
      ? Math.max(
          ...exchangeData.map((item) =>
            typeof item.buy === "string" ? parseFloat(item.buy) : item.buy || 0,
          ),
        )
      : 0;
  const bestSellValue =
    exchangeData.length > 0
      ? Math.min(
          ...exchangeData.map((item) =>
            typeof item.sell === "string"
              ? parseFloat(item.sell)
              : item.sell || 0,
          ),
        )
      : 0;

  // Format exchangeData for CurrencyConverter with unique IDs
  const formattedExchangeRates = exchangeData.map((item, index) => ({
    id: `${item.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    name: item.name,
    rate: typeof item.buy === "string" ? parseFloat(item.buy) : item.buy || 0,
    description: item.is_online ? "Ventanilla Virtual" : "Banco tradicional",
    is_online: item.is_online,
  }));

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField("name");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sorted exchange data
  const getSortedExchangeData = () => {
    let filteredData = [...exchangeData];
    if (filterType === "online") {
      filteredData = filteredData.filter((item) => item.is_online);
    } else if (filterType === "agencies") {
      filteredData = filteredData.filter((item) => !item.is_online);
    }

    if (!sortDirection || sortField === "name") {
      return filteredData.sort((a, b) =>
        cleanBankName(a.name).localeCompare(cleanBankName(b.name)),
      );
    }

    return filteredData.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortField === "buy") {
        aValue = typeof a.buy === "string" ? parseFloat(a.buy) : a.buy || 0;
        bValue = typeof b.buy === "string" ? parseFloat(b.buy) : b.buy || 0;
      } else if (sortField === "sell") {
        aValue = typeof a.sell === "string" ? parseFloat(a.sell) : a.sell || 0;
        bValue = typeof b.sell === "string" ? parseFloat(b.sell) : b.sell || 0;
      } else {
        aValue = 0;
        bValue = 0;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  // Clean bank name by removing 'Banco' word
  const cleanBankName = (name: string) => {
    return name.replace(/Banco\s+/i, "").trim();
  };

  // Get exchange name with best buy rate
  const getBestBuyExchange = () => {
    if (exchangeData.length === 0) return "No disponible";
    const bestExchange = exchangeData.find(
      (item) =>
        (typeof item.buy === "string"
          ? parseFloat(item.buy)
          : item.buy || 0) === bestBuyValue,
    );
    return bestExchange ? cleanBankName(bestExchange.name) : "No disponible";
  };

  // Get exchange name with best sell rate
  const getBestSellExchange = () => {
    if (exchangeData.length === 0) return "No disponible";
    const bestExchange = exchangeData.find(
      (item) =>
        (typeof item.sell === "string"
          ? parseFloat(item.sell)
          : item.sell || 0) === bestSellValue,
    );
    return bestExchange ? cleanBankName(bestExchange.name) : "No disponible";
  };

  // Set default exchange rate when data loads (prioritize Banco de Guatemala)
  React.useEffect(() => {
    if (formattedExchangeRates.length > 0 && !selectedExchangeRate) {
      const bancoGuatemala = formattedExchangeRates.find(
        (rate) =>
          rate.name.toLowerCase().includes("banco de guatemala") ||
          rate.name.toLowerCase().includes("banguat"),
      );
      if (bancoGuatemala) {
        setSelectedExchangeRate(bancoGuatemala.id);
      } else {
        setSelectedExchangeRate(formattedExchangeRates[0].id);
      }
    }
  }, [formattedExchangeRates, selectedExchangeRate]);

  if (!data.length || (data.length === 1 && !data[0].precio)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>No hay datos disponibles. Por favor intente más tarde.</span>
          </div>
        </div>
      </div>
    );
  }

  const calculateStats = (rows: FormattedHistoricObject[]) => {
    const prices = rows.map((d) => parseFloat(d.precio ?? "0"));
    return {
      max: Math.max(...prices).toFixed(5),
      min: Math.min(...prices).toFixed(5),
      avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(5),
      volatility: (
        ((Math.max(...prices) - Math.min(...prices)) / prices[0]) *
        100
      ).toFixed(2),
    };
  };
  const thirtyDayStats = calculateStats(data);
  const currentPrice = parseFloat(data[data.length - 1]?.precio ?? "0");
  const currentPriceDate = data[data.length - 1]?.fecha;
  const startPrice = parseFloat(data[0]?.precio ?? "0");
  const priceChange = (currentPrice - startPrice).toFixed(5);
  const percentageChange = (
    ((currentPrice - startPrice) / startPrice) *
    100
  ).toFixed(2);

  const isPriceUp = parseFloat(priceChange) >= 0;

  const filterButtonBase =
    "px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <TooltipProvider>
      <StructuredData exchangeData={exchangeData} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-12 sm:pb-16">
        {/* Mejores Tasas Section */}
        <section aria-labelledby="mejores-tasas-heading" className="mb-12 sm:mb-16">
          <Reveal>
            <SectionHeading id="mejores-tasas-heading">
              Las Mejores Tasas
            </SectionHeading>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <MetricCard
                title="Mejor Compra"
                value={
                  bestBuyValue > 0 ? (
                    <>
                      <AnimatedNumber value={bestBuyValue} decimals={2} /> GTQ
                    </>
                  ) : (
                    "N/A"
                  )
                }
                subtitle={
                  bestBuyValue > 0 ? getBestBuyExchange() : "No disponible"
                }
                icon={
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10"
                    aria-hidden="true"
                  >
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </span>
                }
              />

              <MetricCard
                title="Mejor Venta"
                value={
                  bestSellValue > 0 ? (
                    <>
                      <AnimatedNumber value={bestSellValue} decimals={2} /> GTQ
                    </>
                  ) : (
                    "N/A"
                  )
                }
                subtitle={
                  bestSellValue > 0 ? getBestSellExchange() : "No disponible"
                }
                icon={
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10"
                    aria-hidden="true"
                  >
                    <TrendingDown className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </span>
                }
              />

              <a
                href="#exchange-rates-table"
                className="group rounded-xl border border-dashed border-border bg-transparent p-4 sm:p-5 transition-colors hover:border-primary/50 hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-full flex-col items-center justify-center gap-2 py-4 text-center">
                  <ArrowDownToLine
                    className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-foreground">
                    Ver Todas las Tasas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Para ver más datos, ve la tabla comparativa
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Ver tabla completa
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </div>
          </Reveal>
        </section>

        {/* Banco de Guatemala Section */}
        <section aria-labelledby="banguat-heading" className="mb-12 sm:mb-16">
          <Reveal>
            <SectionHeading id="banguat-heading">
              Banco de Guatemala
            </SectionHeading>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <MetricCard
                title="Precio Actual"
                value={
                  <>
                    <AnimatedNumber value={currentPrice} decimals={5} /> GTQ
                  </>
                }
                subtitle={`Al ${currentPriceDate} - Fuente: Banco de Guatemala`}
                trend={{
                  value: Math.abs(parseFloat(percentageChange)),
                  label: "30 días",
                  isPositive: isPriceUp,
                }}
                icon={
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent"
                    aria-hidden="true"
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                  </span>
                }
              />

              <MetricCard
                title="Cambio 30 Días"
                value={`${isPriceUp ? "+" : ""}${priceChange} GTQ`}
                subtitle={`${isPriceUp ? "+" : ""}${percentageChange}%`}
                icon={
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent"
                    aria-hidden="true"
                  >
                    {isPriceUp ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </span>
                }
              />

              <MetricCard
                title="Volatilidad"
                value={`${thirtyDayStats.volatility}%`}
                subtitle="Rango de 30 días"
                icon={
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent"
                    aria-hidden="true"
                  >
                    <RefreshCw className="h-4 w-4 text-primary" />
                  </span>
                }
              />
            </div>
          </Reveal>
        </section>

        {/* Chart and Stats */}
        <section aria-labelledby="graficos-analisis-heading" className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <Reveal>
              <Surface variant="elevated" className="h-full">
                <SurfaceHeader>
                  <h3
                    id="graficos-analisis-heading"
                    className="text-lg font-semibold tracking-tight"
                  >
                    Gráficos y Análisis de Precios
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tendencia del tipo de cambio USD a GTQ últimos 30 días
                  </p>
                </SurfaceHeader>
                <SurfaceContent className="h-[380px] sm:h-[440px]">
                  <TrendChart
                    data={data.map((item) => ({
                      ...item,
                      precio: parseFloat(item.precio ?? "0"),
                    }))}
                    dataKey="precio"
                    xAxisKey="fecha"
                    height="100%"
                    showArea={true}
                  />
                </SurfaceContent>
              </Surface>
            </Reveal>

            <Reveal delay={0.1}>
              <Surface variant="elevated" className="h-full">
                <SurfaceHeader>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Estadísticas 30 Días
                  </h3>
                </SurfaceHeader>
                <SurfaceContent className="flex h-[calc(100%-4.5rem)] flex-col justify-center">
                  <StatCard
                    title="Precio Más Alto"
                    value={`${thirtyDayStats.max} GTQ`}
                    changeType="positive"
                    icon={
                      <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    }
                  />
                  <StatCard
                    title="Precio Promedio"
                    value={`${thirtyDayStats.avg} GTQ`}
                    changeType="neutral"
                    icon={
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    }
                  />
                  <StatCard
                    title="Precio Más Bajo"
                    value={`${thirtyDayStats.min} GTQ`}
                    changeType="negative"
                    icon={
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    }
                  />
                </SurfaceContent>
              </Surface>
            </Reveal>
          </div>
        </section>

        {/* Exchange Rates Table */}
        <section aria-labelledby="tasas-bancos-heading" className="mb-12 sm:mb-16">
          <Reveal id="exchange-rates-table">
            <Surface variant="elevated">
              <SurfaceHeader className="gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <h3
                    id="tasas-bancos-heading"
                    className="text-lg font-semibold tracking-tight"
                  >
                    Tasas de Cambio por Banco
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    Datos de{" "}
                    <a
                      href="https://www.infodolar.com.gt/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline underline-offset-2 transition-colors"
                    >
                      infodolar.com.gt
                    </a>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterType("all")}
                      aria-pressed={filterType === "all"}
                      className={cn(
                        filterButtonBase,
                        filterType === "all"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      Todos ({exchangeData.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("online")}
                      aria-pressed={filterType === "online"}
                      className={cn(
                        filterButtonBase,
                        filterType === "online"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="hidden sm:inline">
                        Servicios en línea
                      </span>
                      <span className="sm:hidden">En línea</span> (
                      {exchangeData.filter((item) => item.is_online).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("agencies")}
                      aria-pressed={filterType === "agencies"}
                      className={cn(
                        filterButtonBase,
                        filterType === "agencies"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      Agencias (
                      {exchangeData.filter((item) => !item.is_online).length})
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Banca en línea</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 border-l-2 border-l-emerald-500"
                        aria-hidden="true"
                      ></div>
                      <span>Mejor compra</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 border-r-2 border-r-sky-500"
                        aria-hidden="true"
                      ></div>
                      <span>Mejor venta</span>
                    </div>
                  </div>
                </div>
              </SurfaceHeader>
              <SurfaceContent>
                {loadingExchange ? (
                  <div className="space-y-3" role="status" aria-label="Cargando tasas">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border/60 p-4"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                        </div>
                        <div className="flex gap-8">
                          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead
                            className="w-[100px] cursor-pointer select-none sm:w-auto"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center gap-2">Banco</div>
                          </TableHead>
                          <TableHead
                            className="w-[60px] cursor-pointer select-none text-right"
                            onClick={() => handleSort("buy")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Compra
                              {getSortIcon("buy")}
                            </div>
                          </TableHead>
                          <TableHead
                            className="w-[60px] cursor-pointer select-none text-right"
                            onClick={() => handleSort("sell")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Venta
                              {getSortIcon("sell")}
                            </div>
                          </TableHead>
                          <TableHead className="hidden w-[60px] text-right lg:table-cell">
                            Variación
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedExchangeData().map((item, index) => (
                          <TableRow
                            key={item.name + "_" + index}
                            className={cn(
                              (typeof item.buy === "string"
                                ? parseFloat(item.buy)
                                : item.buy || 0) === bestBuyValue &&
                                bestBuyValue > 0 &&
                                "border-l-2 border-l-emerald-500 sm:border-l-4",
                              (typeof item.sell === "string"
                                ? parseFloat(item.sell)
                                : item.sell || 0) === bestSellValue &&
                                bestSellValue > 0 &&
                                "border-r-2 border-r-sky-500 sm:border-r-4",
                              item.is_online && "bg-muted/25",
                            )}
                          >
                            <TableCell className="p-2 font-medium sm:p-4">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="max-w-[80px] truncate text-xs font-medium sm:max-w-none sm:text-sm">
                                  {cleanBankName(item.name)}
                                </div>
                                {item.is_online && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 rounded-sm border border-border/60 bg-muted/50 px-2 py-1">
                                        <span className="text-xs text-muted-foreground sm:hidden">
                                          En línea
                                        </span>
                                        <Globe
                                          className="hidden h-3 w-3 flex-shrink-0 text-muted-foreground sm:block"
                                          aria-hidden="true"
                                        />
                                        <span className="hidden text-xs text-muted-foreground sm:inline">
                                          Banca en línea
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1">
                                        <p className="font-medium">
                                          Ventanilla Virtual
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Mejores tasas online
                                        </p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="p-2 text-right font-mono text-xs font-medium tnum sm:p-4 sm:text-sm">
                              {(typeof item.buy === "string"
                                ? parseFloat(item.buy)
                                : item.buy || 0
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell className="p-2 text-right font-mono text-xs font-medium tnum sm:p-4 sm:text-sm">
                              {(typeof item.sell === "string"
                                ? parseFloat(item.sell)
                                : item.sell || 0
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden p-2 text-right sm:p-4 lg:table-cell">
                              <span
                                className={cn(
                                  "font-mono text-xs font-medium tnum sm:text-sm",
                                  item.variation &&
                                    !item.variation.includes("-")
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400",
                                )}
                              >
                                {item.variation
                                  ? parseFloat(item.variation).toFixed(2)
                                  : ""}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </SurfaceContent>
            </Surface>
          </Reveal>
        </section>

        {/* Currency Converter */}
        <section aria-labelledby="conversor-moneda-heading">
          <Reveal>
            <Surface variant="elevated" className="mx-auto max-w-4xl">
              <SurfaceHeader>
                <h3
                  id="conversor-moneda-heading"
                  className="text-lg font-semibold tracking-tight"
                >
                  Conversor de Moneda USD a GTQ
                </h3>
              </SurfaceHeader>
              <SurfaceContent>
                <CurrencyConverter
                  exchangeRate={currentPrice}
                  exchangeRates={formattedExchangeRates}
                  selectedExchangeRate={selectedExchangeRate}
                  onExchangeRateChange={setSelectedExchangeRate}
                />
              </SurfaceContent>
            </Surface>
          </Reveal>
        </section>
      </div>
    </TooltipProvider>
  );
}

/** Section heading with hairline rules, matching the original treatment. */
function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" aria-hidden="true"></div>
      <h2
        id={id}
        className="px-1 text-base font-semibold tracking-tight text-foreground sm:text-lg"
      >
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" aria-hidden="true"></div>
    </div>
  );
}
