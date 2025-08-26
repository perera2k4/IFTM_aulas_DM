import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <View style={styles.quadrado}>
          <Text style={{ flex: 1, backgroundColor: "#00FF00" }}>1</Text>
        </View>
        <View style={styles.quadrado}>
          <Text style={{ flex: 1, backgroundColor: "#FF0000" }}>2</Text>
        </View>
      </View>
      <View style={styles.linha}>
        <View style={styles.quadrado}>
          <Text style={{ flex: 1, backgroundColor: "#0000FF" }}>3</Text>
        </View>
        <View style={styles.quadrado}>
          <Text style={{ flex: 1, backgroundColor: "#FF00FF" }}>4</Text>
        </View>
      </View>

      <StatusBar hidden={true} style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 100,
    gap: 5,
  },
  linha: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    gap: 5,
  },
  quadrado: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
});
