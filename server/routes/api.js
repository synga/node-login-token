// Dependencias
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Rotas da API
const auth = require("./auth");

/**
 * Bateu na raiz
 */
router.get("/", (req, res) => {
  res.send("API Funciona");
});

/**
 * Declara uso da rota /auth
 */
router.use("/auth", auth);

/**
 * Middleware para checar se o token não esta expirado.
 * Qualquer router.use() declarado abaixo desse middleware terá que primeiro passar pela verificação do token, por tanto
 * abaixo desse metodo utilize apenas rotas em que o usuário precise estar autenticado para prosseguir.
 */
router.use((req, res, next) => {
  // Busca o token seja no body da requisição, na query da URL ou no header da requisição.
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  // Se o token existe
  if (token) {
    // Verifica utilizando o token e o secret se ele é um token válido
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Falhou ao autenticar o token.'
        });
      } else {
        /**
         * Se o token está dentro da validade, ou seja, a data de expiração dele é maior que a data atual,
         * vai para a próxima execução após o middleware.
         * decoded.iat - unix timestamp do tempo atual.
         * decoded.exp - unix timestamp da expiração do token.
         */
        if (decoded.iat <= decoded.exp) {
          next();
        } else {
          return res.status(403).send({
            success: false,
            message: "Token espirou."
          });
        }
      }
    });
  } else {
    // Tratar a falta de token
  };
});

module.exports = router;
