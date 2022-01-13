import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import {
  ChatIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

export function DrawerContent({navigation, ...props}: any) {

  const user = {
    data: {
      _id: "61dd54b50e9bdfb1d20492b5",
      fullName: "Oph test",
      birthDate: "2022-01-11T00:00:00.000Z",
      email: "oph@test.fr",
      password: "azerty123",
      role: "user",
      photoURL: "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
      createdAt: "2022-01-11T09:58:13.119Z",
      __v: 0
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            children={undefined}
            source={{
              uri: user.data.photoURL,
            }}
            size={50}
          />
          <Title style={styles.title}>{user.data.fullName}</Title>
          {/*<Caption style={styles.caption}>@trensik</Caption>*/}
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={() => <UserCircleIcon />}
            label="Profile"
            onPress={() => {}}
          />
          <DrawerItem
            icon={() => <ChatIcon />}
            label="Preferences"
            onPress={() => {}}
          />
          <DrawerItem
            icon={() => <ShoppingBagIcon />}
            label="Bookmarks"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text
                onPressIn={undefined}
                onPressOut={undefined}
                android_hyphenationFrequency={undefined}
              >
                Dark Theme
              </Text>
              <View pointerEvents="none">
                <Switch children={undefined} value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text
                onPressIn={undefined}
                onPressOut={undefined}
                android_hyphenationFrequency={undefined}
              >
                RTL
              </Text>
              <View pointerEvents="none">
                <Switch value={false} children={undefined} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
