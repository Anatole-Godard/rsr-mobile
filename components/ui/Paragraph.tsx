import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";

type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => {
  const { colorScheme } = usePreferences();
  return <Text style={{...styles.text, color: theme[colorScheme].colors.secondary}}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Spectral",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "left",
    marginBottom: 14,
  },
});

export default memo(Paragraph);
