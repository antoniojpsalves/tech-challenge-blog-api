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

- [x] Implementar testes unitários. (ufa)

- [ ] Configurar GitHub Actions (CI/CD).

- [ ] Finalizar documentação técnica e guia de uso.

- [ ] Gravar vídeo de demonstração.
