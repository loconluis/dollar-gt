"use client";

import * as React from "react";
import { ReactElement } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: ReactElement;
  className?: string;
  height?: string | number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
  height = 300,
}) => (
  <div className={cn("w-full", className)} style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  formatter?: (value: number) => string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter = (value) => value.toString(),
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-border bg-popover p-4 shadow-xl"
    >
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.name}:{" "}
            <span className="font-semibold text-foreground">
              {formatter(entry.value)}
            </span>
          </span>
        </div>
      ))}
    </motion.div>
  );
};

interface TrendChartProps {
  data: Array<Record<string, number | string>>;
  dataKey: string;
  xAxisKey: string;
  className?: string;
  height?: string | number;
  showArea?: boolean;
  color?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  className,
  height,
  showArea = true,
  color = "hsl(var(--chart-1))",
}) => {
  const reduce = useReducedMotion();
  const ChartComponent = showArea ? AreaChart : LineChart;
  const monoTick = {
    fontSize: 11,
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  };

  return (
    <ChartContainer className={className} height={height}>
      <ChartComponent data={data}>
        <defs>
          {showArea && (
            <linearGradient
              id={`gradient-${dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border/20"
          vertical={false}
        />
        <XAxis
          dataKey={xAxisKey}
          className="text-muted-foreground text-xs"
          tick={monoTick}
          tickLine={false}
          axisLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          dataKey={dataKey}
          className="text-muted-foreground text-xs"
          tick={monoTick}
          tickLine={false}
          axisLine={false}
          domain={["dataMin - 0.1", "dataMax + 0.1"]}
          tickFormatter={(value) => value.toFixed(3) ?? 0}
        />
        <Tooltip content={<CustomTooltip />} />
        {showArea ? (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
            dot={false}
            isAnimationActive={!reduce}
            animationDuration={900}
            activeDot={{
              r: 4,
              fill: color,
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
            }}
          />
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduce}
            activeDot={{
              r: 4,
              fill: color,
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
            }}
          />
        )}
      </ChartComponent>
    </ChartContainer>
  );
};

interface BarChartProps {
  data: Array<Record<string, number | string>>;
  dataKey: string;
  xAxisKey: string;
  className?: string;
  height?: string | number;
  color?: string;
}

const ModernBarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  className,
  height,
  color = "hsl(var(--chart-1))",
}) => (
  <ChartContainer className={className} height={height}>
    <BarChart data={data}>
      <defs>
        <linearGradient
          id={`bar-gradient-${dataKey}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={color} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        className="stroke-border/20"
        vertical={false}
      />
      <XAxis
        dataKey={xAxisKey}
        className="text-muted-foreground text-xs"
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        className="text-muted-foreground text-xs"
        tickLine={false}
        axisLine={false}
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey={dataKey}
        fill={`url(#bar-gradient-${dataKey})`}
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ChartContainer>
);

interface SparklineProps {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  showMinMax?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  className,
  width = 120,
  height = 40,
  color = "hsl(var(--chart-1))",
  showMinMax = false,
}) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const min = Math.min(...data);
  const max = Math.max(...data);

  return (
    <div className={cn("relative", className)}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {showMinMax && (
        <div className="absolute inset-0 flex justify-between items-end pb-1 px-1">
          <span className="text-xs text-muted-foreground">
            {min.toFixed(3)}
          </span>
          <span className="text-xs text-muted-foreground">
            {max.toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
};

export { ChartContainer, CustomTooltip, TrendChart, ModernBarChart, Sparkline };
