const axios = require("axios");
require("dotenv").config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const serverAxiosHS = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const baseApiCnpj = axios.create({
  baseURL: "https://brasilapi.com.br/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = { serverAxiosHS, baseApiCnpj };
