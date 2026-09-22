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
 * The from-value lives in a ref that is only written inside the
 * animation callback, never during render.
 */
export function AnimatedNumber({
  value,
  decimals = 2,
  className,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const displayRef = React.useRef(value);

  React.useEffect(() => {
    if (reduce) {
      return;
    }
    const controls = animate(displayRef.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  if (reduce) {
    return <span className={className}>{value.toFixed(decimals)}</span>;
  }

  return <span className={className}>{display.toFixed(decimals)}</span>;
}
