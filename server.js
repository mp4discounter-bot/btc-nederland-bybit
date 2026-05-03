import express from "express";
import crypto from "crypto";

const app = express();

const API_KEY = process.env.BYBIT_KEY;
const API_SECRET = process.env.BYBIT_SECRET;

app.get("/", (req, res) => {
  res.send("Backend werkt");
});

app.get("/positions", async (req, res) => {
  try {
    const timestamp = Date.now().toString();
    const recvWindow = "5000";
    const query = "category=linear&settleCoin=USDT";

    const payload = timestamp + API_KEY + recvWindow + query;

    const sign = crypto
      .createHmac("sha256", API_SECRET)
      .update(payload)
      .digest("hex");

   const url = "https://api.bybit.com/v5/market/tickers?category=linear";

    const response = await fetch(url, {
      headers: {
        "X-BAPI-API-KEY": API_KEY,
        "X-BAPI-SIGN": sign,
        "X-BAPI-TIMESTAMP": timestamp,
        "X-BAPI-RECV-WINDOW": recvWindow
      }
    });

    const text = await response.text();

try {
  const data = JSON.parse(text);
  res.json(data);
} catch (e) {
  res.json({
    error: "Bybit response is geen geldige JSON",
    raw: text
  });
}

  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server draait");
});
