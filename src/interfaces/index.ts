type operationBinance = "BUY" | "SELL";
type assetOption = "DAI" | "USDT";

export interface IBinanceP2PReq {
  operation: operationBinance;
  asset: assetOption;
}

export interface IDataResponse {
  platform: string;
  dollarValue: string;
  currencyFiat?: string;
  info: string;
  operation?: string;
}

export interface IBinanceP2PRespone {
  adv: {
    price: string;
    minSingleTransAmount?: string;
    maxSingleTransAmount?: string;
    fiatSymbol: string;
  };
  advertiser: {
    nickName: string;
    positiveRate?: number;
  };
}

interface HistoricObject {
  moneda?: { content: string };
  fecha: { content: string };
  compra: { content: string };
  venta: { content: string };
}

export interface FormattedHistoricObject {
  fecha: string;
  precio: string;
}

export interface ResponseData30DayRangeBancoGuatemala {
  Var: {
    children: [
      Pick<HistoricObject, "moneda">,
      Pick<HistoricObject, "fecha">,
      Pick<HistoricObject, "venta">,
      Pick<HistoricObject, "compra">,
    ];
  };
}

export interface IExchange {
  name: string;
  buy: number;
  sell: number;
  variation: string;
  is_online: boolean;
}
