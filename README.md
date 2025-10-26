# 🍽️ Freelancer Now

Plataforma completa para conectar empresas do setor de hospitalidade (bares, restaurantes e hotéis) com freelancers qualificados (garçons, cozinheiros, bartenders e mais).

## ✨ Funcionalidades

### Para Empresas
- 📝 Publicação de vagas com detalhes completos
- ✏️ Edição e gerenciamento de vagas publicadas
- 👥 Visualização de candidaturas recebidas
- ⭐ Sistema de avaliação de freelancers
- 💬 Chat em tempo real com candidatos
- 📊 Painel de estatísticas e vagas

### Para Freelancers
- 🔍 Busca de vagas com filtros avançados
- 📄 Candidatura a vagas com mensagem personalizada
- 👤 Perfil profissional completo
- ⭐ Recebimento e visualização de avaliações
- 💬 Chat em tempo real com empregadores
- 📈 Acompanhamento de candidaturas

### Recursos Gerais
- 🔐 Autenticação segura com Manus OAuth
- 📱 Design responsivo e moderno
- 💬 Sistema de chat em tempo real
- ⭐ Avaliações mútuas transparentes
- 📋 Validação de CPF/CNPJ
- 🎨 Interface intuitiva e profissional

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Wouter** - Roteamento
- **tRPC** - Comunicação type-safe com backend
- **shadcn/ui** - Componentes UI

### Backend
- **Node.js** - Runtime
- **Express 4** - Framework web
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM para banco de dados
- **MySQL/TiDB** - Banco de dados

### Autenticação
- **Manus OAuth** - Sistema de autenticação

## 📦 Instalação

### Pré-requisitos
- Node.js 22+
- MySQL 8+ ou TiDB
- pnpm (gerenciador de pacotes)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/freelancer-now.git
cd freelancer-now
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o banco de dados**
```bash
# Execute o script SQL fornecido
mysql -u seu_usuario -p seu_banco < database/schema.sql
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/freelancer_now

# Autenticação
JWT_SECRET=seu_secret_key_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
VITE_APP_ID=seu_app_id

# Aplicação
VITE_APP_TITLE=Freelancer Now
VITE_APP_LOGO=/logo-v2.png
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=Seu Nome

# APIs (opcional - para recursos avançados)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
```

5. **Execute as migrações do banco**
```bash
pnpm db:push
```

6. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

O site estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
freelancer-now/
├── client/                 # Frontend React
│   ├── public/            # Arquivos estáticos
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas da aplicação
│       ├── lib/           # Utilitários e helpers
│       └── contexts/      # Contextos React
├── server/                # Backend Node.js
│   ├── _core/            # Core do servidor
│   ├── db.ts             # Funções de banco de dados
│   └── routers.ts        # Rotas tRPC
├── drizzle/              # Schema e migrações
│   └── schema.ts         # Definição das tabelas
├── database/             # Scripts SQL
│   └── schema.sql        # Schema completo do banco
└── shared/               # Código compartilhado
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **users** - Usuários (freelancers e empresas)
- **jobs** - Vagas publicadas
- **applications** - Candidaturas
- **reviews** - Avaliações
- **chats** - Conversas
- **messages** - Mensagens do chat

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Banco de Dados
pnpm db:push          # Aplica mudanças no schema
pnpm db:studio        # Abre interface visual do banco

# Build
pnpm build            # Compila para produção
pnpm start            # Inicia servidor de produção

# Qualidade de Código
pnpm lint             # Verifica código
pnpm type-check       # Verifica tipos TypeScript
```

## 🎨 Categorias de Vagas

- Garçom
- Cozinheiro
- Bartender
- Recepcionista
- Gerente
- Auxiliar de Cozinha
- Sommelier
- Outros

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.

---

**Desenvolvido com ❤️ para o setor de hospitalidade**
