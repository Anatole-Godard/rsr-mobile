import React, { Fragment } from "react";
import "react-native-get-random-values";

import { View, Dimensions, ViewStyle } from "react-native";
import { ProgressBar, useTheme, Text } from "react-native-paper";

import { v4 as uuidv4 } from "uuid";
interface StepIndicatorProps {
  containerStyle?: ViewStyle;
  steps: {
    current: number;
    total: number;
    name: string;
  };
  style?: ViewStyle;
  progress: any[];
  key?: string;
}

export function StepIndicator(props: StepIndicatorProps) {
  const { key = uuidv4() } = props;

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
            k: number
          ) => {
            return (
              <Fragment key={key  + k}>
                <ProgressBar
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
              </Fragment>
            );
          }
        )}
      </View>
    </View>
  );
}
