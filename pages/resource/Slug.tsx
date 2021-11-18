import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const ResourceSlug = () => {
  return (
    <View style={styles.container}>
      <Text>ResourceSlug</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
