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
  UserRemoveIcon,
} from "react-native-heroicons/outline";
import { useAuth } from "hooks/useAuth";

import { HOST_URL } from "@env";

export function DrawerContent({ navigation, ...props }: any) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            children={undefined}
            source={{
              uri: HOST_URL + user.data.photoURL,
            }}
            size={50}
          />
          <Title style={styles.title}>{user.data.fullName}</Title>
          {/*<Caption style={styles.caption}>@trensik</Caption>*/}
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

        <Drawer.Section title="Déconnexion">
          <DrawerItem
            icon={() => <UserRemoveIcon />}
            label="Se déconnecter"
            onPress={() => signOut()}
          />
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
