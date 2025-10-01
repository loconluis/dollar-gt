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
import { LocalSEO } from "@/components/LocalSEO";
import { SEOFooter } from "@/components/SEOFooter";
import { use30DaysData, useFetchExchange } from "@/hooks/useFetch";
import { getToday } from "@/lib/utils";
import { FormattedHistoricObject } from "@/interfaces";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
              {value}
            </span>
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
        {icon && (
          <div className="p-1.5 sm:p-2 rounded-lg bg-accent/20 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </GlassCardContent>
  </GlassCard>
);

type SortField = "name" | "buy" | "sell";
type SortDirection = "asc" | "desc" | null;

export function ModernDollarTracker() {
  const { exchangeData, loadingExchange } = useFetchExchange();
  const { data, loading } = use30DaysData(getToday());
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const [selectedExchangeRate, setSelectedExchangeRate] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [filterType, setFilterType] = React.useState<
    "all" | "online" | "agencies"
  >("all");

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
    // Apply filter first
    let filteredData = [...exchangeData];
    if (filterType === "online") {
      filteredData = filteredData.filter((item) => item.is_online);
    } else if (filterType === "agencies") {
      filteredData = filteredData.filter((item) => !item.is_online);
    }

    // Then apply sorting
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
      return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
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
        <LocalSEO currentPrice={currentPrice} />
        <ModernNavbar />

        <main className="pt-16 sm:pt-20 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
          {/* Header */}
          <header>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-12"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4 px-2">
                Tipo de Cambio Dólar a Quetzal Guatemalteco
              </h1>
              <h2 className="text-lg sm:text-xl text-muted-foreground mb-1 sm:mb-2 px-2">
                Seguimiento en tiempo real - Guatemala
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4 max-w-2xl mx-auto">
                Consulta las tasas de cambio de bancos con gráficos históricos.
                Encuentra las mejores tasas para{" "}
                <a
                  href="#conversor-moneda-heading"
                  className="text-primary hover:underline"
                >
                  convertir dólares a quetzales
                </a>{" "}
                y visualiza el{" "}
                <a
                  href="#graficos-analisis-heading"
                  className="text-primary hover:underline"
                >
                  historial de precios
                </a>
                .
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                <span>
                  Última actualización: {lastUpdated.toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="#tasas-bancos-heading"
                    className="text-primary hover:underline"
                  >
                    Ver tasas por banco
                  </a>
                  <span>•</span>
                  <a
                    href="#mejores-tasas-heading"
                    className="text-primary hover:underline"
                  >
                    Mejores tasas
                  </a>
                  <span>•</span>
                  <a
                    href="#conversor-moneda-heading"
                    className="text-primary hover:underline"
                  >
                    Conversor
                  </a>
                </div>
              </div>
            </motion.div>
          </header>

          {/* Mejores Tasas Section */}
          <section aria-labelledby="mejores-tasas-heading">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 sm:mb-12"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-px bg-border flex-1"></div>
                <h2
                  id="mejores-tasas-heading"
                  className="text-base sm:text-lg font-semibold text-foreground px-3"
                >
                  Las Mejores Tasas 🔥
                </h2>
                <div className="h-px bg-border flex-1"></div>
              </div>
              {/* Best Rates and Call to Action - Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <MetricCard
                  title="Mejor Compra"
                  value={
                    bestBuyValue > 0 ? `${bestBuyValue.toFixed(2)} GTQ` : "N/A"
                  }
                  subtitle={
                    bestBuyValue > 0 ? getBestBuyExchange() : "No disponible"
                  }
                  icon={
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-600"></div>
                      <span>🤑</span>
                    </div>
                  }
                />

                <MetricCard
                  title="Mejor Venta"
                  value={
                    bestSellValue > 0
                      ? `${bestSellValue.toFixed(2)} GTQ`
                      : "N/A"
                  }
                  subtitle={
                    bestSellValue > 0 ? getBestSellExchange() : "No disponible"
                  }
                  icon={
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-600"></div>
                      <span>💸</span>
                    </div>
                  }
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => {
                    const table = document.getElementById(
                      "exchange-rates-table",
                    );
                    if (table) {
                      table.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="cursor-pointer"
                >
                  <GlassCard
                    variant="minimal"
                    className="h-full hover:bg-accent/50 transition-colors"
                  >
                    <GlassCardContent className="p-3 sm:p-4 lg:p-6 h-full">
                      <div className="flex flex-col h-full items-center justify-center text-center space-y-3">
                        <span>📊</span>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            Ver Todas las Tasas
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Para ver más datos, ve la tabla comparativa
                          </p>
                          <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                            Ver tabla completa
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Banco de Guatemala Section */}
          <section aria-labelledby="banguat-heading">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-px bg-border flex-1"></div>
                <h2
                  id="banguat-heading"
                  className="text-base sm:text-lg font-semibold text-foreground px-3"
                >
                  Banco de Guatemala
                </h2>
                <div className="h-px bg-border flex-1"></div>
              </div>
              {/* Main Metrics - First Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <MetricCard
                  title="Precio Actual"
                  value={`${currentPrice.toFixed(5)} GTQ`}
                  subtitle={`Al ${currentPriceDate} - Fuente: Banco de Guatemala`}
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
              </div>
            </motion.div>
          </section>

          {/* Chart and Stats */}
          <section aria-labelledby="graficos-analisis-heading">
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
                    <h3
                      id="graficos-analisis-heading"
                      className="text-lg font-semibold"
                    >
                      Gráficos y Análisis de Precios
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tendencia del tipo de cambio USD a GTQ últimos 30 días
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
          </section>

          {/* Exchange Rates Table */}
          <section aria-labelledby="tasas-bancos-heading">
            <motion.div
              id="exchange-rates-table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6 sm:mb-12"
            >
              <GlassCard variant="elevated">
                <GlassCardHeader className="relative z-30">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <h3
                        id="tasas-bancos-heading"
                        className="text-lg font-semibold"
                      >
                        Tasas de Cambio por Banco
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

                    {/* Filter Tabs - Fixed z-index and pointer-events */}
                    <div className="flex flex-col gap-3 pointer-events-auto">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log("Setting filter to all");
                            setFilterType("all");
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 hover:scale-105 active:scale-95 relative z-50 ${
                            filterType === "all"
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm"
                          }`}
                        >
                          Todos ({exchangeData.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            console.log("Setting filter to online");
                            setFilterType("online");
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 hover:scale-105 active:scale-95 relative z-50 ${
                            filterType === "online"
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            Servicios en línea
                          </span>
                          <span className="sm:hidden">En línea</span>(
                          {exchangeData.filter((item) => item.is_online).length}
                          )
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            console.log("Setting filter to agencies");
                            setFilterType("agencies");
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 hover:scale-105 active:scale-95 relative z-50 ${
                            filterType === "agencies"
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm"
                          }`}
                        >
                          Agencias (
                          {
                            exchangeData.filter((item) => !item.is_online)
                              .length
                          }
                          )
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          <span>Banca en línea</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-l-2 border-l-green-500 sm:border-l-4"></div>
                          <span>Mejor compra</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-r-2 border-r-blue-500 sm:border-r-4"></div>
                          <span>Mejor venta</span>
                        </div>
                      </div>
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
                            <TableHead
                              className="w-[100px] sm:w-auto cursor-pointer hover:bg-accent/50 transition-colors"
                              onClick={() => handleSort("name")}
                            >
                              <div className="flex items-center gap-2">
                                Banco
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-right w-[60px] cursor-pointer hover:bg-accent/50 transition-colors"
                              onClick={() => handleSort("buy")}
                            >
                              <div className="flex items-center justify-end gap-2">
                                Compra
                                {getSortIcon("buy")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-right w-[60px] cursor-pointer hover:bg-accent/50 transition-colors"
                              onClick={() => handleSort("sell")}
                            >
                              <div className="flex items-center justify-end gap-2">
                                Venta
                                {getSortIcon("sell")}
                              </div>
                            </TableHead>
                            <TableHead className="text-right w-[60px] hidden lg:table-cell">
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
                                  "border-l-2 sm:border-l-4 border-l-green-500",
                                (typeof item.sell === "string"
                                  ? parseFloat(item.sell)
                                  : item.sell || 0) === bestSellValue &&
                                  "border-r-2 sm:border-r-4 border-r-blue-500",
                                item.is_online && "bg-muted/20",
                              )}
                            >
                              <TableCell className="font-medium p-2 sm:p-4">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                                    {cleanBankName(item.name)}
                                  </div>
                                  {item.is_online && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-sm border border-border/50">
                                          <span className="text-xs text-muted-foreground sm:hidden">
                                            En línea
                                          </span>
                                          <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0 hidden sm:block" />
                                          <span className="text-xs text-muted-foreground hidden sm:inline">
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
          </section>

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
                  <h3
                    id="conversor-moneda-heading"
                    className="text-lg font-semibold"
                  >
                    Conversor de Moneda USD a GTQ
                  </h3>
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
                  <h3 className="text-lg font-semibold">Publicidad</h3>
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

        {/* SEO Footer */}
        <SEOFooter />
      </div>
    </TooltipProvider>
  );
}
