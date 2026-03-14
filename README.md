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
- [ ] Criar `docker-compose.yml` para PostgreSQL.
- [ ] Configurar Prisma ORM e conexão com banco.

### 2. Desenvolvimento de Recursos (Posts)

- [ ] Criar Módulo de Posts (Controller, Service, Module).
- [ ] Implementar `GET /posts` (Listagem geral).

- [ ] Implementar `GET /posts/:id` (Leitura de post específico).

- [ ] Implementar `GET /posts/search` (Busca por palavras-chave).

- [ ] Implementar `POST /posts` (Criação com validação Zod).

- [ ] Implementar `PUT /posts/:id` (Edição de postagem).

- [ ] Implementar `DELETE /posts/:id` (Exclusão de postagem).

### 3. Segurança & Validação

- [ ] Implementar autenticação JWT para rotas de docentes.
- [ ] Criar Guards para proteção de rotas (POST, PUT, DELETE).
- [ ] Refinar esquemas de validação Zod para DTOs.

### 4. Qualidade & Entrega

- [ ] Implementar testes unitários.

- [ ] Configurar GitHub Actions (CI/CD).

- [ ] Finalizar documentação técnica e guia de uso.

- [ ] Gravar vídeo de demonstração.
