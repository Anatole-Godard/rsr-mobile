import React from "react";
import { View, Dimensions, ViewStyle } from "react-native";
import { ProgressBar, useTheme, Text } from "react-native-paper";

interface StepIndicatorProps {
  containerStyle?: ViewStyle;
  steps: {
    current: number;
    total: number;
    name: string;
  };
  style?: ViewStyle;
  order: any;
  progress: any[];
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
              fontSize: props.order ? 14 : 18,
              fontWeight: "bold",
            }}
          >
            {props.steps.current}
          </Text>
          <Text style={{ fontSize: props.order ? 14 : 18, color: "#777" }}>
            {" "}
            sur {props.steps.total} :{" "}
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: props.order ? 14 : 18,
              fontWeight: "bold",
            }}
          >
            {props.steps.name}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          //   marginLeft: props.order ? 0 : 30,
          marginBottom: 30,
        }}
      >
        {props.progress.map(
          (
            el: {
              value: number;
              style: ViewStyle;
              indeterminate?: boolean;
            },
            key: number
          ) => {
            return (
              <ProgressBar
                key={key}
                progress={el.value}
                style={{
                  width:
                    Dimensions.get("window").width /
                    (props.progress.length * 1.14),
                  marginRight: 5,
                  ...el.style,
                }}
                indeterminate={el.indeterminate}
                color={theme.colors.primary}
              />
            );
          }
        )}
      </View>
    </View>
  );
}
