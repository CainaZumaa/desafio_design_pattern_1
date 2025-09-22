import { AlertStrategy } from "./AlertStrategy";
import { CryptoPrice } from "../types/Config";

export class VariationStrategy implements AlertStrategy {
  private priceHistory: Map<string, { price: number; timestamp: Date }[]> =
    new Map();

  constructor(
    private percentageThreshold: number,
    private timeWindowMinutes: number
  ) {}

  checkAlert(currentPrice: CryptoPrice): boolean {
    const symbol = currentPrice.symbol;
    const now = new Date();
    const timeWindowMs = this.timeWindowMinutes * 60 * 1000;

    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }

    const history = this.priceHistory.get(symbol)!;

    history.push({ price: currentPrice.price, timestamp: now });

    const cutoffTime = new Date(now.getTime() - timeWindowMs);
    const recentPrices = history.filter(
      (entry) => entry.timestamp >= cutoffTime
    );

    this.priceHistory.set(symbol, recentPrices);

    if (recentPrices.length < 2) {
      return false;
    }

    const oldestPrice = recentPrices[0].price;
    const variation =
      Math.abs((currentPrice.price - oldestPrice) / oldestPrice) * 100;

    return variation >= this.percentageThreshold;
  }

  getAlertMessage(currentPrice: CryptoPrice): string {
    const symbol = currentPrice.symbol;
    const history = this.priceHistory.get(symbol);

    if (!history || history.length < 2) {
      return "";
    }

    const oldestPrice = history[0].price;
    const variation = ((currentPrice.price - oldestPrice) / oldestPrice) * 100;
    const direction = variation > 0 ? "📈" : "📉";

    return `${direction} VARIATION ALERT: ${
      currentPrice.name
    } changed ${Math.abs(variation).toFixed(2)}% in ${
      this.timeWindowMinutes
    } minutes ($${oldestPrice.toFixed(2)} → $${currentPrice.price.toFixed(2)})`;
  }
}
