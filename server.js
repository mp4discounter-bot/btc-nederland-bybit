import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend werkt");
});

app.get("/positions", async (req, res) => {
  res.json({
    status: "ok",
    message: "Positions route werkt"
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server draait");
});
