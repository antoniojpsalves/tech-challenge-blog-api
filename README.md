# 🎓 Tech Challenge - Fase 2: Blog Educacional

**Pós Tech - Full Stack Development**

## 📝 Descrição do Projeto

Este projeto consiste na refatoração do Back-end de uma plataforma de blogging voltada para professores da rede pública. A aplicação visa centralizar a transmissão de conhecimento de forma prática e tecnológica, utilizando uma arquitetura escalável e moderna.

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js
- **Framework:** NestJS com Fastify
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Validação:** Zod
- **Documentação:** Swagger (OpenAPI)
- **Infraestrutura:** Docker & Docker Compose

---

## 🚀 Task List de Desenvolvimento

### 1. Setup Inicial & Infraestrutura

- [x] Inicializar projeto NestJS.
- [x] Configurar Adapter Fastify.
- [x] Configurar Swagger para documentação da API.
- [x] Criar `docker-compose.yml` para PostgreSQL.
- [x] Configurar Prisma ORM e conexão com banco.

### 2. Desenvolvimento de Recursos (Posts)

- [x] Criar Módulo de Posts (Controller, Service, Module).
- [x] Implementar `GET /posts` (Listagem geral).
- [x] Implementar `GET /posts/:id` (Leitura de post específico).
- [x] Implementar `GET /posts/search` (Busca por palavras-chave).
- [x] Implementar `POST /posts` (Criação com validação Zod).
- [x] Implementar `PATCH /posts/:id` (Edição de postagem).
- [x] Implementar `DELETE /posts/:id` (Exclusão de postagem).

### 3. Segurança & Validação

- [x] Criação do módulo de usuários com cadastro e hash de senhas via bcrypt.
- [x] Implementação do fluxo de login no AuthModule com geração de token JWT.
- [x] Configuração do JwtStrategy e JwtAuthGuard para proteção das rotas.
- [x] Criação do RolesGuard para restringir operações de escrita (POST, PATCH, DELETE) em posts apenas para a role 'PROFESSOR'.
- [x] Atualização do PostsService para vincular automaticamente o 'authorId' com base no usuário autenticado no token.
- [x] Correção de tipagem nos DTOs do Zod para exibição correta no Swagger UI.
- [x] Refatoração do JwtModule para 'registerAsync', garantindo a leitura segura do JWT_SECRET via variáveis de ambiente.

### 4. Fase 4 — Ajustes para o Mobile

- [x] Proteger `POST /users`, `GET /users` e `GET /users/:id` com JWT + `RolesGuard('PROFESSOR')`.
- [x] Filtro `?role=PROFESSOR|ALUNO` em `GET /users`.
- [x] Implementar `PATCH /users/:id` (edição, com re-hash de senha e checagem de e-mail duplicado).
- [x] Implementar `DELETE /users/:id` (bloqueia com 409 se houver posts vinculados).
- [x] Paginação server-side (`{ data, meta }`) em `GET /posts`, `GET /posts/search` e `GET /users`.
- [x] Seed do primeiro professor (`npm run seed`).
- [x] Atualizar Swagger e README com o contrato final.

### 5. Qualidade & Entrega

- [x] Implementar testes unitários.

- [x] Configurar GitHub Actions (CI/CD).

- [x] Finalizar documentação técnica e guia de uso.

- [x] Gravar vídeo de demonstração.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/)

---

## 🚀 Como executar o projeto localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/antoniojpsalves/tech-challenge-blog-api.git
cd tech-challenge-blog-api
```

**2. Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto e configure suas variáveis:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_posttech_db?schema=public"
JWT_SECRET="minha-chave-secreta-super-segura"
PORT=3000
```

**3. Suba o Banco de Dados com Docker:**

```bash
docker compose up -d
```

**4. Instale as dependências:**

```bash
npm install
```

**5. Execute as Migrations do Prisma:**
Isso criará as tabelas no seu banco de dados PostgreSQL.

```bash
npx prisma migrate dev
```

**5.1. Rode o Seed (cria o primeiro Professor):**
Como as rotas de usuário exigem autenticação de um PROFESSOR, é preciso um usuário inicial para começar a usar a API.

```bash
npm run seed
```

Credenciais padrão criadas pelo seed (podem ser sobrescritas via `SEED_PROFESSOR_EMAIL`, `SEED_PROFESSOR_PASSWORD` e `SEED_PROFESSOR_NAME` no `.env`):

```
email: professor@fiap.com
senha: professor123
```

**6. Inicie o Servidor (Modo Desenvolvimento):**

```bash
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`.

---

## 📚 Documentação da API (Swagger)

A API está totalmente documentada pelo Swagger. Com o servidor rodando, acesse:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 🧪 Como rodar os Testes

Para executar a suíte de testes unitários desenvolvida em Jest:

```bash

# Executar todos os testes
npm run test
```

---

## 🔐 Fluxo de Autenticação e Perfis

- **ALUNO:** Papel padrão. Pode fazer login, listar posts (`GET /posts`) e buscar posts (`GET /posts/search`). Não tem acesso a rotas de escrita.
- **PROFESSOR:** Pode listar e gerenciar posts (`POST`, `PATCH`, `DELETE`) e gerenciar usuários (`POST`, `GET`, `PATCH`, `DELETE /users`).

**Passo a passo para testar:**

1. Rode o seed (`npm run seed`) para ter um PROFESSOR inicial, ou peça a um PROFESSOR já existente para criar seu usuário via `POST /users`.
2. Faça login na rota `POST /auth/login` para receber seu `access_token`.
3. No Swagger, clique no botão **"Authorize"** (cadeado) no topo da página e insira o token.
4. Agora você pode criar, editar e excluir posts e (se for PROFESSOR) gerenciar usuários!

---

## 📑 Contrato da API

Base URL local: `http://localhost:3000` · Swagger: `/api/docs`.

| Recurso | Rota | Auth | Body / Query |
|---|---|---|---|
| Listar posts | `GET /posts?page=&limit=` | pública | query |
| Buscar posts | `GET /posts/search?q=&page=&limit=` | pública | query |
| Ler post | `GET /posts/:id` | pública | — |
| Criar post | `POST /posts` | JWT + PROFESSOR | `{ title, content, author }` |
| Editar post | `PATCH /posts/:id` | JWT + PROFESSOR | parcial |
| Excluir post | `DELETE /posts/:id` | JWT + PROFESSOR | — |
| Login | `POST /auth/login` | pública | `{ email, password }` → `{ access_token }` |
| Listar usuários | `GET /users?role=&page=&limit=` | JWT + PROFESSOR | query |
| Ler usuário | `GET /users/:id` | JWT + PROFESSOR | — |
| Criar usuário | `POST /users` | JWT + PROFESSOR | `{ name, email, password, role }` |
| Editar usuário | `PATCH /users/:id` | JWT + PROFESSOR | parcial |
| Excluir usuário | `DELETE /users/:id` | JWT + PROFESSOR | — |

### Paginação

`GET /posts`, `GET /posts/search` e `GET /users` aceitam `?page=` (padrão `1`) e `?limit=` (padrão `10`, máx. `100`) e retornam o envelope:

```json
{
  "data": [ /* ...itens... */ ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

`GET /posts/:id` e `GET /users/:id` **não** mudam de formato (retornam o item cru).

### Erros

Token ausente ou expirado → `401`. Role diferente de `PROFESSOR` em rota restrita → `403`. E-mail duplicado (criar/editar usuário) → `409`. Excluir usuário com posts vinculados → `409` ("Usuário possui posts vinculados").
