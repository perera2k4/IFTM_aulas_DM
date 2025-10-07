// Classe principal do cliente do chat
class ChatClient {
  constructor() {
    this.socket = null;
    this.username = '';
    this.room = 'general';
    this.typingTimeout = null;
    this.isTyping = false;
    this.typingUsers = new Set();
    
    this.initElements();
    this.attachEventListeners();
  }

  // Inicializa referências aos elementos do DOM
  initElements() {
    // Modal de login
    this.loginModal = document.getElementById('loginModal');
    this.loginForm = document.getElementById('loginForm');
    this.usernameInput = document.getElementById('usernameInput');
    this.roomInput = document.getElementById('roomInput');

    // Chat container
    this.chatContainer = document.getElementById('chatContainer');
    this.messagesContainer = document.getElementById('messagesContainer');
    this.messageForm = document.getElementById('messageForm');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');

    // Informações da interface
    this.roomName = document.getElementById('roomName');
    this.onlineNumber = document.getElementById('onlineNumber');
    this.userCount = document.getElementById('userCount');
    this.usersList = document.getElementById('usersList');
    
    // Indicador de digitação
    this.typingIndicator = document.getElementById('typingIndicator');
    this.typingText = document.getElementById('typingText');
    
    // Loading
    this.loadingHistory = document.getElementById('loadingHistory');

    // Toast
    this.toast = document.getElementById('toast');
  }

  // Anexa event listeners
  attachEventListeners() {
    // Login
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

    // Envio de mensagem
    this.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));

    // Digitação
    this.messageInput.addEventListener('input', () => this.handleTyping());
    this.messageInput.addEventListener('blur', () => this.handleStopTyping());
  }

  // Handler do login
  handleLogin(e) {
    e.preventDefault();
    
    this.username = this.usernameInput.value.trim();
    this.room = this.roomInput.value;

    if (!this.username) {
      this.showToast('Por favor, digite um nome de usuário', 'error');
      return;
    }

    // Esconde modal e mostra chat
    this.loginModal.style.display = 'none';
    this.chatContainer.style.display = 'flex';

    // Atualiza nome da sala
    const roomNames = {
      'general': '💬 Geral',
      'tech': '💻 Tecnologia',
      'random': '🎲 Aleatório',
      'help': '❓ Ajuda'
    };
    this.roomName.textContent = `Sala: ${roomNames[this.room]}`;

    // Conecta ao servidor
    this.connectSocket();
  }

  // Conecta ao Socket.IO
  connectSocket() {
    this.socket = io();

    // Eventos de conexão
    this.socket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
      this.socket.emit('join', {
        username: this.username,
        room: this.room
      });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
      this.showToast('Desconectado do servidor', 'error');
      this.messageInput.disabled = true;
      this.sendButton.disabled = true;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
      this.showToast('Erro ao conectar ao servidor', 'error');
    });

    // Histórico de mensagens
    this.socket.on('message_history', (messages) => {
      this.loadingHistory.style.display = 'none';
      this.renderMessageHistory(messages);
      this.messageInput.disabled = false;
      this.sendButton.disabled = false;
      this.messageInput.focus();
    });

    // Nova mensagem
    this.socket.on('new_message', (data) => {
      this.addMessage(data);
    });

    // Usuário entrou
    this.socket.on('user_joined', (data) => {
      this.addSystemMessage(`${data.username} entrou no chat`, 'join');
    });

    // Usuário saiu
    this.socket.on('user_left', (data) => {
      this.addSystemMessage(`${data.username} saiu do chat`, 'leave');
    });

    // Usuários online
    this.socket.on('online_users', (users) => {
      this.updateOnlineUsers(users);
    });

    // Usuário digitando
    this.socket.on('user_typing', (data) => {
      this.typingUsers.add(data.username);
      this.updateTypingIndicator();
    });

    // Usuário parou de digitar
    this.socket.on('user_stop_typing', (data) => {
      this.typingUsers.delete(data.username);
      this.updateTypingIndicator();
    });

    // Erro
    this.socket.on('error', (data) => {
      this.showToast(data.message, 'error');
    });
  }

  // Renderiza histórico de mensagens
  renderMessageHistory(messages) {
    if (messages.length === 0) {
      this.addSystemMessage('Nenhuma mensagem anterior. Seja o primeiro a falar!', '');
      return;
    }

    messages.forEach(msg => {
      this.addMessage(msg, true);
    });

    this.scrollToBottom();
  }

  // Adiciona mensagem ao chat
  addMessage(data, isHistory = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const isOwn = data.username === this.username;
    if (isOwn) {
      messageDiv.classList.add('own');
    }

    const time = new Date(data.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    messageDiv.innerHTML = `
      <div class="message-header">
        <span class="message-username">${this.escapeHtml(data.username)}</span>
        <span class="message-time">${time}</span>
      </div>
      <div class="message-content">${this.escapeHtml(data.message)}</div>
    `;

    this.messagesContainer.appendChild(messageDiv);

    if (!isHistory) {
      this.scrollToBottom();
    }
  }

  // Adiciona mensagem do sistema
  addSystemMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `system-message ${type}`;
    messageDiv.textContent = text;
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  // Handler de envio de mensagem
  handleSendMessage(e) {
    e.preventDefault();

    const message = this.messageInput.value.trim();

    if (!message) return;

    if (message.length > 1000) {
      this.showToast('Mensagem muito longa (máx. 1000 caracteres)', 'error');
      return;
    }

    // Emite mensagem
    this.socket.emit('send_message', { message });

    // Limpa input
    this.messageInput.value = '';

    // Para indicador de digitação
    this.handleStopTyping();

    // Foca no input
    this.messageInput.focus();
  }

  // Handler de digitação
  handleTyping() {
    if (!this.isTyping) {
      this.isTyping = true;
      this.socket.emit('typing');
    }

    // Reseta timeout
    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.handleStopTyping();
    }, 3000);
  }

  // Handler de parar de digitar
  handleStopTyping() {
    if (this.isTyping) {
      this.isTyping = false;
      this.socket.emit('stop_typing');
      clearTimeout(this.typingTimeout);
    }
  }

  // Atualiza lista de usuários online
  updateOnlineUsers(users) {
    this.onlineNumber.textContent = users.length;
    this.userCount.textContent = users.length;

    this.usersList.innerHTML = '';

    users.forEach(username => {
      const li = document.createElement('li');
      li.textContent = username;
      if (username === this.username) {
        li.style.fontWeight = '600';
        li.style.color = 'var(--primary-color)';
      }
      this.usersList.appendChild(li);
    });
  }

  // Atualiza indicador de digitação
  updateTypingIndicator() {
    if (this.typingUsers.size === 0) {
      this.typingIndicator.style.display = 'none';
      return;
    }

    this.typingIndicator.style.display = 'flex';

    const users = Array.from(this.typingUsers);
    let text = '';

    if (users.length === 1) {
      text = `${users[0]} está digitando...`;
    } else if (users.length === 2) {
      text = `${users[0]} e ${users[1]} estão digitando...`;
    } else {
      text = `${users.length} pessoas estão digitando...`;
    }

    this.typingText.textContent = text;
  }

  // Scroll para o final
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  // Mostra toast
  showToast(message, type = 'success') {
    this.toast.textContent = message;
    this.toast.className = `toast ${type} show`;

    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }

  // Escapa HTML para prevenir XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializa o cliente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new ChatClient();
});