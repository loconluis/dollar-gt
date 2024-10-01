"use client";

import { useState, useEffect } from "react";
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
import { ArrowUpIcon, ArrowDownIcon, InfoIcon, UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const generateDummyData = (days: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString().split("T")[0],
      price: (7.5 + Math.random() * 0.5).toFixed(4),
    });
  }
  return data;
};

export function DollarPriceTracker() {
  const [fourteenDayData, setFourteenDayData] = useState([]);
  const [thirtyDayData, setThirtyDayData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gtqAmount, setGtqAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");

  useEffect(() => {
    setFourteenDayData(generateDummyData(14));
    setThirtyDayData(generateDummyData(30));
    setIsLoaded(true);
  }, []);

  const calculateStats = (data) => {
    const prices = data.map((d) => parseFloat(d.price));
    return {
      max: Math.max(...prices).toFixed(4),
      min: Math.min(...prices).toFixed(4),
      avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(4),
    };
  };

  const thirtyDayStats = calculateStats(thirtyDayData);
  const currentPrice = parseFloat(
    fourteenDayData[fourteenDayData.length - 1]?.price
  );
  const startPrice = parseFloat(thirtyDayData[0]?.price);
  const priceChange = (currentPrice - startPrice).toFixed(4);
  const percentageChange = (
    ((currentPrice - startPrice) / startPrice) *
    100
  ).toFixed(2);

  const handleGtqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGtqAmount(value);
    setUsdAmount(value ? (parseFloat(value) / currentPrice).toFixed(2) : "");
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsdAmount(value);
    setGtqAmount(value ? (parseFloat(value) * currentPrice).toFixed(2) : "");
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8">
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 z-10 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dolar en Guatemala</h1>
          <div className="flex space-x-4">
            <Dialog>
              <DialogTrigger>
                <InfoIcon className="text-gray-400 hover:text-white transition-colors" />
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-gray-300 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Disclaimer</DialogTitle>
                </DialogHeader>
                <p>
                  This application uses simulated data for demonstration
                  purposes. In a real-world scenario, it would fetch live data
                  from a reliable financial API. The information presented here
                  should not be used for actual financial decisions.
                </p>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <UserIcon className="text-gray-400 hover:text-white transition-colors" />
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-gray-300 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Author Information
                  </DialogTitle>
                </DialogHeader>
                <p>Created by: Luis Locon</p>
                <p>
                  Contact:{" "}
                  <a href="https://x.com/loconluis" target="_blank">
                    @LoconLuis
                  </a>
                </p>
                <p>GitHub: github.com/dollargt</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <main className="mt-20 md:mx-40">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Precio del Dolar en Guatemala
        </h2>
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            >
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">Precio Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    className="text-4xl font-bold text-blue-600"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  >
                    {currentPrice.toFixed(4)} GTQ
                  </motion.p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 shadow-lg border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-400">
                    Cambio en los ultimos 30 Dias
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
                    Información del portal del
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="bg-gray-900 shadow-lg border border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-400">
                Tendencia del Precio (Ultimos 30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fourteenDayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="date" stroke="#4a5568" hide />
                    <YAxis domain={["auto", "auto"]} stroke="#4a5568" />
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
                      dataKey="price"
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
                Estadisticas del precio en los ultimos 30 dias
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
                      Precio Maximo
                    </TableCell>
                    <TableCell className="text-red-400">
                      {thirtyDayStats.max}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-300">
                      Precio Promedio
                    </TableCell>
                    <TableCell className="text-yellow-400">
                      {thirtyDayStats.avg}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-300">
                      Precio Minimo
                    </TableCell>
                    <TableCell className="text-blue-400">
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
                    GTQ Amount
                  </Label>
                  <Input
                    id="gtq-input"
                    type="number"
                    value={gtqAmount}
                    onChange={handleGtqChange}
                    placeholder="Enter GTQ amount"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="usd-input" className="text-gray-400">
                    USD Amount
                  </Label>
                  <Input
                    id="usd-input"
                    type="number"
                    value={usdAmount}
                    onChange={handleUsdChange}
                    placeholder="Enter USD amount"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
