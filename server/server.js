require("dotenv").config();

const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.status(200).send("Route Working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running..."));
