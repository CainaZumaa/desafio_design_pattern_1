import axios from "axios";
import { CryptoPrice } from "../types/Config";

export class CryptoApiService {
  private static instance: CryptoApiService;
  private readonly baseUrl = "https://pro-api.coinmarketcap.com/v1";
  private readonly apiKey: string;

  private constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public static getInstance(apiKey?: string): CryptoApiService {
    if (!CryptoApiService.instance) {
      if (!apiKey) {
        throw new Error("API key is required for first initialization");
      }
      CryptoApiService.instance = new CryptoApiService(apiKey);
    }
    return CryptoApiService.instance;
  }

  private getCommonMappings(): { [key: string]: string } {
    return {
      bitcoin: "BTC",
      ethereum: "ETH",
      solana: "SOL",
      dogecoin: "DOGE",
      cardano: "ADA",
      polkadot: "DOT",
      chainlink: "LINK",
      litecoin: "LTC",
      "binance coin": "BNB",
      avalanche: "AVAX",
    };
  }

  async getCryptoPrice(symbol: string): Promise<CryptoPrice> {
    try {
      // Mapeia os nomes comuns para símbolos
      const mappings = this.getCommonMappings();
      const searchTerm = mappings[symbol.toLowerCase()] || symbol;

      // Usa o endpoint de listagem como mostrado na documentação
      const response = await axios.get(
        `${this.baseUrl}/cryptocurrency/listings/latest`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            start: 1,
            limit: 100,
            convert: "USD",
          },
        }
      );

      const data = response.data.data;
      if (!data || data.length === 0) {
        throw new Error(`No cryptocurrency data found`);
      }

      // Encontra a criptomoeda por símbolo ou nome
      const crypto = data.find((item: any) => {
        const symbolMatch =
          item.symbol.toUpperCase() === searchTerm.toUpperCase();
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return symbolMatch || nameMatch;
      });

      if (!crypto) {
        throw new Error(
          `Cryptocurrency ${symbol} not found. Try using the symbol instead (e.g., BTC for Bitcoin)`
        );
      }

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.quote.USD.price,
        timestamp: new Date(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(`Invalid API key. Please check your config.json`);
        }
        if (error.response?.status === 429) {
          throw new Error(
            `API rate limit exceeded. Please wait before trying again.`
          );
        }
        throw new Error(
          `API Error: ${
            error.response?.data?.status?.error_message || error.message
          }`
        );
      }
      throw new Error(`Failed to fetch price for ${symbol}: ${error}`);
    }
  }

  async getCryptoId(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/cryptocurrency/map`, {
        headers: {
          "X-CMC_PRO_API_KEY": this.apiKey,
        },
        params: {
          symbol: symbol.toUpperCase(),
        },
      });

      const data = response.data.data;
      if (!data || data.length === 0) {
        throw new Error(`Cryptocurrency ${symbol} not found`);
      }

      return data[0].id;
    } catch (error) {
      throw new Error(`Failed to get ID for ${symbol}: ${error}`);
    }
  }
}
