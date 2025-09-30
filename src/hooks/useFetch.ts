import { IExchange } from "@/interfaces";
import { useEffect, useState } from "react";

export const useFetchExchange = () => {
  const [exchangeData, setData] = useState<IExchange[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const call = async () => {
      const res = await fetch("/api/exchange");
      const _data = await res.json();
      setData(() => [..._data?.data]);
      setLoading(false);
    };
    call();
  }, []);

  return { exchangeData, loadingExchange: loading };
};

export const use30DaysData = (date: string) => {
  const [data, setData] = useState([{ fecha: "", precio: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const call = async () => {
      const res = await fetch(`/api/historic?date=${date}`);
      const _data = await res.json();
      setData(() => [..._data?.data]);
      setLoading(false);
    };
    setLoading(true);
    call();
  }, [date]);

  return { data, loading };
};
