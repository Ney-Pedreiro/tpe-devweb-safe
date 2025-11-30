# Biblioteca API

Sistema de gerenciamento de biblioteca com autenticação e autorização.

## Estrutura do Projeto

```
src/
├── controllers/         # Controladores das rotas
├── services/           # Lógica de negócio
├── routes/             # Definição das rotas
├── middlewares/        # Middlewares de autenticação
├── types/              # Tipos TypeScript
├── utils/              # Utilitários (JWT, senha)
├── database/           # Conexão com banco de dados
├── app.ts              # Configuração do Express
└── server.ts           # Inicialização do servidor
```

## Modelos

### User
- `id`: ID único
- `username`: Nome de usuário único
- `password`: Senha (hash)
- `role`: USER | ADMIN
- `createdAt`, `updatedAt`: Timestamps

### Book
- `id`: ID único
- `titulo`: Título do livro
- `ano`: Ano de lançamento
- `autor`: Autor do livro
- `descricao`: Descrição do livro
- `createdAt`, `updatedAt`: Timestamps

## Endpoints da API

### Autenticação (`/api/auth`)

#### POST `/api/auth/register`
Cadastra um novo usuário.
```json
{
  "username": "usuario",
  "password": "senha123",
  "role": "USER" // opcional, padrão: USER
}
```

#### POST `/api/auth/login`
Realiza login e retorna token.
```json
{
  "username": "usuario",
  "password": "senha123"
}
```

### Livros (`/api/books`)

#### GET `/api/books`
Lista todos os livros (requer autenticação).

#### GET `/api/books/:id`
Busca livro por ID (requer autenticação).

#### POST `/api/books`
Cria novo livro (requer ADMIN).
```json
{
  "titulo": "O Senhor dos Anéis",
  "ano": 1954,
  "autor": "J.R.R. Tolkien",
  "descricao": "Uma épica jornada..."
}
```

#### PUT `/api/books/:id`
Atualiza livro (requer ADMIN).

#### DELETE `/api/books/:id`
Remove livro (requer ADMIN).

## Permissions

### USER (Usuário comum)
- ✅ Ver todos os livros
- ✅ Ver detalhes de um livro
- ❌ Criar livros
- ❌ Editar livros
- ❌ Excluir livros

### ADMIN (Administrador)
- ✅ Ver todos os livros
- ✅ Ver detalhes de um livro
- ✅ Criar livros
- ✅ Editar livros
- ✅ Excluir livros

## Como usar

1. **Registrar um usuário admin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123","role":"ADMIN"}'
   ```

2. **Fazer login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Usar o token retornado para acessar rotas protegidas:**
   ```bash
   curl -X GET http://localhost:3000/api/books \
     -H "Authorization: Bearer SEU_TOKEN_AQUI"
   ```

## Comandos

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Aplicar migrações
npx prisma migrate dev

# Iniciar servidor
npm start
```
