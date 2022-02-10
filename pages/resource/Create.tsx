import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  navigate: (route: string) => void;
}

export const ResourceCreate = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(props, undefined, 1)}</Text>
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
