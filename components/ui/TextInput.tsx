import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, ...props }: Props) => {
  const { colorScheme } = usePreferences();
  return (
    <View style={styles.container}>
      <Input
        style={{
          ...styles.input,
          backgroundColor: theme[colorScheme].colors.surface,
        }}
        selectionColor={theme[colorScheme].colors.primary}
        underlineColor="transparent"
        mode="outlined"
        activeOutlineColor={theme[colorScheme].colors.primary}
        {...props}
      />
      {errorText ? (
        <Text
          style={{ ...styles.error, color: theme[colorScheme].colors.error }}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 3,
  },
  input: {},
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
