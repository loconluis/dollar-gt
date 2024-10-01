"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RefreshCcw, Info } from "lucide-react";
import { useFetchData } from "@/hooks/useFetch";
import Link from "next/link";

export function CurrencyExchangeRatesComponent() {
  const [mounted, setMounted] = useState(false);
  const { data, loading, handleRefresh } = useFetchData();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [bankGt, binanceBuy, binanceSell, coinDesk] = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-5xl mx-auto space-y-8 md:my-16">
        <Card className="bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-100">
              Banco de Guatemala
            </CardTitle>
            <CardTitle className="text-2xl font-bold text-center text-gray-100">
              Tipo de Cambio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400">
                  Precio de compra/venta (GTQ)
                </p>
                <p className="text-4xl font-bold text-green-400">
                  {loading ? (
                    <span className="inline-block h-4 w-40 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    `${bankGt.dollarValue}`
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center mt-4">
              Consulta: {new Date().toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-100">
              Cripto Moneda Estable
            </CardTitle>
            <CardTitle className="text-2xl font-bold text-center text-gray-100">
              Tipo de Cambio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center md:mx-40">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400">
                  Compra (GTQ)
                </p>
                <p className="text-4xl font-bold text-green-400">
                  {loading ? (
                    <span className="inline-block h-4 w-40 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    binanceBuy.dollarValue
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400">Venta (GTQ)</p>
                <p className="text-4xl font-bold text-red-400">
                  {loading ? (
                    <span className="inline-block h-4 w-40 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    binanceSell.dollarValue
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center mt-4">
              Consulta: {new Date().toLocaleString()}
            </p>
            <p
              className="text-sm text-gray-400 text-center mt-4"
              dangerouslySetInnerHTML={{ __html: binanceBuy.info }}
            ></p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-100">
              Bitcoin al dia de hoy
            </CardTitle>
            <CardTitle className="text-2xl font-bold text-center text-gray-100"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400">
                  Precio de 1 BTC (GTQ)
                </p>
                <p className="text-4xl font-bold text-green-400">
                  {loading ? (
                    <span className="inline-block h-4 w-40 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    `${coinDesk.GTQPrice}`
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center mt-4">
              Consulta: {new Date().toLocaleString()}
            </p>
            <p
              className="text-sm text-gray-400 text-center mt-4"
              dangerouslySetInnerHTML={{ __html: coinDesk.info }}
            ></p>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleRefresh}
              className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Refrescar datos</span>
            </Button>
            {/* <Button
              size="icon"
              variant="outline"
              onClick={() => console.log("Share clicked")}
              className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share rates</span>
            </Button> */}
          </div>

          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Informacion</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
              <DialogHeader>
                <DialogTitle>Acerca de este proyecto</DialogTitle>
                <DialogDescription>
                  Dolar en Guatemala y Bitcoin
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <p>Esto no es un consejo de inversión</p>
                <p>
                  Este proyecto busca proyectar el valor del dolar en Guatemala,
                  para tomar una mejor decision de donde y como poder comprarlo.
                </p>

                <p>
                  La intencion es poder o querer agregar los precios de Tasa de
                  Cambio de las plataformas locales, pero estas no estan
                  expuestas, asi que no las pude incluir. Pero intentare ver
                  como rescatarlas
                </p>

                <p>
                  Este proyecto esta hecho con librerias OSS. React, TS, NextJs,
                  V0 y desplegado en Vercel
                </p>

                <DialogDescription>
                  Codigo gracias a{" "}
                  <Link href="https://x.com/loconluis" target="_blank">
                    @LoconLuis
                  </Link>
                </DialogDescription>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
