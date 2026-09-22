import { IExchange } from "@/interfaces";
import { useEffect, useState } from "react";

export const useFetchExchange = (seed?: IExchange[]) => {
  const [exchangeData, setData] = useState<IExchange[]>(seed ?? []);
  const [loading, setLoading] = useState(!seed || seed.length === 0);

  useEffect(() => {
    // Server-rendered pages pass a seed; only fall back to a client
    // fetch when the server could not produce rates.
    if (seed && seed.length > 0) return;
    const call = async () => {
      const res = await fetch("/api/exchange");
      const _data = await res.json();
      setData(() => [..._data?.data]);
      setLoading(false);
    };
    call();
  }, [seed]);

  return { exchangeData, loadingExchange: loading };
};
