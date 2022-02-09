import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";

type Props = React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, children, ...props }: Props) => {
  const { colorScheme } = usePreferences();
  return (
    <PaperButton
      style={[
        styles.button,
        mode === "outlined"
          ? {
              backgroundColor: theme[colorScheme].colors.surface,
              borderColor: theme[colorScheme].colors.primary,
            }
          : { backgroundColor: theme[colorScheme].colors.primary },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      color={theme[colorScheme].colors.primary}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);
