import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar, Title, Drawer, Switch } from "react-native-paper";
import {
  ChatAlt2Icon,
  HomeIcon,
  MoonIcon,
  ShoppingBagIcon,
  SunIcon,
  UserCircleIcon,
  UserRemoveIcon,
} from "react-native-heroicons/outline";
import { useAuth } from "hooks/useAuth";

import { HOST_URL } from "@env";
import { usePreferences } from "hooks/usePreferences";
import { theme } from "core/theme";

export function DrawerContent({ navigation, ...props }: any) {
  const { user, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = usePreferences();

  const textStyle = {
    color: theme[colorScheme].colors.secondary,
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: theme[colorScheme].colors.background,
        color: theme[colorScheme].colors.text,
      }}
    >
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            children={undefined}
            source={{
              uri: HOST_URL + user.data.photoURL,
            }}
            size={64}
          />
          <Title style={styles.title}>{user.data.fullName}</Title>
          {/*<Caption style={styles.caption}>@trensik</Caption>*/}
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={() => (
              <UserCircleIcon color={theme[colorScheme].colors.primary} />
            )}
            label="Profil"
            onPress={() =>
              navigation.navigate("Profile", {
                uid: user.data.uid,
                fullName: user.data.fullName,
                photoURL: user.data.photoURL,
              })
            }
            labelStyle={textStyle}
          />
          <DrawerItem
            icon={() => <HomeIcon color={theme[colorScheme].colors.primary} />}
            label="Accueil"
            onPress={() => navigation.navigate("Accueil")}
            labelStyle={textStyle}
          />
          <DrawerItem
            icon={() => (
              <ShoppingBagIcon color={theme[colorScheme].colors.primary} />
            )}
            label="Catalogue"
            onPress={() => navigation.navigate("Catalogue")}
            labelStyle={textStyle}
          />
          <DrawerItem
            icon={() => (
              <ChatAlt2Icon color={theme[colorScheme].colors.primary} />
            )}
            label="Salons"
            onPress={() => navigation.navigate("Salons")}
            labelStyle={textStyle}
          />
        </Drawer.Section>
        <Drawer.Section title="Préferences">
          <Drawer.Item
            icon={() =>
              colorScheme === "dark" ? (
                <SunIcon color={theme[colorScheme].colors.primary} />
              ) : (
                <MoonIcon color={theme[colorScheme].colors.primary} />
              )
            }
            label="Mode sombre"
            onPress={toggleColorScheme}
            active={colorScheme === "dark"}
            right={() => (
              <Switch
                value={colorScheme === "dark"}
                onChange={() => toggleColorScheme()}
                trackColor={{ true: theme[colorScheme].colors.primary }}
              />
            )}
          />
        </Drawer.Section>

        <Drawer.Section title="Déconnexion">
          <DrawerItem
            icon={() => (
              <UserRemoveIcon color={theme[colorScheme].colors.primary} />
            )}
            label="Se déconnecter"
            onPress={() => signOut()}
            labelStyle={textStyle}
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
    flexDirection: "column",
  },
  title: {
    marginTop: 20,
    fontWeight: "900",
    fontFamily: "Marianne-ExtraBold",
    fontSize: 32,
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
});
