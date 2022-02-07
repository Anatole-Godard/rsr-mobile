import { useAuth } from "hooks/useAuth";
import React from "react";
import { View, Text } from "react-native";

export const HomeScreen = () => {
  const { user } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{JSON.stringify(user, undefined, 1)}</Text>
    </View>
  );
};
