<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descrição

API de Gerenciamento de Livros e Avaliações

- 📚 CRUD completo de livros (título, autor, descrição, ano)
- ⭐ Sistema de avaliações (1-5 estrelas + comentários)
- 🔐 Autenticação JWT (cadastro/login de usuários)
- 📊 Documentação Swagger/OpenAPI integrada

## Como rodar o projeto

```bash
git clone https://github.com/henriquecesarjr/desafio-salaryfits
```

Antes de rodar o projeto, você deve criar um banco de dados chamado mydatabase em algum gerenciador que use o MySQL, e após isso deve ajustar as variáveis de ambiente no arquivo `.env` para fazer a conexão corretamente. Após isso, siga as instruções abaixo.

```bash
$ npm install
$ npx prisma migrate dev
$ npm run start
```
Após seguir essas instruções, o servidor estará executando localmente, e você poderá utilizar as funcionalidades.

## Como executar os testes

```bash
$ npm run test
```

## Como acessar a documentação da API no Swagger

```bash
localhost:3000/docs
```

Feito por <a href="https://www.linkedin.com/in/henriquejrmarques/">Henrique Marques</a>
