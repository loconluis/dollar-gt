"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
} from "@/components/ui/select";
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
  const [focusedInput, setFocusedInput] = React.useState<"gtq" | "usd" | null>(
    null,
  );
  const [internalSelectedRate, setInternalSelectedRate] = React.useState(
    selectedExchangeRate || exchangeRates[0]?.id || "",
  );

  const currentRate = selectedExchangeRate
    ? exchangeRates.find((r) => r.id === selectedExchangeRate)?.rate ||
      exchangeRate
    : exchangeRates.find((r) => r.id === internalSelectedRate)?.rate ||
      exchangeRate;

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
    <div className={cn("space-y-6", className)}>
      {/* Rate source select */}
      {exchangeRates.length > 0 && (
        <div className="flex justify-end">
          <Select
            value={selectedExchangeRate || internalSelectedRate}
            onValueChange={handleExchangeRateChange}
          >
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Seleccionar tasa de cambio" />
            </SelectTrigger>
            <SelectContent>
              {exchangeRates.map((rate) => (
                <SelectItem key={rate.id} value={rate.id}>
                  <div className="flex items-center gap-2">
                    <SelectItemText>{rate.name}</SelectItemText>
                    {rate.is_online && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        Virtual
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        {/* GTQ Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="gtq-input"
              className={cn(
                "text-sm font-medium transition-colors",
                focusedInput === "gtq"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              Quetzal Guatemalteco (GTQ)
            </Label>
            <span className="font-mono text-xs text-muted-foreground tnum">
              {gtqAmount && formatNumber(gtqAmount)}
            </span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                Q
              </span>
            </div>
            <Input
              id="gtq-input"
              type="number"
              inputMode="decimal"
              value={gtqAmount}
              onChange={handleGtqChange}
              onFocus={() => setFocusedInput("gtq")}
              onBlur={() => setFocusedInput(null)}
              placeholder="0.00"
              className="border-border bg-background pl-8 font-mono text-lg font-medium tnum transition-colors focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center sm:pb-2">
          <button
            type="button"
            onClick={swapCurrencies}
            aria-label="Intercambiar montos"
            className="rounded-lg border border-border bg-muted/50 p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* USD Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="usd-input"
              className={cn(
                "text-sm font-medium transition-colors",
                focusedInput === "usd"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              Dólar Americano (USD)
            </Label>
            <span className="font-mono text-xs text-muted-foreground tnum">
              {usdAmount && formatNumber(usdAmount)}
            </span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                $
              </span>
            </div>
            <Input
              id="usd-input"
              type="number"
              inputMode="decimal"
              value={usdAmount}
              onChange={handleUsdChange}
              onFocus={() => setFocusedInput("usd")}
              onBlur={() => setFocusedInput(null)}
              placeholder="0.00"
              className="border-border bg-background pl-8 font-mono text-lg font-medium tnum transition-colors focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Exchange Rate Display */}
      <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tasa de Cambio</span>
          <span className="font-mono font-medium tnum">
            1 USD = {currentRate.toFixed(5)} GTQ
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tasa Inversa</span>
          <span className="font-mono font-medium tnum">
            1 GTQ = {(1 / currentRate).toFixed(5)} USD
          </span>
        </div>
        {exchangeRates.length > 0 && (
          <div className="mt-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fuente</span>
            <span className="font-medium">
              {exchangeRates.find(
                (r) => r.id === (selectedExchangeRate || internalSelectedRate),
              )?.name || "Desconocido"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
