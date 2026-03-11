import axios from "axios";

export async function getMarkets() {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "bitcoin",
        vs_currencies: "usd"
      }
    }
  );

  return res.data;
}