# Criação e utilização básica de Webtoken para login em uma API Node.JS

Essa aplicação básica constitue de uma criação de webtokens JSON (JWT) para autenticação de usuário na hora de utilizar a aplicação.
É utilizado Express para configurar a API, a biblioteca [Crypto](https://nodejs.org/api/crypto.html) do Node (verificar disponibilidade de versão) para criptografar a senha, MongoDB para salvar a senha criptografada (pode ser qualquer DB) e [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) para manipulação e criação do token.

## Dependencias:

```
    "body-parser": "^1.18.2",
    "express": "^4.15.3",
    "jsonwebtoken": "^8.1.1",
    "mongoose": "^5.0.1"
```

## Arquitetura dos diretórios:

```
server.js : Arquivo principal
|_ server
   |_ config
      |_ database.js : Arquivo de configuração do DB. No meu caso também contém o secret para uso do webtoken
   |_ models
      |_ user.js : Modelo do Mongoose para usuário. 
   |_ routes
      |_ api.js : Router principal da API que redireciona para outras routes e também verifica validação do token.
      |_ auth.js : Arquivo que manipula autenticação e criação de token (Login e Registro).
```

## Dúvidas.

Qualquer duvida referente a uma expicação melhor e mais detalhada sobre como funciona o que foi feito favor verificar os links na descrição do projeto feira acima.
