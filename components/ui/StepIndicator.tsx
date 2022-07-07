import React from "react";
import "react-native-get-random-values";

import { View, ViewStyle } from "react-native";
import { useTheme, Text } from "react-native-paper";

interface StepIndicatorProps {
  containerStyle?: ViewStyle;
  steps: {
    current: number;
    total: number;
    name: string;
  };
  style?: ViewStyle;
  key?: string;
}

export function StepIndicator(props: StepIndicatorProps) {

  const theme = useTheme();
  return (
    <View style={{ ...props.containerStyle, width: "100%" }}>
      {props.steps && (
        <View
          style={{
            flexDirection: "row",
            ...props.style,
          }}
        >
          <Text style={{ fontSize: 18 }}>Étape </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {props.steps.current}
          </Text>
          <Text style={{ fontSize: 18, color: "#777" }}>
            {" "}
            sur {props.steps.total} :{" "}
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {props.steps.name}
          </Text>
        </View>
      )}

    </View>
  );
}
