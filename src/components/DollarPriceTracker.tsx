"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use30DaysData } from "@/hooks/useFetch";
import { getToday } from "@/lib/utils";
import { FormattedHistoricObject } from "@/interfaces";
import Navbar from "./navbar";

const exchanges = [
  {
    platform: "Banco Industrial",
    dollarValue: "",
    info: "Este es el valor oficial del Banco de Guatemala",
  },
  {
    platform: "BANRURAL Guatemala",
    dollarValue: "",
    info: "Binance es una exchange de Cryptomonedas donde puedes comprar en muchas formas una de ellas es P2P",
    currencyFiat: "Q",
    operation: "BUY",
  },
  {
    platform: "Banco G&T",
    dollarValue: "",
    info: "Binance es una exchange de Cryptomonedas donde puedes comprar en muchas formas una de ellas es P2P",
    currencyFiat: "Q",
    operation: "SELL",
  },
  {
    platform: "NexaBanco",
    USDPrice: "",
    GTQPrice: "",
    info: "This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
  },
];

export function DollarPriceTracker() {
  const [gtqAmount, setGtqAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const { data, loading } = use30DaysData(getToday());
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("Data", data);
  const dateForQuery = new Date();

  const calculateStats = (data: FormattedHistoricObject[]) => {
    const prices = data.map((d) => parseFloat(d.precio));
    return {
      max: Math.max(...prices).toFixed(5),
      min: Math.min(...prices).toFixed(5),
      avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(5),
    };
  };

  const thirtyDayStats = calculateStats(data);
  const currentPrice = parseFloat(data[data.length - 1]?.precio);
  const currentPrinceDate = data[data.length - 1]?.fecha;
  const startPrice = parseFloat(data[0]?.precio);
  const priceChange = (currentPrice - startPrice).toFixed(5);
  const percentageChange = (
    ((currentPrice - startPrice) / startPrice) *
    100
  ).toFixed(2);

  const handleGtqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGtqAmount(value);
    setUsdAmount(value ? (parseFloat(value) / currentPrice).toFixed(5) : "");
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsdAmount(value);
    setGtqAmount(value ? (parseFloat(value) * currentPrice).toFixed(5) : "");
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8">
      <Navbar />

      <main className="mt-20 md:mx-40">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Precio del dólar (USD) en Guatemala
        </h2>
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            >
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">Precio actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-4xl font-bold text-blue-600"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  >
                    {currentPrice.toFixed(5)} GTQ
                  </motion.p>
                  <div className="text-slate-400">
                    <small suppressHydrationWarning>
                      a la fecha {currentPrinceDate}
                    </small>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">
                    Cambio en los últimos 30 días
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`flex items-center ${
                      parseFloat(priceChange) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                  >
                    {parseFloat(priceChange) >= 0 ? (
                      <ArrowUpIcon className="mr-2" />
                    ) : (
                      <ArrowDownIcon className="mr-2" />
                    )}
                    <p className="text-2xl font-bold">
                      {Math.abs(parseFloat(priceChange))} GTQ
                    </p>
                  </motion.div>
                  <p className="text-lg text-slate-600">
                    ({percentageChange}%)
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">
                    Información del portal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`flex items-center text-white`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                  >
                    <p className="text-2xl font-bold">Banco de Guatemala</p>
                  </motion.div>
                  <div className="text-slate-400">
                    <small suppressHydrationWarning>
                      Datos consultados:{" "}
                      {dateForQuery.toLocaleDateString() +
                        " " +
                        dateForQuery.toLocaleTimeString()}
                    </small>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="my-20 ">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Cotizaciones
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plataforma</TableHead>
                <TableHead>Valor</TableHead>
                {/* <TableHead>Info</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {exchanges.map((item) => (
                <TableRow key={item.platform}>
                  <TableCell>{item.platform}</TableCell>
                  <TableCell>{item.dollarValue}</TableCell>
                  {/* <TableCell>{item.info}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="bg-gray-900 shadow-lg border border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-400">
                Tendencia del precio (últimos 30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="fecha" stroke="#4a5568" hide />
                    <YAxis
                      dataKey="precio"
                      domain={["auto", "auto"]}
                      stroke="#4a5568"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#e2e8f0" }}
                      labelStyle={{ color: "#718096" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="precio"
                      stroke="#0057ff"
                      strokeWidth={3}
                      dot={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gray-900 shadow-lg border border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-400">
                Estadísticas del precio en los últimos 30 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400">Datos</TableHead>
                    <TableHead className="text-gray-400">
                      Precio (GTQ)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-gray-300">
                      Precio máximo
                    </TableCell>
                    <TableCell className="text-blue-400">
                      {thirtyDayStats.max}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-300">
                      Precio promedio
                    </TableCell>
                    <TableCell className="text-yellow-400">
                      {thirtyDayStats.avg}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-300">
                      Precio mínimo
                    </TableCell>
                    <TableCell className="text-green-400">
                      {thirtyDayStats.min}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Card className="bg-gray-900 shadow-lg border border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-400">
                Convertidor de divisas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 gap-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              >
                <div>
                  <Label htmlFor="gtq-input" className="text-gray-400">
                    Monto en GTQ
                  </Label>
                  <Input
                    id="gtq-input"
                    type="number"
                    value={gtqAmount}
                    onChange={handleGtqChange}
                    placeholder="Agrega el monto en GTQ"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="usd-input" className="text-gray-400">
                    Monto en USD
                  </Label>
                  <Input
                    id="usd-input"
                    type="number"
                    value={usdAmount}
                    onChange={handleUsdChange}
                    placeholder="Agrega el monto en USD"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        {false && (
          <>
            <h3 className="text-2xl font-bold my-8 text-white">
              Dolar en Digital
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">
                    Precio de monedas estables o stablecoins (USDT, USDC, DAI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-400">
                          Plataforma
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Compra (GTQ)
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Venta (GTQ)
                        </TableHead>
                        <TableHead className="text-gray-400">Ver</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-gray-300">
                          Binance P2P
                        </TableCell>
                        <TableCell className="text-blue-400">
                          {thirtyDayStats.max}
                        </TableCell>
                        <TableCell className="text-blue-400">
                          {thirtyDayStats.max}
                        </TableCell>
                        <TableCell className="text-blue-400">Link</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
