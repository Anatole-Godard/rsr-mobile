import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";

type Props = {
  children: React.ReactNode;
  fontSize?: number;
};

const Header = ({ children, fontSize }: Props) => {
  const { colorScheme } = usePreferences();
  return (
    <Text
      style={{ ...styles.header, fontSize: fontSize || styles.header.fontSize, color: theme[colorScheme].colors.primary }}
    >
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontFamily: "Marianne-ExtraBold",
    fontWeight: "bold",
    paddingVertical: 14,
  },
});

export default memo(Header);
