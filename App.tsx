import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ChannelInviteBarCode } from "./components/ChannelInvite/BarCode";
import { Resource } from "./components/Resource";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Resource slug="react" /> */}
      <ChannelInviteBarCode/>
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
