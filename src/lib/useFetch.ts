import { useEffect, useState } from "react";

const defaultValues = [
  {
    platform: "Banco de Guatemala",
    dollarValue: "",
    info: "Este es el valor oficial del Banco de Guatemala",
  },
  {
    platform: "Binance",
    dollarValue: "",
    info: "Binance es una exchange de Cryptomonedas donde puedes comprar en muchas formas una de ellas es P2P",
    currencyFiat: "Q",
    operation: "BUY",
  },
  {
    platform: "Binance",
    dollarValue: "",
    info: "Binance es una exchange de Cryptomonedas donde puedes comprar en muchas formas una de ellas es P2P",
    currencyFiat: "Q",
    operation: "SELL",
  },
  {
    platform: "Coindesk",
    USDPrice: "",
    GTQPrice: "",
    info: "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
  },
];

export const useFetchData = () => {
  const [data, setData] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    const call = async () => {
      const res = await fetch("/api/exchange");
      const _data = await res.json();
      setData(() => [..._data?.data]);
      setLoading(false);
    };
    call();
  }, [refresh]);

  const handleRefresh = () => {
    console.log("hago algo");
    setRefresh((prevState) => {
      console.log("prevState", prevState);
      return prevState + 1;
    });
  };

  return { data, loading, handleRefresh };
};
