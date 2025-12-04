# Finance Dashboard API

Uma API moderna para gerenciamento financeiro, construída por **Alfredo Corrêa Lima Junior (@oalfredojr)** como parte dos estudos Full Stack.

---

## 🚀 Tecnologias Utilizadas

* **Node.js**
* **Express**
* **Prisma ORM**
* **SQLite / PostgreSQL** (dependendo do ambiente)
* **Clean Architecture** (Controllers, Use-Cases, Helpers)
* **ES Modules**

---

## 📁 Estrutura de Pastas

```
finance-dashboard-api/
│   package.json
│   prisma/schema.prisma
│   server.js
│
├── controllers/
│   └── create-user-controller.js
│
├── use-cases/
│   └── create-user.js
│
├── helpers/
│   └── http-helpers.js
│
└── config/
    └── env.js
```

---

## 📌 Objetivo da API

O sistema permite:

* Criar usuários
* Validar requisições
* Tratar erros de forma padronizada
* Preparar base para controle financeiro (transações futuras)

---

## 🔧 Instalação

```bash
git clone https://github.com/oalfredojr/finance-dashboard-api.git
cd finance-dashboard-api
npm install
```

---

## 🗃 Configuração do Banco

Gerar o banco e o cliente Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## ▶ Executar o Servidor

```bash
npm run dev
```

Servidor padrão em:

```
http://localhost:3333
```

---

## 📬 Endpoints Disponíveis

### ➤ Criar Usuário

**POST /users**

```json
{
  "first_name": "Alfredo",
  "last_name": "Junior",
  "email": "teste@example.com",
  "password": "123456"
}
```

### ✔ Possíveis respostas:

* `201 Created` → Usuário criado
* `400 Bad Request` → Dados faltando ou inválidos
* `500 Internal Server Error` → Erro inesperado

---

## 🧱 Padrão de Respostas (Helpers)

Você criou helpers profissionais para padronizar o retorno:

* `badRequest()` → 400
* `created()` → 201
* `serverError()` → 500

---

## 💡 Próximos Passos Sugeridos

* [ ] Criar autenticação (JWT)
* [ ] Criar gerenciamento de transações financeiras
* [ ] Saldo calculado automaticamente
* [ ] Criar testes automatizados
* [ ] Deploy no Railway / Render

---

## 👨‍💻 Autor

**Alfredo Corrêa Lima Junior (@prazerjuba | @oalfredojr)**

Desenvolvedor Full Stack em evolução 🔥

---

Se quiser, posso atualizar o README conforme você evoluir o projeto!
