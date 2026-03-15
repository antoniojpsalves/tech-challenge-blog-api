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

### 4. Qualidade & Entrega

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

- **ALUNO:** Papel padrão. Pode listar posts (`GET /posts`) e buscar posts (`GET /posts/search`).
- **PROFESSOR:** Pode listar e gerenciar posts (`POST`, `PATCH`, `DELETE`).

**Passo a passo para testar:**

1. Crie um usuário na rota `POST /users` passando o role `PROFESSOR`.
2. Faça login na rota `POST /auth/login` para receber seu `access_token`.
3. No Swagger, clique no botão **"Authorize"** (cadeado) no topo da página e insira o token.
4. Agora você pode criar, editar e excluir posts!
