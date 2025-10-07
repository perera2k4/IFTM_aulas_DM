# 💬 Chat em Tempo Real com Persistência

Sistema de chat em tempo real desenvolvido com **Socket.IO**, **Express** e **MongoDB** para demonstrar persistência de dados em aplicações WebSocket.

## 🎯 Funcionalidades

✅ **Persistência de Mensagens**: Todas as mensagens são armazenadas no MongoDB  
✅ **Histórico de Chat**: Novos usuários recebem as últimas 50 mensagens  
✅ **Indicador de Digitação**: Mostra quando outros usuários estão digitando  
✅ **Múltiplas Salas**: Suporte para diferentes canais de conversa  
✅ **Lista de Usuários Online**: Visualize quem está conectado em tempo real  
✅ **Interface Moderna**: Design responsivo e animações suaves  
✅ **Notificações**: Avisos quando usuários entram/saem do chat  

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (local ou MongoDB Atlas)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd real-time-chat-persistente
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chat_persistente
MAX_MESSAGE_HISTORY=50
TYPING_TIMEOUT=3000
```

### 4. Inicie o MongoDB

**Opção A - MongoDB Local:**
```bash
mongod
```

**Opção B - MongoDB Atlas:**
- Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crie um cluster gratuito
- Copie a connection string e cole no arquivo `.env`

### 5. Inicie o servidor

**Modo desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

### 6. Acesse a aplicação

Abra seu navegador em: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Estrutura do Projeto

```
real-time-chat/
├── server/
│   ├── models/
│   │   └── Message.js          # Schema do Mongoose para mensagens
│   ├── config/
│   │   └── database.js         # Configuração do MongoDB
│   ├── controllers/
│   │   └── chatController.js   # Lógica de eventos do Socket.IO
│   └── server.js               # Servidor Express + Socket.IO
├── public/
│   ├── index.html              # Interface do usuário
│   ├── styles.css              # Estilos da aplicação
│   └── client.js               # Código cliente Socket.IO
├── .env.example                # Exemplo de variáveis de ambiente
├── package.json                # Dependências do projeto
└── README.md                   # Documentação
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web minimalista
- **Socket.IO**: Comunicação bidirecional em tempo real
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB

### Frontend
- **HTML5**: Estrutura da página
- **CSS3**: Estilização moderna com animações
- **JavaScript (ES6+)**: Lógica cliente
- **Socket.IO Client**: Cliente WebSocket

---

## 📚 Conceitos Aprendidos

### 1. **Persistência de Dados em Tempo Real**
- Como salvar eventos Socket.IO no banco de dados
- Estratégias de armazenamento eficiente
- Queries otimizadas com índices

### 2. **Gestão de Histórico**
- Carregar mensagens antigas para novos usuários
- Limitar quantidade de mensagens (performance)
- Ordenação cronológica de eventos

### 3. **Indicadores de Estado**
- Implementar "usuário está digitando..."
- Timeouts para limpar estados
- Sincronização de estados entre múltiplos clientes

### 4. **Escalabilidade**
- Gerenciamento de múltiplas conexões
- Organização de código com controllers
- Boas práticas de arquitetura

---

## 🎓 Exercícios Práticos

### Exercício 1: Adicionar Timestamps
Modifique o código para exibir "há X minutos" nas mensagens antigas.

### Exercício 2: Sistema de Reações
Implemente emojis de reação para mensagens (👍, ❤️, 😂).

### Exercício 3: Mensagens Privadas
Adicione funcionalidade de DM (Direct Message) entre usuários.

### Exercício 4: Upload de Arquivos
Permita envio de imagens no chat com preview.

### Exercício 5: Busca no Histórico
Crie uma funcionalidade para pesquisar mensagens antigas.

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
**Solução:** Verifique se o MongoDB está rodando e a URI está correta no `.env`

### Erro: "Port 3000 already in use"
**Solução:** Mude a porta no `.env` ou encerre o processo que está usando a porta:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Mensagens não aparecem
**Solução:** 
1. Abra o console do navegador (F12)
2. Verifique se há erros JavaScript
3. Confirme que o Socket.IO conectou (mensagem verde no console)

---

## 📊 Melhorias Futuras

- [ ] Autenticação de usuários com JWT
- [ ] Criptografia end-to-end
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Suporte a markdown nas mensagens
- [ ] Integração com Redis para escalabilidade
- [ ] Testes automatizados (Jest + Supertest)
- [ ] Deploy na nuvem (Heroku/AWS)

---

## 📝 Notas do Professor

### Performance
- O índice composto `{ room: 1, timestamp: -1 }` otimiza as queries de histórico
- Limite de 50 mensagens balanceia UX e performance
- Considere implementar paginação para históricos maiores

### Segurança
- Validação de entrada no backend (maxLength, trim)
- Escape de HTML no frontend para prevenir XSS
- Rate limiting recomendado para produção

### Escalabilidade
- Para múltiplos servidores, use Redis Adapter do Socket.IO
- Implemente compressão de mensagens para economizar banda
- Considere CDN para assets estáticos

---

## 📖 Recursos Adicionais

- [Documentação Socket.IO](https://socket.io/docs/v4/)
- [Mongoose Guides](https://mongoosejs.com/docs/guides.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB University](https://university.mongodb.com/)

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

---

