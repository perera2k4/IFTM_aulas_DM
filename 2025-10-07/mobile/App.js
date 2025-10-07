import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import io from "socket.io-client";

const SERVER_URL = "https://6114bc10e993.ngrok-free.app";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Aguardando login");

  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert("Erro", "Digite um nome de usuário");
      return;
    }

    setIsLoading(true);
    setConnectionStatus("Conectando...");
    connectToServer();
  };

  const connectToServer = () => {
    console.log("🔌 Conectando ao servidor:", SERVER_URL);

    const socket = io(SERVER_URL, {
      transports: ["polling"],
      timeout: 30000,
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Conectado! Socket ID:", socket.id);
      setConnectionStatus("Conectado! Entrando...");

      setTimeout(() => {
        socket.emit("join", {
          username: username.trim(),
          room: room,
        });
        console.log("📤 Join enviado");
      }, 500);
    });

    socket.on("message_history", (history) => {
      console.log("📚 Histórico recebido:", history.length);
      setMessages(history);
      setIsLoading(false);
      setIsLoggedIn(true);
      setConnectionStatus("Online");
    });

    socket.on("new_message", (data) => {
      console.log("💬 Nova mensagem");
      setMessages((prev) => [...prev, data]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socket.on("user_joined", (data) => {
      const msg = {
        username: "Sistema",
        message: `${data.username} entrou`,
        timestamp: new Date(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_left", (data) => {
      const msg = {
        username: "Sistema",
        message: `${data.username} saiu`,
        timestamp: new Date(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erro:", error.message);
      setIsLoading(false);
      setConnectionStatus("Erro de conexão");
      Alert.alert(
        "Erro",
        "Não consegui conectar ao servidor.\n\n" + error.message
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado");
      setConnectionStatus("Desconectado");
    });

    setTimeout(() => {
      if (isLoading && !isLoggedIn) {
        console.log("⏱️ Timeout");
        setIsLoading(false);
        Alert.alert("Timeout", "Servidor não respondeu em 30s");
      }
    }, 30000);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("send_message", {
      message: message.trim(),
    });

    setMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.username === username;
    const isSystem = item.isSystem;

    if (isSystem) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.message}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View style={styles.messageHeader}>
          <Text
            style={[
              styles.messageUsername,
              isOwn ? styles.ownUsername : styles.otherUsername,
            ]}
          >
            {item.username}
          </Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownText : styles.otherText,
            ]}
          >
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>💬 Chat em Tempo Real</Text>
            <Text style={styles.loginSubtitle}>Entre para começar</Text>

            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{connectionStatus}</Text>
            </View>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome..."
              value={username}
              onChangeText={setUsername}
              maxLength={50}
              editable={!isLoading}
            />

            <Text style={styles.label}>Sala</Text>
            <View style={styles.roomSelector}>
              {["general", "tech", "random", "help"].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roomButton,
                    room === r && styles.roomButtonActive,
                  ]}
                  onPress={() => setRoom(r)}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.roomButtonText,
                      room === r && styles.roomButtonTextActive,
                    ]}
                  >
                    {r === "general" && "💬 Geral"}
                    {r === "tech" && "💻 Tech"}
                    {r === "random" && "🎲 Random"}
                    {r === "help" && "❓ Ajuda"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar no Chat</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.urlText}>{SERVER_URL}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Chat - {room}</Text>
        <Text style={styles.headerSubtitle}>{connectionStatus}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Digite sua mensagem..."
            value={message}
            onChangeText={setMessage}
            maxLength={1000}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loginHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#718096",
  },
  statusContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f7fafc",
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#718096",
  },
  loginForm: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  roomSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  roomButton: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  roomButtonActive: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
  },
  roomButtonText: {
    fontSize: 14,
    color: "#2d3748",
    fontWeight: "500",
  },
  roomButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#667eea",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  urlText: {
    marginTop: 16,
    fontSize: 10,
    color: "#a0aec0",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#667eea",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#e2e8f0",
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  ownMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  messageUsername: {
    fontSize: 12,
    fontWeight: "600",
  },
  ownUsername: {
    color: "#764ba2",
  },
  otherUsername: {
    color: "#667eea",
  },
  messageTime: {
    fontSize: 11,
    color: "#718096",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: "#667eea",
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#e2e8f0",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: "#fff",
  },
  otherText: {
    color: "#2d3748",
  },
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "#f7fafc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "flex-end",
  },
  messageInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: "#f7fafc",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 20,
  },
});
