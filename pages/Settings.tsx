import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  BellIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SupportIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { Navigation } from "types/Navigation";

interface Props {
  navigation: Navigation;
}

export const SettingsScreen = (props: Props) => {
  const theme = useTheme();
  const { sendNotificationImmediately } = usePreferences();
  const { user } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <ListItem
        icon={<UserIcon size={32} color={theme.colors.text} />}
        label="Votre compte"
        description="Affichez les informations de votre compte, téléchargez une archive de vos données et découvrez les options de désactivation de votre compte."
      />
      <ListItem
        icon={<LockClosedIcon size={32} color={theme.colors.text} />}
        label="Sécurité et accès au compte"
        description="Gérez la sécurité de votre compte et assurez le suivi de son utilisation, notamment des applications qui y sont connectés."
      />
      <ListItem
        icon={<ShieldCheckIcon size={32} color={theme.colors.text} />}
        label="Confidentialité et sécurité"
        description="Gérez les informations que vous voyez et partagez sur RSR."
      />
      <ListItem
        icon={<BellIcon size={32} color={theme.colors.text} />}
        label="Notifications"
        description="Sélectionnez les types de notifications que vous recevez sur vos activités, centres d'intérêts et recommandations."
        onPress={() => {
          // Alert.alert("Notifications");
          sendNotificationImmediately({
            body:
              user.data.fullName +
              ", vous avez activé une fonctionnalité secrète ✨",
          });
        }}
      />
      <ListItem
        icon={<SupportIcon size={32} color={theme.colors.text} />}
        label="Accessibilité, affichage et langues"
        onPress={() => props.navigation.navigate("SettingsDisplay")}
        description="Gérez la manière dont le contenu RSR vous est affiché, la langue que vous utilisez et la façon dont vous voulez que les autres utilisateurs de RSR vous contactent."
        last
      />
    </View>
  );
};

const ListItem = ({
  icon,
  label,
  description,
  last = false,
  onPress,
}: {
  icon: JSX.Element;
  label: string;
  description: string;
  last?: boolean;
  onPress?: () => void;
}) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      style={{
        paddingTop: 16,
        paddingBottom: 16,
        minHeight: 112,
        borderBottomWidth: !last ? StyleSheet.hairlineWidth : 0,
        borderBottomColor: theme.colors.text,
      }}
      onPress={onPress ? () => onPress() : null}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {icon}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              fontFamily: "Marianne-Bold",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            {label}
          </Text>
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              width: 80,
              marginBottom: 8,
            }}
          ></View>
          <Text style={{ fontFamily: "Spectral", fontSize: 13 }}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
