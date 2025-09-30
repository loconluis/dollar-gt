"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { GlassCard, GlassCardHeader, GlassCardContent } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ExchangeRateOption {
  id: string;
  name: string;
  rate: number;
  description: string;
  is_online?: boolean;
}

interface CurrencyConverterProps {
  exchangeRate: number;
  className?: string;
  exchangeRates?: ExchangeRateOption[];
  selectedExchangeRate?: string;
  onExchangeRateChange?: (exchangeId: string) => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  exchangeRate,
  className,
  exchangeRates = [],
  selectedExchangeRate,
  onExchangeRateChange,
}) => {
  const [gtqAmount, setGtqAmount] = React.useState("");
  const [usdAmount, setUsdAmount] = React.useState("");
  const [focusedInput, setFocusedInput] = React.useState<"gtq" | "usd" | null>(null);
  const [internalSelectedRate, setInternalSelectedRate] = React.useState(selectedExchangeRate || exchangeRates[0]?.id || "");

  const currentRate = selectedExchangeRate
    ? exchangeRates.find(r => r.id === selectedExchangeRate)?.rate || exchangeRate
    : exchangeRates.find(r => r.id === internalSelectedRate)?.rate || exchangeRate;

  const handleGtqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGtqAmount(value);
    setUsdAmount(value ? (parseFloat(value) / currentRate).toFixed(5) : "");
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsdAmount(value);
    setGtqAmount(value ? (parseFloat(value) * currentRate).toFixed(5) : "");
  };

  const handleExchangeRateChange = (exchangeId: string) => {
    if (onExchangeRateChange) {
      onExchangeRateChange(exchangeId);
    } else {
      setInternalSelectedRate(exchangeId);
    }
    // Clear amounts when exchange rate changes
    setGtqAmount("");
    setUsdAmount("");
  };

  const formatNumber = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    });
  };

  const swapCurrencies = () => {
    const temp = gtqAmount;
    setGtqAmount(usdAmount);
    setUsdAmount(temp);
  };

  return (
    <GlassCard className={className} variant="elevated">
      <GlassCardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Conversor de Moneda</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {exchangeRates.length > 0 && (
              <Select
                value={selectedExchangeRate || internalSelectedRate}
                onValueChange={handleExchangeRateChange}
              >
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Seleccionar tasa de cambio" />
                </SelectTrigger>
                <SelectContent>
                  {exchangeRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.id}>
                      <div className="flex items-center gap-2">
                        <span>{rate.name}</span>
                        {rate.is_online && (
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            Virtual
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            </div>
        </div>
      </GlassCardHeader>
      <GlassCardContent>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* GTQ Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor="gtq-input"
                className={cn(
                  "text-sm font-medium transition-colors",
                  focusedInput === "gtq" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Quetzal Guatemalteco (GTQ)
              </Label>
              <span className="text-xs text-muted-foreground">
                {gtqAmount && formatNumber(gtqAmount)}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground text-sm font-medium">Q</span>
              </div>
              <Input
                id="gtq-input"
                type="number"
                value={gtqAmount}
                onChange={handleGtqChange}
                onFocus={() => setFocusedInput("gtq")}
                onBlur={() => setFocusedInput(null)}
                placeholder="0.00"
                className="pl-8 text-lg font-medium bg-background/50 border-border/30 focus:border-primary/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Swap Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapCurrencies}
              className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </motion.div>

          {/* USD Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor="usd-input"
                className={cn(
                  "text-sm font-medium transition-colors",
                  focusedInput === "usd" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Dólar Americano (USD)
              </Label>
              <span className="text-xs text-muted-foreground">
                {usdAmount && formatNumber(usdAmount)}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground text-sm font-medium">$</span>
              </div>
              <Input
                id="usd-input"
                type="number"
                value={usdAmount}
                onChange={handleUsdChange}
                onFocus={() => setFocusedInput("usd")}
                onBlur={() => setFocusedInput(null)}
                placeholder="0.00"
                className="pl-8 text-lg font-medium bg-background/50 border-border/30 focus:border-primary/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Exchange Rate Display */}
          <motion.div
            className="p-4 rounded-lg bg-accent/20 border border-border/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tasa de Cambio</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  1 USD = {currentRate.toFixed(5)} GTQ
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Tasa Inversa</span>
              <span className="font-medium">
                1 GTQ = {(1 / currentRate).toFixed(5)} USD
              </span>
            </div>
            {exchangeRates.length > 0 && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Fuente</span>
                <span className="font-medium">
                  {exchangeRates.find(r => r.id === (selectedExchangeRate || internalSelectedRate))?.name || "Desconocido"}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </GlassCardContent>
    </GlassCard>
  );
};

export default CurrencyConverter;