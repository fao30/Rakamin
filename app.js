const express = require("express");
const routers = require("./routers");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routers);

module.exports = app;
