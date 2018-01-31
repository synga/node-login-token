// Pega dependencias
const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./server/config/database');

// Pega rotas da API
const api = require("./server/routes/api");

// inicializa o express
const app = express();

// CONECTA AO DB
mongoose.connect(config.database);

// Parser dos dados
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Seta as rotas da API
app.use("/api", api);

/**
 * Pega porta do ambiente e seta ela no Express
 */
const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Cria server HTTP
 */
const server = http.createServer(app);

/**
 * Listen na porta configurada
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
