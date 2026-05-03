app.get("/positions", async (req, res) => {
  try {
    const response = await axios.get("https://api.bybit.com/v5/position/list");

    console.log("BYBIT RESPONSE:");
    console.log(response.data);

    res.json(response.data);
  } catch (err) {
    console.log("ERROR:");
    console.log(err.response?.data || err.message);

    res.json({ error: err.response?.data || err.message });
  }
});
