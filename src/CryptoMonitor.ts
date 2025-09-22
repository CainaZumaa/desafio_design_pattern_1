import { CryptoApiService } from "./services/CryptoApiService";
import { ConfigService } from "./services/ConfigService";
import { AlertStrategyFactory } from "./factories/AlertStrategyFactory";
import { AlertStrategy } from "./strategies/AlertStrategy";
import { CryptoPrice } from "./types/Config";
import * as readline from "readline";

export class CryptoMonitor {
  private apiService: CryptoApiService;
  private configService: ConfigService;
  private alertStrategies: AlertStrategy[];
  private rl: readline.Interface;

  constructor() {
    this.configService = ConfigService.getInstance();
    const config = this.configService.getConfig();

    this.apiService = CryptoApiService.getInstance(config.apiKey);
    this.alertStrategies = AlertStrategyFactory.createStrategies(config);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start(): Promise<void> {
    console.log("🚀 Crypto Monitor Started");
    console.log('Type "sair" to exit, or press Enter to continue monitoring\n');

    const config = this.configService.getConfig();
    let currentCurrency = config.defaultCurrency;
    let previousPrice: CryptoPrice | null = null;

    while (true) {
      try {
        const userInput = await this.getUserInput(
          `Enter cryptocurrency symbol (current: ${currentCurrency}): `
        );

        if (userInput.toLowerCase() === "sair") {
          break;
        }

        if (userInput.trim()) {
          currentCurrency = userInput.trim();
          previousPrice = null; // Reseta o preço anterior quando muda a criptomoeda
        }

        await this.monitorPrice(currentCurrency, previousPrice);
        previousPrice = await this.apiService.getCryptoPrice(currentCurrency);

        await this.delay(3000); // Reduzido o delay para mais atualizações frequentes
      } catch (error) {
        console.error(`❌ Error: ${error}`);
        await this.delay(2000);
      }
    }

    this.rl.close();
    console.log("👋 Crypto Monitor stopped");
  }

  private async getUserInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  private async monitorPrice(
    symbol: string,
    previousPrice?: CryptoPrice | null
  ): Promise<void> {
    try {
      const priceData = await this.apiService.getCryptoPrice(symbol);

      console.log(
        `\n💰 ${priceData.name} (${
          priceData.symbol
        }): $${priceData.price.toFixed(2)}`
      );
      console.log(`⏰ ${priceData.timestamp.toLocaleTimeString()}`);

      // Mostra o preço de mudança se tivermos um preço anterior
      if (previousPrice) {
        const change = priceData.price - previousPrice.price;
        const changePercent = (change / previousPrice.price) * 100;
        const changeSymbol = change >= 0 ? "📈" : "📉";
        const changeColor = change >= 0 ? "🟢" : "🔴";

        console.log(
          `${changeColor} ${changeSymbol} Change: $${change.toFixed(
            2
          )} (${changePercent.toFixed(2)}%)`
        );
      }

      this.checkAlerts(priceData);
    } catch (error) {
      console.error(`❌ Failed to get price for ${symbol}: ${error}`);
    }
  }

  private checkAlerts(currentPrice: CryptoPrice): void {
    for (const strategy of this.alertStrategies) {
      if (strategy.checkAlert(currentPrice)) {
        const message = strategy.getAlertMessage(currentPrice);
        console.log(`\n🚨 ${message}\n`);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
