import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend werkt");
});

app.get("/positions", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 3000);
