import React from "react";
import { colors } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import { StyleSheet, View } from "react-native";

export const Separator = () => {
  const { colorScheme } = usePreferences();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor:
          colorScheme === "dark" ? colors.trueGray[800] : colors.trueGray[300],
      }}
    />
  );
};
