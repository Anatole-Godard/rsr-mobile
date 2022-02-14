import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { colors, theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import color from "color";

type Props = React.ComponentProps<typeof Input> & { errorText?: string, style?: any };

const TextInput = ({ errorText, ...props }: Props) => {
  const { colorScheme } = usePreferences();
  const borderColor = color(theme[colorScheme].colors.text)
    .alpha(0.4)
    .rgb()
    .string();

  return (
    <View style={styles.container}>
      <Input
        outlineColor="transparent"
        activeOutlineColor={borderColor}
        activeUnderlineColor="transparent"
        underlineColor="transparent"
        mode="outlined"
        {...props}
        style={{
          ...props.style,
          backgroundColor: colorScheme === "light" ? colors.trueGray[200] : colors.trueGray[800],
          borderRadius: 8,
          height: 48,
        }}
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
    fontFamily: "Spectral",
  },
});

export default memo(TextInput);
