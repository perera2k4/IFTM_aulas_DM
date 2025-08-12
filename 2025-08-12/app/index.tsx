import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{ // Altera a estilização para a view
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00BFFF",
      }}
    >
      <Text
        style = {{ // Altera a estilização do componente
          fontSize: 30,
        }}
      >Hello world</Text>
    </View>
  );
}
