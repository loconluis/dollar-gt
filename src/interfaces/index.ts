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
