"use client";

import * as React from "react";

/**
 * Client island: shows the current time and refreshes every minute.
 * Rendered empty until hydration to avoid a server/client time mismatch.
 */
export function LastUpdated({ className }: { className?: string }) {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("es-GT"));
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time}
    </span>
  );
}
