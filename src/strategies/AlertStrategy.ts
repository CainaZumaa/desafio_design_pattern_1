import { CryptoPrice } from "../types/Config";

export interface AlertStrategy {
  checkAlert(currentPrice: CryptoPrice, previousPrice?: CryptoPrice): boolean;
  getAlertMessage(
    currentPrice: CryptoPrice,
    previousPrice?: CryptoPrice
  ): string;
}
