import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Media } from "types/Resource/Media";

interface PhysicalItemProps {
  properties: {
    name: string;
    description: string;
    medias?: Media[];
    price: number | null;
    category: string;
  };
}

export const PhysicalItem = (props: PhysicalItemProps) => {
  const { colorScheme } = usePreferences();
  const {
    properties: { price, category, medias },
  } = props;
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme[colorScheme].colors.surface,
      }}
    >
      {medias && <View style={styles.leftColumn}></View>}
      <View style={{ ...styles.rightColumn, width: medias ? "75%" : "100%" }}>
        {category && (
          <>
            <Text style={styles.label}>Catégorie</Text>
            <Text style={styles.text}>{category}</Text>
          </>
        )}
        {price && (
          <>
            <Text style={styles.label}>Prix</Text>
            <Text style={styles.text}>{price}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "25%",
    height: "100%",
  },
  rightColumn: {
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "Marianne-Bold",
  },
  text: {
    fontSize: 14,
    fontFamily: "Marianne",
  },
});
