"use client";

import * as React from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

/**
 * Tweens between numeric values when live data changes.
 * Reduced-motion users get the final value immediately.
 */
export function AnimatedNumber({
  value,
  decimals = 2,
  className,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const displayRef = React.useRef(value);
  displayRef.current = display;

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(displayRef.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{display.toFixed(decimals)}</span>;
}
