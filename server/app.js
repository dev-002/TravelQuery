const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Path: ${req.path}`);
  next();
});

// Routes
const Routes = require("./routes/route");

app.use((req, res, next) => {
  console.log(`Path: ${req.path}`);
  next();
});

app.get("/test", (req, res) => {
  res.status(200).send("Route Working");
});
app.use("/api/v1", Routes);

module.exports = app;
