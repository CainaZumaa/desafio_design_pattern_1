import { AlertStrategy } from "../strategies/AlertStrategy";
import { ThresholdStrategy } from "../strategies/ThresholdStrategy";
import { VariationStrategy } from "../strategies/VariationStrategy";
import { Config } from "../types/Config";

export class AlertStrategyFactory {
  static createStrategies(config: Config): AlertStrategy[] {
    const strategies: AlertStrategy[] = [];

    strategies.push(
      new ThresholdStrategy(
        config.alertStrategies.threshold.buyThreshold,
        config.alertStrategies.threshold.sellThreshold
      )
    );

    strategies.push(
      new VariationStrategy(
        config.alertStrategies.variation.percentageThreshold,
        config.alertStrategies.variation.timeWindowMinutes
      )
    );

    return strategies;
  }
}
