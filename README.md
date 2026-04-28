# Finance Dashboard API

Uma API moderna para gerenciamento financeiro, construída por **Alfredo Corrêa Lima Junior (@oalfredojr)** como parte dos estudos Full Stack.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** (ES Modules)
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação segura
- **bcrypt** - Hash de senhas
- **Clean Architecture** - Controllers, Use-Cases, Repositories, Helpers
- **ESLint + Prettier** - Code quality
- **Jest + Supertest** - Testes automatizados
- **Husky** - Git hooks
- **UUID** - IDs únicos
- **Validator** - Validações
- **Helmet + CORS** - Segurança

---

## 📁 Estrutura de Pastas

```
finance-dashboard-api/
│   index.js
│   package.json
│   .env
│   jest.config.js
│   babel.config.cjs
│   eslint.config.js
│   .prettierrc.json
│   .husky/
│
├── src/
│   ├── controllers/          # Camada de apresentação
│   │   ├── create-user.js
│   │   ├── login.js
│   │   ├── create-transaction.js
│   │   ├── get-transactions.js
│   │   ├── update-transaction.js
│   │   └── delete-transaction.js
│   │
│   ├── use-cases/            # Regras de negócio
│   │   ├── create-user.js
│   │   ├── login.js
│   │   ├── create-transaction.js
│   │   ├── get-transactions.js
│   │   ├── update-transaction.js
│   │   └── delete-transaction.js
│   │
│   ├── repositories/         # Camada de dados
│   │   └── postgres/
│   │       ├── create-user.js
│   │       ├── get-user-by-email.js
│   │       ├── create-transaction.js
│   │       ├── get-transactions.js
│   │       ├── update-transaction.js
│   │       └── delete-transaction.js
│   │
│   ├── routes/               # Definição de rotas
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── transactions.js
│   │
│   ├── middlewares/          # Middlewares
│   │   └── auth.js
│   │
│   ├── helpers/              # Utilitários
│   │   ├── http-helper.js
│   │   └── db-helper.js
│   │
│   ├── errors/               # Tratamento de erros
│   │   └── user.js
│   │
│   ├── db/                   # Configuração do banco
│   │   └── postgres/
│   │       ├── helper.js
│   │       └── migrations/
│   │
│   └── __tests__/            # Testes automatizados
│       ├── health.test.js
│       └── create-user.test.js
│
└── node_modules/
```

│ │ ├── helper.js
│ │ └── migrations/
│ │ ├── 01-init.sql
│ │ └── exec.js
│ │
│ ├── errors/
│ │ └── user.js
│ │
│ ├── helpers/
│ │ └── http-helper.js
│ │
│ └── routes/
│ └── users.js

````

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
````

---

## 📌 Funcionalidades da API

### Autenticação

- **POST /api/auth/register** - Registrar novo usuário
- **POST /api/auth/login** - Fazer login (retorna JWT token)

**Campos para login:**

- `email` (string)
- `password` (string)

**Resposta do login:**

```json
{
    "user": {
        "id": "uuid",
        "first_name": "string",
        "last_name": "string",
        "email": "string"
    },
    "token": "jwt-token"
}
```

**Como usar o token:**
Inclua no header das requisições: `Authorization: Bearer <token>`

### Usuários (Requer Autenticação)

- **GET /api/users/:userId** - Obter dados do usuário
- **PATCH /api/users/:userId** - Atualizar usuário

### Transações (Requer Autenticação)

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

### Dashboard (Requer Autenticação)

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

## � Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Usuários (Requer autenticação)

- `GET /api/users/:userId` - Obter dados do usuário
- `PATCH /api/users/:userId` - Atualizar dados do usuário

### Transações (Requer autenticação)

- `POST /api/transactions` - Criar nova transação
- `GET /api/transactions/user/:userId` - Listar transações do usuário
- `PATCH /api/transactions/:transactionId` - Atualizar transação
- `DELETE /api/transactions/:transactionId` - Deletar transação
- `GET /api/transactions/dashboard/:userId` - Obter resumo financeiro

### Sistema

- `GET /health` - Health check da aplicação

---

## 📝 Como Usar

### 1. Clonagem e Instalação

```bash
git clone <repository-url>
cd finance-dashboard-api
npm install
```

### 2. Configuração do Banco

```bash
# Criar banco PostgreSQL
createdb finance_dashboard

# Executar migrações
npm run migrations
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=finance_dashboard
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
```

### 4. Executar a Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

---

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run migrations` - Executa as migrações do banco de dados
- `npm run lint` - Executa o linter ESLint
- `npm run lint:fix` - Executa o linter e corrige problemas automaticamente
- `npm run format` - Formata o código com Prettier
- `npm test` - Executa os testes automatizados
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Executa os testes com relatório de cobertura

---

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (salt rounds: 10)
- Autenticação JWT com expiração
- Validação de entrada com validator
- Estrutura em camadas para separação de responsabilidades
- Helmet para headers de segurança
- CORS configurado
- Rate limiting pode ser implementado

---

## 🗄️ Banco de Dados

### Tabelas

- **users**: id, first_name, last_name, email, password_hash, created_at
- **transactions**: id, user_id, name, date, amount, type, created_at, updated_at

### Migrações

As migrações estão localizadas em `src/db/postgres/migrations/01-init.sql`

---

## 📈 Melhorias Futuras

- [ ] Implementar refresh tokens
- [ ] Adicionar testes de integração completos
- [ ] Implementar documentação com Swagger/OpenAPI
- [ ] Adicionar rate limiting
- [ ] Implementar logging estruturado (Winston)
- [ ] Adicionar cache (Redis)
- [ ] Implementar notificações por email
- [ ] Adicionar categorias personalizadas para transações
- [ ] Implementar filtros avançados
- [ ] Adicionar relatórios financeiros detalhados
- [ ] Implementar backup automático do banco
- [ ] Adicionar monitoramento (PM2, health checks)
- [ ] Implementar CI/CD
- [ ] Containerização com Docker
- [ ] Deploy na nuvem (Vercel, Railway, etc.)

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Alfredo Corrêa Lima Junior**

- GitHub: [@oalfredojr](https://github.com/oalfredojr)
- LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

---

_Projeto desenvolvido como parte dos estudos em desenvolvimento Full Stack._

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
