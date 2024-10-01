import axios from "axios";
import { IBinanceP2PReq, IDataResponse } from "@/interfaces";
import { convertXML } from "simple-xml-to-json";
import {
  parseDataForLegibleIn30DayRange,
  substract30DaysFromDate,
} from "./utils";
import { constant } from "@/constants";

const getDollarValueBancoGuate = async (): Promise<IDataResponse> => {
  try {
    const soap = "https://banguat.gob.gt/variables/ws/TipoCambio.asmx";
    const soapRequest = `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <TipoCambioDia xmlns="http://www.banguat.gob.gt/variables/ws/" />
            </soap:Body>
        </soap:Envelope>
    `;
    const headers = {
      "Content-Type": "text/xml",
      SOAPAction: '"http://www.banguat.gob.gt/variables/ws/TipoCambioDia"',
    };
    const { data } = await axios.post(soap, soapRequest, {
      headers,
    });

    const reduceXML = /<referencia>(.*?)<\/referencia>/g.exec(data) || [""];
    const xml2JSON = convertXML(reduceXML[0]);
    if (!xml2JSON.length) {
      console.log("BNGT VD: ", xml2JSON.referencia.content);
      return {
        platform: "Banco de Guatemala",
        dollarValue: xml2JSON.referencia.content,
        info: "Este es el valor oficial del Banco de Guatemala",
      };
    }

    throw new Error("No data fetch");
  } catch (error) {
    throw new Error("Unable to retrieve data from Banco de Guatemala " + error);
  }
};

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
    console.log("Binance " + operation + " VD: ", data?.data[0]?.adv?.price);
    return returnData;
  } catch (e) {
    throw new Error("Unable to fetch data from P2P of Binance " + e);
  }
};

export const getDollarByOsmoScrap = async () => {};

export const getBitcoinValue = async () => {
  // Use coindesk data
  const { data } = await axios.get(
    "https://api.coindesk.com/v1/bpi/currentprice/GTQ.json"
  );
  const obj = {
    platform: "Coindesk",
    USDPrice: data.bpi.USD.rate,
    GTQPrice: data.bpi.GTQ.rate,
    info:
      data.disclaimer +
      '\n Ver <a href="https://www.coindesk.com/" target="_blank">Coindesk</a>',
  };
  console.log("BTC VD: ", data.bpi.GTQ.rate);
  return obj;
};

export const call = async () => {
  const res = await Promise.all([
    getDollarValueBancoGuate(),
    getDollarValueByBinaceP2PType({ asset: "USDT", operation: "BUY" }),
    getDollarValueByBinaceP2PType({ asset: "USDT", operation: "SELL" }),
    getBitcoinValue(),
  ]);
  return res;
};

export const getLast30DaysOfDolarValueOfficialRecords = async (
  date: string
) => {
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
