import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Resource } from "types/Resource";

interface Props {
  navigate: (route: string) => void;
  route: {
    params: Resource;
    name: string;
  };
}

export const ResourceSlug = (props: Props) => {
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
