# 🍽️ API Dieta

API desenvolvida em **Node.js** para **registro e acompanhamento de refeições de um usuário**, permitindo controle alimentar simples e eficiente.  
O projeto utiliza **Fastify**, **Knex**, **SQLite** e **Zod**, com foco em organização, validação de dados e boas práticas de desenvolvimento backend.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- Knex.js
- SQLite
- Zod
- Vitest
- Supertest
- TSX

---

## 📁 Estrutura do Projeto (exemplo)

```
src/
 ├── server.ts
 ├── routes/
 ├── controllers/
 ├── middlewares/
 ├── database/
 │   ├── migrations/
 │   └── knex.ts
 └── schemas/
```

---

## ⚙️ Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm ou pnpm

---

## 📦 Instalação

```bash
git clone <url-do-repositorio>
cd api-dieta
npm install
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
```

---

## 🗄️ Banco de Dados & Migrations

### Criar migration
```bash
npm run migrate:make nome_da_migration
```

### Executar migrations
```bash
npm run migrate
```

### Reverter migration
```bash
npm run migrate:rollback
```

---

## ▶️ Executando o Projeto

```bash
npm run dev
```

API disponível em:
```
http://localhost:3333
```

---

## 🧪 Testes

```bash
npm run test
```

---

## 📌 Funcionalidades

- Cadastro de usuários
- Registro de refeições
- Listagem de refeições
- Validação de dados
- Persistência em SQLite
- Autenticação via cookies

---

## 📚 Objetivo do Projeto

Projeto com foco em estudo e prática de backend moderno com Node.js, TypeScript e boas práticas de arquitetura.

---

## 🧑‍💻 Autor

Renan Andrade
