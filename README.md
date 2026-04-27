# Finance Dashboard API

Uma API moderna para gerenciamento financeiro, construída por **Alfredo Corrêa Lima Junior (@oalfredojr)** como parte dos estudos Full Stack.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **PostgreSQL**
- **Clean Architecture** (Controllers, Use-Cases, Repositories, Helpers)
- **ES Modules**
- **bcrypt** para hash de senhas
- **UUID** para IDs únicos
- **Validator** para validações

---

## 📁 Estrutura de Pastas

```
finance-dashboard-api/
│   index.js
│   package.json
│   .env
│   .eslintrc.json
│   .prettierrc.json
│
├── src/
│   ├── controllers/
│   │   ├── create-user.js
│   │   ├── get-user-by-id.js
│   │   └── update-user.js
│   │
│   ├── use-cases/
│   │   ├── create-user.js
│   │   ├── get-user-by-id.js
│   │   └── update-user.js
│   │
│   ├── repositories/
│   │   └── postgres/
│   │       ├── create-user.js
│   │       ├── get-user-by-email.js
│   │       ├── get-user-by-id.js
│   │       └── update-user.js
│   │
│   ├── db/
│   │   └── postgres/
│   │       ├── helper.js
│   │       └── migrations/
│   │           ├── 01-init.sql
│   │           └── exec.js
│   │
│   ├── errors/
│   │   └── user.js
│   │
│   ├── helpers/
│   │   └── http-helper.js
│   │
│   └── routes/
│       └── users.js
```

---

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

---

## 🛠️ Instalação e Configuração

1. **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd finance-dashboard-api
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```

3. **Configure o banco de dados PostgreSQL:**
    - Crie um banco de dados chamado `financeapp`
    - Configure as variáveis de ambiente no arquivo `.env` (veja exemplo abaixo)

4. **Execute as migrações:**

    ```bash
    npm run migrations
    ```

5. **Inicie o servidor:**
    ```bash
    npm run dev
    ```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=8080
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
POSTGRES_DB=financeapp
```

---

## 📌 Funcionalidades da API

### Usuários

- **POST /api/users** - Criar um novo usuário
- **GET /api/users/:userId** - Obter usuário por ID
- **PATCH /api/users/:userId** - Atualizar usuário

**Campos obrigatórios para criação:**

- `first_name` (string)
- `last_name` (string)
- `email` (string, formato válido)
- `password` (string, mínimo 6 caracteres)

### Transações

- **POST /api/transactions** - Criar uma nova transação
- **GET /api/transactions/user/:userId** - Listar transações do usuário
- **PATCH /api/transactions/:transactionId** - Atualizar transação
- **DELETE /api/transactions/:transactionId** - Deletar transação

**Campos obrigatórios para criação de transação:**

- `user_id` (UUID)
- `name` (string)
- `date` (string, formato ISO 8601)
- `amount` (number, positivo)
- `type` (string: "EARNING", "EXPENSE", "INVESTMENT")

**Filtros disponíveis para listagem:**

- `type` - Filtrar por tipo (EARNING, EXPENSE, INVESTMENT)
- `month` e `year` - Filtrar por mês/ano
- `limit` - Limitar número de resultados (1-100)

### Dashboard

- **GET /api/transactions/dashboard/:userId** - Resumo financeiro do usuário

**Filtros disponíveis:**

- `month` e `year` - Filtrar resumo por mês/ano

**Resposta inclui:**

- `balance` - Saldo total (ganhos - gastos - investimentos)
- `totals` - Totais por tipo (EARNING, EXPENSE, INVESTMENT)
- `categories` - Quebra por categoria (top 10)

---

## 🧪 Testes

Para executar os testes (quando implementados):

```bash
npm test
```

---

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run migrations` - Executa as migrações do banco de dados
- `npm run postinstall` - Configura hooks do Husky

---

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Validação de entrada com validator
- Estrutura em camadas para separação de responsabilidades

---

## 📈 Melhorias Futuras

- Implementar autenticação JWT
- Adicionar testes unitários e de integração
- Implementar funcionalidades de transações financeiras
- Adicionar documentação com Swagger
- Implementar rate limiting e CORS
- Adicionar logging estruturado

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

- `201 Created` → Usuário criado
- `400 Bad Request` → Dados faltando ou inválidos
- `500 Internal Server Error` → Erro inesperado

---

## 🧱 Padrão de Respostas (Helpers)

Você criou helpers profissionais para padronizar o retorno:

- `badRequest()` → 400
- `created()` → 201
- `serverError()` → 500

---

## 💡 Próximos Passos Sugeridos

- [ ] Criar autenticação (JWT)
- [ ] Criar gerenciamento de transações financeiras
- [ ] Saldo calculado automaticamente
- [ ] Criar testes automatizados
- [ ] Deploy no Railway / Render

---

## 👨‍💻 Autor

**Alfredo Corrêa Lima Junior (@prazerjuba | @oalfredojr)**

Desenvolvedor Full Stack em evolução 🔥

---

Se quiser, posso atualizar o README conforme você evoluir o projeto!
