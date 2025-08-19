import { StatusBar } from "expo-status-bar";
import { React, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [contador, setContador] = useState(0);

  return (
    <View style={styles.container}>
      <Text
        style={{ color: contador < 0 ? "#FF0000" : "#00FF00", fontSize: 30 }}
      >
        Você clicou {contador} vezes!
      </Text>

      <Button
        title="Aumentar"
        onPress={() => setContador(contador + 1)}
      ></Button>
      <Button
        title="Diminuir"
        onPress={() => setContador(contador - 1)}
      ></Button>
      <Button
        title="Resetar"
        onPress={() => setContador(contador - contador)}
      ></Button>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 30,
    color: "#00FF00",
  },
});
