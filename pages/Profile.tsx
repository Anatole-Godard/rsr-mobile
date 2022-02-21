import React from "react";

import { HOST_URL } from "constants/env";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { Navigation } from "types/Navigation";
import { UserMinimum } from "types/User";
import { theme as core } from "core/theme";

interface Props {
  navigation: Navigation;
  route: { params: UserMinimum };
}

import { Dimensions } from "react-native";

export const ProfileScreen = (props: Props) => {
  const { fullName, photoURL, uid } = props.route.params;
  const theme = useTheme();
  return (
    <View style={{ height: Dimensions.get("screen").height / 3 }}>
      <ImageBackground
        source={{ uri: HOST_URL + photoURL }}
        style={{ height: "100%", width: "100%", flex: 1 }}
        blurRadius={64}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            backgroundColor: "rgba(0,0,0, 0.60)",
          }}
        >
          <Avatar.Image source={{ uri: HOST_URL + photoURL }} size={96} />
          <Text
            style={{
              fontFamily: "Marianne-Bold",
              fontSize: 24,
              color: core.dark.colors.text,
              marginTop: 12,
            }}
          >
            {fullName}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};
