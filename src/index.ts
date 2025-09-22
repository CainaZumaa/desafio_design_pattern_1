import { CryptoMonitor } from "./CryptoMonitor";

async function main() {
  try {
    const monitor = new CryptoMonitor();
    await monitor.start();
  } catch (error) {
    console.error("❌ Application error:", error);
    process.exit(1);
  }
}

main();
