"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  AlertCircle,
  Globe,
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
  GlassCard,
  GlassCardHeader,
  GlassCardContent,
  MetricCard,
} from "@/components/ui/glass-card";
import { TrendChart } from "@/components/ui/chart";
import CurrencyConverter from "@/components/ui/currency-converter";
import ModernNavbar from "@/components/ui/modern-navbar";
import { StructuredData } from "@/components/StructuredData";
import { use30DaysData, useFetchExchange } from "@/hooks/useFetch";
import { getToday } from "@/lib/utils";
import { FormattedHistoricObject } from "@/interfaces";
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
  <GlassCard variant="minimal" className="h-full">
    <GlassCardContent className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">{value}</span>
            {change && (
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  changeType === "positive" && "text-green-500",
                  changeType === "negative" && "text-red-500",
                  changeType === "neutral" && "text-muted-foreground",
                )}
              >
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && <div className="p-1.5 sm:p-2 rounded-lg bg-accent/20 flex-shrink-0">{icon}</div>}
      </div>
    </GlassCardContent>
  </GlassCard>
);

export function ModernDollarTracker() {
  const { exchangeData, loadingExchange } = useFetchExchange();
  const { data, loading } = use30DaysData(getToday());
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const [selectedExchangeRate, setSelectedExchangeRate] = React.useState("");

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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Cargando tasas de cambio...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length || (data.length === 1 && !data[0].precio)) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNavbar />
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>
                No hay datos disponibles. Por favor intente más tarde.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateStats = (data: FormattedHistoricObject[]) => {
    const prices = data.map((d) => parseFloat(d.precio ?? 0));
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
  const currentPrice = parseFloat(data[data.length - 1]?.precio ?? 0);
  const currentPriceDate = data[data.length - 1]?.fecha;
  const startPrice = parseFloat(data[0]?.precio ?? 0);
  const priceChange = (currentPrice - startPrice).toFixed(5);
  const percentageChange = (
    ((currentPrice - startPrice) / startPrice) *
    100
  ).toFixed(2);

  const isPriceUp = parseFloat(priceChange ?? 0) >= 0;
  const trendColor = isPriceUp ? "text-green-500" : "text-red-500";
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <StructuredData exchangeData={exchangeData} />
        <ModernNavbar />

        <main className="pt-16 sm:pt-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4 px-2">
              Tipo de Cambio USD a GTQ
            </h1>
            <h2 className="text-lg sm:text-xl text-muted-foreground mb-1 sm:mb-2 px-2">
              Seguimiento en tiempo real - Guatemala
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
              Consulta las tasas de cambio de bancos con gráficos históricos
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              <span>
                Última actualización: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>

          {/* Main Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-12"
          >
            <MetricCard
              title="Precio Actual"
              value={`${currentPrice.toFixed(5)} GTQ`}
              subtitle={`Al ${currentPriceDate}`}
              trend={{
                value: Math.abs(parseFloat(percentageChange ?? 0)),
                label: "30 días",
                isPositive: isPriceUp,
              }}
              icon={<Building2 className="w-5 h-5 text-primary" />}
            />

            <MetricCard
              title="Cambio 30 Días"
              value={`${isPriceUp ? "+" : ""}${priceChange} GTQ`}
              subtitle={`${isPriceUp ? "+" : ""}${percentageChange}%`}
              icon={
                isPriceUp ? (
                  <TrendingUp className={`w-5 h-5 ${trendColor}`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 ${trendColor}`} />
                )
              }
            />

            <MetricCard
              title="Volatilidad"
              value={`${thirtyDayStats.volatility}%`}
              subtitle="Rango de 30 días"
              icon={<RefreshCw className="w-5 h-5 text-primary" />}
            />
          </motion.div>

          {/* Chart and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-[400px] sm:h-[500px]"
            >
              <GlassCard variant="elevated" className="h-full">
                <GlassCardHeader>
                  <h3 className="text-lg font-semibold">
                    Tendencia de Precio 30 Días
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fuente: Banco de Guatemala
                  </p>
                </GlassCardHeader>
                <GlassCardContent className="p-6 h-[calc(100%-100px)]">
                  <TrendChart
                    data={data.map((item) => ({
                      ...item,
                      precio: parseFloat(item.precio ?? 0),
                    }))}
                    dataKey="precio"
                    xAxisKey="fecha"
                    height="100%"
                    showArea={true}
                  />
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="h-[400px] sm:h-[500px]"
            >
              <GlassCard variant="elevated" className="h-full">
                <GlassCardHeader>
                  <h3 className="text-lg font-semibold">
                    Estadísticas 30 Días
                  </h3>
                </GlassCardHeader>
                <GlassCardContent className="p-6 h-[calc(100%-80px)]">
                  <div className="h-full flex flex-col space-y-4">
                    <StatCard
                      title="Precio Más Alto"
                      value={`${thirtyDayStats.max} GTQ`}
                      changeType="positive"
                      icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                    />
                    <StatCard
                      title="Precio Promedio"
                      value={`${thirtyDayStats.avg} GTQ`}
                      changeType="neutral"
                      icon={<RefreshCw className="w-4 h-4 text-primary" />}
                    />
                    <StatCard
                      title="Precio Más Bajo"
                      value={`${thirtyDayStats.min} GTQ`}
                      changeType="negative"
                      icon={<TrendingDown className="w-4 h-4 text-red-500" />}
                    />
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>

          {/* Exchange Rates Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 sm:mb-12"
          >
            <GlassCard variant="elevated">
              <GlassCardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    Tasas de Cambio por Plataforma
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    Datos de{" "}
                    <a
                      href="https://www.infodolar.com.gt/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline transition-colors"
                    >
                      infodolar.com.gt
                    </a>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-l-2 border-l-green-500 sm:border-l-4"></div>
                    <span>Mejor compra</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-r-2 border-r-blue-500 sm:border-r-4"></div>
                    <span>Mejor venta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span>Ventanilla Virtual</span>
                  </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                {loadingExchange ? (
                  <div className="space-y-4">
                    {/* Skeleton rows */}
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="flex gap-8">
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] sm:w-auto">Banco</TableHead>
                          <TableHead className="text-right w-[60px]">Compra</TableHead>
                          <TableHead className="text-right w-[60px]">Venta</TableHead>
                          <TableHead className="text-right w-[60px] hidden lg:table-cell">Variación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...exchangeData]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((item, index) => (
                            <TableRow
                              key={item.name + "_" + index}
                              className={cn(
                                (typeof item.buy === "string"
                                  ? parseFloat(item.buy)
                                  : item.buy || 0) === bestBuyValue &&
                                  "border-l-2 sm:border-l-4 border-l-green-500",
                                (typeof item.sell === "string"
                                  ? parseFloat(item.sell)
                                  : item.sell || 0) === bestSellValue &&
                                  "border-r-2 sm:border-r-4 border-r-blue-500",
                              )}
                            >
                              <TableCell className="font-medium p-2 sm:p-4">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                                    {item.name}
                                  </div>
                                  {item.is_online && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Ventanilla Virtual</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium p-2 sm:p-4 text-xs sm:text-sm">
                                {(typeof item.buy === "string"
                                  ? parseFloat(item.buy)
                                  : item.buy || 0
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-medium p-2 sm:p-4 text-xs sm:text-sm">
                                {(typeof item.sell === "string"
                                  ? parseFloat(item.sell)
                                  : item.sell || 0
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right p-2 sm:p-4 hidden lg:table-cell">
                                <span
                                  className={cn(
                                    "font-medium text-xs sm:text-sm",
                                    item.variation &&
                                      !item.variation.includes("-")
                                      ? "text-green-500"
                                      : "text-red-500",
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
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Currency Converter and Ads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* Currency Converter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-2"
            >
              <GlassCard variant="elevated">
                <GlassCardHeader>
                  <h3 className="text-lg font-semibold">Conversor de Moneda</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <CurrencyConverter
                    exchangeRate={currentPrice}
                    exchangeRates={formattedExchangeRates}
                    selectedExchangeRate={selectedExchangeRate}
                    onExchangeRateChange={setSelectedExchangeRate}
                  />
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Google Ads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <GlassCard variant="elevated">
                <GlassCardHeader>
                  <h3 className="text-lg font-semibold">Anuncio</h3>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="bg-muted/20 rounded-lg p-4 min-h-[250px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Espacio para Anuncios
                    </p>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
