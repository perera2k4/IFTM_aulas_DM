import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
} from "react-native";

export default function App() {
  const [tarefa, setTarefa] = useState("");
  const [lista, setLista] = useState("");

  const adicionarTarefa = () => {
    if (tarefa.trim() === "") {
      return;
    }
    setLista([...lista, { id: Date.now().toString(), nome: tarefa }]);
    setTarefa("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={tarefa}
        onChangeText={setTarefa}
      />
      <Button title="Adicionar" onPress={adicionarTarefa} />

      <FlatList
        data={lista}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.texto}>{item.nome}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  texto: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
