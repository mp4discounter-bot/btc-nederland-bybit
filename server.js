import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";

const app = express();

const API_KEY = process.env.BYBIT_KEY;
const API_SECRET = process.env.BYBIT_SECRET;

function sign(query) {
  return crypto
    .createHmac("sha256", API_SECRET)
    .update(query)
    .digest("hex");
}

app.get("/", (req, res) => {
  res.send("Backend werkt");
});

app.get("/positions", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `api_key=${API_KEY}&timestamp=${timestamp}`;
    const signature = sign(query);

    const url = `https://api.bybit.com/v5/position/list?${query}&sign=${signature}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
