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
  const frutas = [
    { id: "1", nome: "🍌 Banana" },
    { id: "2", nome: "🍎 Maça" },
    { id: "3", nome: "🍊 Laranja" },
    { id: "4", nome: "🍇 Uva" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de frutas</Text>
      <FlatList
        data={frutas}
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
});
