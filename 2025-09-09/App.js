import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  //useEffect roda enquanto o componente está sendo construído
  useEffect(() => {
    fetch("http://jsonplaceholder.typicode.com/users")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setUsuarios(dados);
        setCarregando(false);
      })
      .catch((erro) => {
        console.log(erro);
        setCarregando(false);
      });
  }, []); //[] significa que o useEffect vai rodar uma vez no início

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de usuários</Text>

      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.texto}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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
  email: {
    fontSize: 14,
    color: "#00BFFF",
    borderBottomWidth: 1,
    borderColor: "#00BFFF",
  },
});
