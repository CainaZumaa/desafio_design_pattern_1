import { AlertStrategy } from "./AlertStrategy";
import { CryptoPrice } from "../types/Config";

export class ThresholdStrategy implements AlertStrategy {
  constructor(private buyThreshold: number, private sellThreshold: number) {}

  checkAlert(currentPrice: CryptoPrice): boolean {
    const buyAlert =
      this.buyThreshold > 0 && currentPrice.price <= this.buyThreshold;
    const sellAlert = currentPrice.price >= this.sellThreshold;

    return buyAlert || sellAlert;
  }

  getAlertMessage(currentPrice: CryptoPrice): string {
    if (this.buyThreshold > 0 && currentPrice.price <= this.buyThreshold) {
      return `🟢 BUY ALERT: ${
        currentPrice.name
      } is at $${currentPrice.price.toFixed(
        2
      )} (below buy threshold $${this.buyThreshold.toLocaleString()})`;
    }

    if (currentPrice.price >= this.sellThreshold) {
      return `🚨 THRESHOLD ALERT: ${
        currentPrice.name
      } exceeded $${this.sellThreshold.toLocaleString()}! Current price: $${currentPrice.price.toFixed(
        2
      )}`;
    }

    return "";
  }
}
