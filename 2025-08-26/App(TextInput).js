import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function Input() {
  const [nome, setNome] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Digite seu nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome:"
        value={nome}
        onChangeText={(texto) => setNome(texto)}
      ></TextInput>
      <Text style={styles.resultado}>Olá, {nome}!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A1A1A1",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  resultado: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
