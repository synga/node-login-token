const express = require("express");
const config = require("../config/database");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");

/**
 * Demonstração de um POST de novo usuário
 */
router.post("/register", (req, res) => {
  // Pega o password digitado pelo usuário
  let pwd = req.body.password;

  // Vai criar um hash com a senha digitada
  let salt = getSalt(pwd.length);
  let hashed = sha512(pwd, salt);

  /**
   * Cria um novo usuário para ser salvo no DB.
   * O hash DEVE ser salvo pois será utilizado para comparação na hora do login.
   * A variavel hashed consiste em um objeto om duas propriedades: salt e passwordHash
   */
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed
  });

  // Salva um novo usuário
  newUser.save(err => {
    // Se deu erro ao salvar
    if (err) throw err;

    // Cria payload para ser utilizado na criação do token
    let payload = {
      email: req.body.email
    };

    /**
     * Cria um novo token para ser retornado ao usuário. Estou utilizando o modo assincrono, caso queira sincrono
     * basta remover o payload e atribuir a função a uma variavel pois ela retornará o token como string.
     *  Payload - Pode ser uma string e é usado para criar o token.
     *  Secret - Uma string que vai ser usada também no meio da criação do token. Não importa onde essa string esta declarada, desde que seja unica e... secreta.
     *  Options - Opções {objeto}, no meu caso estou utilizado uma propriedade expiresIn para dizer que o token deve espirar em 30 dias.
     *  Callback (assincrono) - Retorno da função, poderá ser o token ou um erro.
     */
    jwt.sign(
      payload,
      config.secret,
      {
        expiresIn: "30 days"
      },
      token => {
        // Retorna o token para ser salvo em algum localStorage e ser usado em consultas.
        res.json({
          token: token
        });
      },
      err => {
        // Tratar erro
      }
    );
  });
});

/**
 * Metodo de login.
 * Está com o metodo de busca do Mongoose apenas para demonstrar que ele
 * precisa pegar alguns dados do usuário para fazer o login.
 */
router.post("/login", (req, res) => {
  // Busca o usuário pelo e-mail para verifiar se ele existe
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      // Erro ao consultar DB
      if (err) throw err;

      if (!user) {
        // Tratar caso não existe usuário
      } else {
        /**
         * Vai pegar a senha digitada e fazer o hash para ser comparada com o hash salvo no banco.
         * Nesse caso não é feito o salt pois esse já existe, se fizer outro dá diferença e o login sairá errado.
         */
        let pwd = req.body.password;
        let hashed = sha512(pwd, user.password.salt);

        // Compara se os hashs são iguais. Se não forem retorna um erro, se forem iguais vai logar.
        if (hashed.passwordHash != user.password.passwordHash) {
          res.json({
            success: false,
            message: "Falhou ao logar. Usuário ou senha incorretos"
          });
        } else {
          // Payload para ser usado na criação do token.
          let payload = {
            email: user.email
          };

          // Cria o token
          let token = jwt.sign(payload, config.secret, {
            expiresIn: "30 days"
          });

          /**
           * !!! IMPORTANTE !!!
           * Caso queira retornar os dados do usuário para ele cuidado.
           * Como buscou o usuario no banco o objeto user está com o hash e o salt.
           * Ou crie um novo objeto sem a propriedade password.
           * Ou delete a propriedade password do retorno da consulta.
           * Ou simplesmente atriba nulo antes de retornar.
           */
          user.password = null;

          // Response pro usuário
          res.json({ user, token });
        }
      }
    }
  );
});

/**
 * Utiliza o crypto para criar um salt baseado no tamanho da senha. Salt deve ser uma string unica e ser salvo no usuário.
 * O salt é utilizado na conversão da senha para um hash.
 * @param {number} l - Uso o length da senha, mas já que o salt é criado apenas uma vez por usuário por mais segurança pode-se utilizar um numero randomico maior.
 */
let getSalt = l => {
  // Cria bytes ra
  return crypto
    .randomBytes(Math.ceil(l / 2))
    .toString("hex")
    .slice(0, l);
};
/**
 * Criptografa a senha que será retornada e salva no usuário em sua tabela/nó no banco para ser utilizad em metodos de login, metodos em que o usuário precisa estar logado e verificações se o token ainda é válido.
 * @param {string} password - Senha do usuário.
 * @param {string} salt - String criptografada baseada no tamanho senha.
 */
let sha512 = (password, salt) => {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let passwordHash = hash.digest("hex");
  return { salt, passwordHash };
};

module.exports = router;
