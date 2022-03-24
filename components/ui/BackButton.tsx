import { theme } from "core/theme";
import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { getStatusBarHeight } from "react-native-status-bar-height";

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props) => {
  const _colorScheme = useColorScheme() || "light";
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <ChevronLeftIcon size={24} color={theme[_colorScheme].colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
