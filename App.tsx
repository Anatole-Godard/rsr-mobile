import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Resource_Mobile } from "./components/Resource";

export default function App() {
  return (
    <View style={styles.container}>
      <Resource_Mobile
        owner="Léonard Eau 🤌"
        createdAt={new Date()}
        likes={12}
        comments={[
          {
            owner: "Léonard Eau",
            content: "Hello World",
            photoUrl: "https://i.pravatar.cc/300",
          },
          {
            owner: "Torté Linni",
            content: "Hello World",
            photoUrl: "https://i.pravatar.cc/300",
          },
          {
            owner: "Michel Angelo",
            content: "Hello World",
            photoUrl: "https://i.pravatar.cc/300",
          },
          {
            owner: "Daunat Tello",
            content: "Hello World",
            photoUrl: "https://i.pravatar.cc/300",
          },
        ]}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 50,
  },
});
