import axios from "axios";
import { readJson, writeJson } from "../lib/storage";
import type { MarketsPayload } from "../types/app";

const CACHE_KEY = "cache:markets";

export async function getMarkets(): Promise<MarketsPayload> {
  try {
    const [usdEgpResponse, eurUsdResponse, cryptoResponse] = await Promise.all([
      axios.get("https://api.frankfurter.dev/v1/latest", {
        params: { base: "USD", symbols: "EGP" },
        timeout: 15000,
      }),
      axios.get("https://api.frankfurter.dev/v1/latest", {
        params: { base: "EUR", symbols: "USD" },
        timeout: 15000,
      }),
      axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "bitcoin,ethereum",
          vs_currencies: "usd",
          include_24hr_change: true,
        },
        timeout: 20000,
      }),
    ]);

    const btc = cryptoResponse.data?.bitcoin ?? {};
    const eth = cryptoResponse.data?.ethereum ?? {};

    const payload: MarketsPayload = {
      items: [
        {
          id: "usd-egp",
          label: "USD / EGP",
          value: usdEgpResponse.data?.rates?.EGP ?? 0,
          unit: "EGP",
        },
        {
          id: "eur-usd",
          label: "EUR / USD",
          value: eurUsdResponse.data?.rates?.USD ?? 0,
          unit: "USD",
        },
        {
          id: "btc-usd",
          label: "Bitcoin",
          value: btc.usd ?? 0,
          unit: "USD",
          change24h: btc.usd_24h_change ?? null,
        },
        {
          id: "eth-usd",
          label: "Ethereum",
          value: eth.usd ?? 0,
          unit: "USD",
          change24h: eth.usd_24h_change ?? null,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    await writeJson(CACHE_KEY, payload);
    return payload;
  } catch {
    const cached = await readJson<MarketsPayload>(CACHE_KEY);
    if (cached) return cached;
    throw new Error("Unable to load markets data.");
  }
}