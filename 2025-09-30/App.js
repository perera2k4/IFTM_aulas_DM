import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.ViewContainer}>
      <Text style={styles.TextContainer}>Ciência da Computação</Text>
      <Button
        title="Ir para Detalhes"
        onPress={() =>
          navigation.navigate("Detalhes", { curso: "Computação", ano: 2025 })
        }
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { curso, ano } = route.params; // Acessa os parâmetros recebidos
  return (
    <View style={styles.ViewContainer}>
      <Text style={styles.TextContainer}>Curso: {curso}</Text>
      <Text style={styles.TextContainer}>Ano: {ano}</Text>
      <Button
        title="Ir para HOME"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  TextContainer: {
    fontSize: 22,
    marginBottom: 20,
  },
});
