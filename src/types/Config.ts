export interface Config {
  defaultCurrency: string;
  apiKey: string;
  alertStrategies: {
    threshold: {
      buyThreshold: number;
      sellThreshold: number;
    };
    variation: {
      percentageThreshold: number;
      timeWindowMinutes: number;
    };
  };
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  timestamp: Date;
}
