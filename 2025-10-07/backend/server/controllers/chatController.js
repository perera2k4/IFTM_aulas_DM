const Message = require('../models/Message');

class ChatController {
  constructor(io) {
    this.io = io;
    this.users = new Map(); // socketId -> { username, room, typingTimeout }
  }

  async handleConnection(socket) {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    // Evento: Usuário entra no chat
    socket.on('join', async (data) => {
      try {
        const { username, room = 'general' } = data;
        
        // Armazena informações do usuário
        this.users.set(socket.id, { username, room, typingTimeout: null });
        
        // Entra na sala
        socket.join(room);
        
        console.log(`👤 ${username} entrou na sala: ${room}`);

        // Carrega histórico das últimas 50 mensagens
        const messageHistory = await Message.getRecentMessages(
          room, 
          parseInt(process.env.MAX_MESSAGE_HISTORY) || 50
        );

        // Envia histórico apenas para o usuário que acabou de entrar
        socket.emit('message_history', messageHistory);

        // Notifica outros usuários da sala
        socket.to(room).emit('user_joined', {
          username,
          timestamp: new Date()
        });

        // Envia lista de usuários online na sala
        this.emitOnlineUsers(room);

      } catch (error) {
        console.error('Erro ao entrar no chat:', error);
        socket.emit('error', { message: 'Erro ao entrar no chat' });
      }
    });

    // Evento: Nova mensagem
    socket.on('send_message', async (data) => {
      try {
        const user = this.users.get(socket.id);
        
        if (!user) {
          socket.emit('error', { message: 'Usuário não identificado' });
          return;
        }

        const { message } = data;
        
        // Validação
        if (!message || message.trim().length === 0) {
          return;
        }

        if (message.length > 1000) {
          socket.emit('error', { message: 'Mensagem muito longa (máx. 1000 caracteres)' });
          return;
        }

        // Salva mensagem no banco de dados
        const newMessage = await Message.create({
          username: user.username,
          message: message.trim(),
          room: user.room,
          socketId: socket.id
        });

        // Emite mensagem para todos na sala (incluindo remetente)
        this.io.to(user.room).emit('new_message', {
          username: newMessage.username,
          message: newMessage.message,
          timestamp: newMessage.timestamp
        });

        console.log(`💬 [${user.room}] ${user.username}: ${message.substring(0, 50)}...`);

      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        socket.emit('error', { message: 'Erro ao enviar mensagem' });
      }
    });

    // Evento: Usuário está digitando
    socket.on('typing', () => {
      const user = this.users.get(socket.id);
      
      if (!user) return;

      // Limpa timeout anterior se existir
      if (user.typingTimeout) {
        clearTimeout(user.typingTimeout);
      }

      // Notifica outros usuários
      socket.to(user.room).emit('user_typing', {
        username: user.username
      });

      // Define timeout para parar de exibir "digitando..."
      const timeout = setTimeout(() => {
        socket.to(user.room).emit('user_stop_typing', {
          username: user.username
        });
        user.typingTimeout = null;
      }, parseInt(process.env.TYPING_TIMEOUT) || 3000);

      user.typingTimeout = timeout;
    });

    // Evento: Usuário parou de digitar
    socket.on('stop_typing', () => {
      const user = this.users.get(socket.id);
      
      if (!user) return;

      if (user.typingTimeout) {
        clearTimeout(user.typingTimeout);
        user.typingTimeout = null;
      }

      socket.to(user.room).emit('user_stop_typing', {
        username: user.username
      });
    });

    // Evento: Desconexão
    socket.on('disconnect', () => {
      const user = this.users.get(socket.id);
      
      if (user) {
        // Limpa timeout se existir
        if (user.typingTimeout) {
          clearTimeout(user.typingTimeout);
        }

        console.log(`👋 ${user.username} saiu da sala: ${user.room}`);

        // Notifica outros usuários
        socket.to(user.room).emit('user_left', {
          username: user.username,
          timestamp: new Date()
        });

        // Remove usuário da lista
        this.users.delete(socket.id);

        // Atualiza lista de usuários online
        this.emitOnlineUsers(user.room);
      }

      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  }

  // Método auxiliar: Emite lista de usuários online na sala
  emitOnlineUsers(room) {
    const onlineUsers = Array.from(this.users.values())
      .filter(user => user.room === room)
      .map(user => user.username);

    this.io.to(room).emit('online_users', onlineUsers);
  }
}

module.exports = ChatController;