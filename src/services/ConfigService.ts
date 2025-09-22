import * as fs from "fs";
import * as path from "path";
import { Config } from "../types/Config";

export class ConfigService {
  private static instance: ConfigService;
  private config!: Config;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): void {
    try {
      const configPath = path.join(process.cwd(), "config.json");
      const configData = fs.readFileSync(configPath, "utf8");
      this.config = JSON.parse(configData);
    } catch (error) {
      throw new Error(`Failed to load config: ${error}`);
    }
  }

  public getConfig(): Config {
    return this.config;
  }
}
