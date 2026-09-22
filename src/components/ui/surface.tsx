"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Solid surface system. Replaces the previous faux-glass cards
 * (backdrop-blur over flat backgrounds with nothing to refract).
 * One border/shadow language, no hover lift theatre.
 */

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "minimal";
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border",
        variant === "default" && "bg-card border-border shadow-sm",
        variant === "elevated" && "bg-card border-border shadow-md",
        variant === "minimal" && "bg-transparent border-border/60",
        className,
      )}
      {...props}
    />
  ),
);
Surface.displayName = "Surface";

const SurfaceHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 border-b border-border/70 px-5 py-4 sm:px-6",
      className,
    )}
    {...props}
  />
));
SurfaceHeader.displayName = "SurfaceHeader";

const SurfaceTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
SurfaceTitle.displayName = "SurfaceTitle";

const SurfaceDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SurfaceDescription.displayName = "SurfaceDescription";

const SurfaceContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6", className)} {...props} />
));
SurfaceContent.displayName = "SurfaceContent";

/**
 * Entrance reveal. Mount-based on purpose: scroll-triggered reveals leave
 * content at opacity 0 for any renderer that never scrolls (crawlers,
 * social preview bots, stitched screenshots), which is an unacceptable
 * failure mode for an SEO-first page.
 */
function Reveal({
  children,
  className,
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  className,
}) => (
  <Surface className={cn("h-full", className)}>
    <SurfaceContent className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="flex-shrink-0 text-primary">{icon}</div>}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground tnum">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold tnum",
              trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(2)}%
            <span className="font-normal text-muted-foreground">
              ({trend.label})
            </span>
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </SurfaceContent>
  </Surface>
);

export {
  Surface,
  SurfaceHeader,
  SurfaceTitle,
  SurfaceDescription,
  SurfaceContent,
  MetricCard,
  Reveal,
};
