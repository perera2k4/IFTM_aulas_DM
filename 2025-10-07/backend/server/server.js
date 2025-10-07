require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const ChatController = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Conectar ao banco de dados e iniciar servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB
    await connectDB();

    // Inicializa o controlador do chat
    const chatController = new ChatController(io);

    // Configura eventos do Socket.IO
    io.on('connection', (socket) => {
      chatController.handleConnection(socket);
    });

    // Inicia o servidor
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 SERVIDOR CHAT INICIADO           ║
║   📡 Porta: ${PORT}                      ║
║   🌍 URL: http://localhost:${PORT}       ║
║   📊 MongoDB: Conectado                ║
║   ⚡ Socket.IO: Ativo                  ║
╚════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recebido, fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});

// Inicia o servidor
startServer();

module.exports = { app, server, io };