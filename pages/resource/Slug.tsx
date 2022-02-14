import { DetailedResource } from "components/Resources/DetailledResource";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { Navigation } from "types/Navigation";
import { Resource } from "types/Resource";

interface Props {
  navigation: Navigation;
  route: {
    params: Resource;
    name: string;
  };
}

export const ResourceSlug = (props: Props) => {
  const theme = useTheme();
  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.surface }}
    >
      <DetailedResource
        page
        {...props.route.params}
        navigation={props.navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
