import express from "express";
import crypto from "crypto";

const app = express();

const API_KEY = process.env.BYBIT_KEY;
const API_SECRET = process.env.BYBIT_SECRET;

// Gebruik mainnet
const BASE_URL = "https://api.bybit.com";

// Als Railway blijft blokkeren, gebruik tijdelijk testnet
// const BASE_URL = "https://api-testnet.bybit.com";

app.get("/", (req, res) => {
  res.send("Backend werkt");
});

app.get("/positions", async (req, res) => {
  try {
    if (!API_KEY || !API_SECRET) {
      return res.json({
        error: "BYBIT_KEY of BYBIT_SECRET ontbreekt in Railway Variables"
      });
    }

    const timestamp = Date.now().toString();
    const recvWindow = "5000";
    const query = "category=linear&settleCoin=USDT";

    const payload = timestamp + API_KEY + recvWindow + query;

    const signature = crypto
      .createHmac("sha256", API_SECRET)
      .update(payload)
      .digest("hex");

    const url = `${BASE_URL}/v5/position/list?${query}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-BAPI-API-KEY": API_KEY,
        "X-BAPI-SIGN": signature,
        "X-BAPI-TIMESTAMP": timestamp,
        "X-BAPI-RECV-WINDOW": recvWindow,
        "Content-Type": "application/json"
      }
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.json({
        error: "Bybit response is geen geldige JSON",
        raw: text
      });
    }
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server draait");
});
