import React, { useCallback } from "react";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import {
  Alert,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinkIcon } from "react-native-heroicons/outline";
import { TouchableRipple } from "react-native-paper";
import Color from "color";

interface ExternalLinkProps {
  properties: {
    name: string;
    description?: string;
    externalLink: string;
  };
}

export const ExternalLink = (props: ExternalLinkProps) => {
  const { colorScheme } = usePreferences();
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(props.properties.externalLink);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(props.properties.externalLink);
    } else {
      Alert.alert(
        `Don't know how to open this URL: ${props.properties.externalLink}`
      );
    }
  }, [props.properties.externalLink]);

  return (
    <TouchableRipple
      onPress={handlePress}
      rippleColor={Color(theme[colorScheme].colors.surface)
        .alpha(0.8)
        .rgb()
        .string()}
      style={styles.container}
    >
      <>
        <View style={styles.leftColumn}>
          <LinkIcon size={24} color={theme[colorScheme].colors.primary} />
        </View>
        <View style={styles.rightColumn}>
          <Text ellipsizeMode="tail" style={styles.text}>
            {props.properties.externalLink}
          </Text>
        </View>
      </>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width / 1.75,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.light.colors.surface,
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "10%",
  },
  rightColumn: {
    width: "82%",
  },
  text: {
    fontFamily: "Marianne-ExtraBold",
    fontSize: 16,
    color: theme.light.colors.primary,
  },
});
