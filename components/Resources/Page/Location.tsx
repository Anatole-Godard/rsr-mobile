import { theme } from "core/theme";
import { usePreferences } from "hooks/usePreferences";
import React from "react";
import { StyleSheet, View } from "react-native";
import { GeoJSON_Point } from "types/Resource/GeoJSON";

import MapView, { Marker } from "react-native-maps";
import { Text } from "react-native-paper";
import { BlurView } from "expo-blur";

interface LocationProps extends GeoJSON_Point {
  properties: {
    name: string;
    location: string;
  };
}

export const Location = (props: LocationProps) => {
  const { colorScheme } = usePreferences();
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme[colorScheme].colors.surface,
      }}
    >
      <View style={styles.leftColumn}>
        <MapView
          userInterfaceStyle={colorScheme}
          style={styles.map}
          initialRegion={{
            latitude: props.geometry.coordinates[0],
            longitude: props.geometry.coordinates[1],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: props.geometry.coordinates[0],
              longitude: props.geometry.coordinates[1],
            }}
          />
        </MapView>
      </View>
      <BlurView intensity={90} tint={colorScheme} style={styles.rightColumn}>
        <Text style={styles.label}>Adresse</Text>
        <Text style={styles.text}>{props.properties.location}</Text>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    // paddingVertical: 8,
    // paddingHorizontal: 8,
    borderRadius: 8,
    // justifyContent: "space-between",
  },
  leftColumn: {
    width: "100%",
    height: "100%",
  },
  rightColumn: {
    // width: "47.5%",
    // height: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Marianne-Bold",
  },
  text: {
    fontSize: 14,
    fontFamily: "Marianne",
  },
  map: { ...StyleSheet.absoluteFillObject, borderRadius: 4 },
});
