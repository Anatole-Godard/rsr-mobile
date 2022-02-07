import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "core/theme";

type Props = {
  children: React.ReactNode;
  fontSize?: number;
};

const Header = ({ children, fontSize }: Props) => (
  <Text
    style={{ ...styles.header, fontSize: fontSize || styles.header.fontSize }}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontFamily: "Marianne-ExtraBold",
    color: theme.colors.primary,
    fontWeight: "bold",
    paddingVertical: 14,
  },
});

export default memo(Header);
