import axios from "axios";
import { IBinanceP2PReq, IDataResponse } from "@/interfaces";
import { convertXML } from "simple-xml-to-json";
import {
  parseDataForLegibleIn30DayRange,
  substract30DaysFromDate,
} from "./utils";
import { constant } from "@/constants";
import { getCached } from "./cache";

// Live bank rates change often: fresh for 60s, servable stale for 5min
// while a single background refresh runs (matches the CDN s-maxage=60).
const EXCHANGE_TTL_MS = 60_000;
const EXCHANGE_STALE_MS = 5 * 60_000;

// Banguat's 30-day historic series updates at most daily: fresh for 30min,
// servable stale for 6h. Keyed per requested date.
const HISTORIC_TTL_MS = 30 * 60_000;
const HISTORIC_STALE_MS = 6 * 60 * 60_000;

export const getDollarValueByBinaceP2PType = async ({
  asset = "USDT",
  operation = "BUY",
}: IBinanceP2PReq): Promise<IDataResponse> => {
  try {
    const URI = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
    const body = {
      additionalKycVerifyFilter: 0,
      proMerchantAds: false,
      page: 1,
      rows: 1,
      transAmount: 100, // Minimal amount
      filterType: operation == "BUY" ? "tradable" : "all",
      publisherType: "merchant",
      asset: asset,
      fiat: "GTQ",
      tradeType: operation,
    };
    const { data } = await axios.post(URI, body);
    const returnData: IDataResponse = {
      platform: "Binance",
      dollarValue: data?.data[0]?.adv?.price,
      info: '<a href="https://p2p.binance.com/" target="_blank">Binance</a> es una exchange de Criptomonedas donde puedes comprar en muchas formas una de ellas es P2P',
      currencyFiat: data?.data[0]?.adv?.fiatSymbol,
      operation,
    };
    return returnData;
  } catch (e) {
    throw new Error("Unable to fetch data from P2P of Binance " + e);
  }
};

export const getDollarByOsmoScrap = async () => {
  await fetch(
    "https://ayuda.osmowallet.com/es/articles/7437528-compra-y-vende-usdt-usdc",
  );
};

export const getBitcoinValue = async () => {
  // Use coindesk data
  const { data } = await axios.get(
    "https://api.coindesk.com/v1/bpi/currentprice/GTQ.json",
  );
  const obj = {
    platform: "Coindesk",
    USDPrice: data.bpi.USD.rate,
    GTQPrice: data.bpi.GTQ.rate,
    info:
      data.disclaimer +
      '\n Ver <a href="https://www.coindesk.com/" target="_blank">Coindesk</a>',
  };
  return obj;
};

export const call = async () => {
  const res = await Promise.all([
    getDollarValueByBinaceP2PType({ asset: "USDT", operation: "BUY" }),
    getDollarValueByBinaceP2PType({ asset: "USDT", operation: "SELL" }),
    getBitcoinValue(),
  ]);
  return res;
};

export const getLast30DaysOfDolarValueOfficialRecords = async (
  date: string,
) => {
  if (!date?.length) {
    throw new Error("Date is a required parameter");
  }
  return getCached(
    `historic:30d:${date}`,
    () => fetchLast30DaysFromBanguat(date),
    { ttlMs: HISTORIC_TTL_MS, staleMs: HISTORIC_STALE_MS },
  );
};

const fetchLast30DaysFromBanguat = async (date: string) => {
  try {
    const pastDay = substract30DaysFromDate(date);
    const uri = `${constant.BANC_GT_URI}${constant.BANC_GT_TIPO_CAMBIO}`;
    const soapReq = `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <TipoCambioFechaInicial xmlns="http://www.banguat.gob.gt/variables/ws/">
              <fechainit>${pastDay}</fechainit>
            </TipoCambioFechaInicial>
          </soap:Body>
        </soap:Envelope>
        `;

    const headers = {
      "Content-Type": "text/xml",
    };
    const { data } = await axios.post(uri, soapReq, {
      headers,
    });

    const reduceXML = /<Vars>(.*?)<\/Vars>/g.exec(data) || [""];
    const xml2JSON = convertXML(reduceXML[0]);
    if (!xml2JSON.length) {
      const pivot = xml2JSON.Vars.children;
      const formattedPivot = parseDataForLegibleIn30DayRange(pivot);
      console.info(JSON.stringify(formattedPivot));
      return formattedPivot;
    }

    throw new Error("No data fetch");
  } catch (e) {
    throw new Error("Unable to retrieve data from Banco de Guatemala " + e);
  }
};

export const getDataBank = async () => {
  return getCached(
    "exchange:data-bank",
    async () => {
      const { data } = await axios.get(
        "https://dolar-api.luislocon.dev/data-bank",
      );
      return data;
    },
    { ttlMs: EXCHANGE_TTL_MS, staleMs: EXCHANGE_STALE_MS },
  );
};
