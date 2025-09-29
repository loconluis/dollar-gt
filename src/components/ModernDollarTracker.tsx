"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  AlertCircle,
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
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
  MetricCard,
} from "@/components/ui/glass-card";
import { TrendChart } from "@/components/ui/chart";
import CurrencyConverter from "@/components/ui/currency-converter";
import ModernNavbar from "@/components/ui/modern-navbar";
import { use30DaysData } from "@/hooks/useFetch";
import { getToday } from "@/lib/utils";
import { FormattedHistoricObject } from "@/interfaces";
import { cn } from "@/lib/utils";

const exchanges = [
  {
    platform: "Banco Industrial",
    dollarValue: "7.75000",
    buyValue: "7.76000",
    info: "Tipo de cambio oficial del Banco de Guatemala",
    change: "+0.00120",
    isPositive: true,
  },
  {
    platform: "BANRURAL Guatemala",
    dollarValue: "7.75500",
    buyValue: "7.76500",
    info: "Tipo de cambio bancario comercial",
    change: "+0.00080",
    isPositive: true,
  },
  {
    platform: "Banco G&T",
    dollarValue: "7.75800",
    buyValue: "7.76800",
    info: "Tipo de cambio bancario comercial",
    change: "-0.00030",
    isPositive: false,
  },
  {
    platform: "NexaBanco",
    dollarValue: "7.75200",
    buyValue: "7.76200",
    info: "Tipo de cambio de banca digital",
    change: "+0.00050",
    isPositive: true,
  },
];

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
    <GlassCardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {change && (
              <span
                className={cn(
                  "text-xs font-medium",
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
        {icon && <div className="p-2 rounded-lg bg-accent/20">{icon}</div>}
      </div>
    </GlassCardContent>
  </GlassCard>
);

export function ModernDollarTracker() {
  const { data, loading } = use30DaysData(getToday());
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const [selectedExchangeRate, setSelectedExchangeRate] =
    React.useState("banco-guatemala");

  // Exchange rates data
  const exchangeRates = [
    {
      id: "banco-guatemala",
      name: "Banco de Guatemala",
      rate: 7.77,
      description: "Tipo de cambio oficial del Banco de Guatemala",
    },
    {
      id: "banco-industrial",
      name: "Banco Industrial",
      rate: parseFloat(exchanges[0]?.dollarValue || "7.75"),
      description: "Tipo de cambio oficial del Banco de Guatemala",
    },
    {
      id: "banrural",
      name: "BANRURAL Guatemala",
      rate: parseFloat(exchanges[1]?.dollarValue || "7.755"),
      description: "Tipo de cambio bancario comercial",
    },
    {
      id: "banco-gyt",
      name: "Banco G&T",
      rate: parseFloat(exchanges[2]?.dollarValue || "7.758"),
      description: "Tipo de cambio bancario comercial",
    },
    {
      id: "nexabanco",
      name: "NexaBanco",
      rate: parseFloat(exchanges[3]?.dollarValue || "7.752"),
      description: "Tipo de cambio de banca digital",
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
              <span>No hay datos disponibles. Por favor intente más tarde.</span>
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
  console.log("Data: ", data);
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />

      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Tipo de Cambio USD a GTQ
          </h1>
          <p className="text-lg text-muted-foreground">
            Seguimiento en tiempo real del precio del dólar en Guatemala
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Última actualización: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </motion.div>

        {/* Main Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-[500px]"
          >
            <GlassCard variant="elevated" className="h-full">
              <GlassCardHeader>
                <GlassCardTitle>Tendencia de Precio 30 Días</GlassCardTitle>
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
            className="h-[500px]"
          >
            <GlassCard variant="elevated" className="h-full">
              <GlassCardHeader>
                <GlassCardTitle>Estadísticas 30 Días</GlassCardTitle>
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
          className="mb-12"
        >
          <GlassCard variant="elevated">
            <GlassCardHeader>
              <GlassCardTitle>Tasas de Cambio por Plataforma</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plataforma</TableHead>
                    <TableHead className="text-right">Compra (GTQ)</TableHead>
                    <TableHead className="text-right">Venta (GTQ)</TableHead>
                    <TableHead className="text-right">Cambio 24h</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchanges.map((item) => (
                    <TableRow key={item.platform}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{item.platform}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.info}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.buyValue}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.dollarValue}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-medium",
                            item.isPositive ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {item.change}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Currency Converter and Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Currency Converter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <GlassCard variant="elevated">
              <GlassCardHeader>
                <GlassCardTitle>Conversor de Moneda</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <CurrencyConverter
                  exchangeRate={currentPrice}
                  exchangeRates={exchangeRates}
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
                <GlassCardTitle>Anuncio</GlassCardTitle>
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
  );
}
