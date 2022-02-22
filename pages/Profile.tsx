import React, { useEffect, useState } from "react";

import { API_URL, HOST_URL } from "constants/env";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { Navigation } from "types/Navigation";
import { UserMinimum } from "types/User";
import { colors, theme as core } from "core/theme";

interface Props {
  navigation: Navigation;
  route: { params: UserMinimum };
}

import { Dimensions } from "react-native";
import { useAuth } from "hooks/useAuth";
import {
  ExclamationIcon,
  PencilIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import { usePreferences } from "hooks/usePreferences";
import { Resource } from "types/Resource";
import { fetchRSR } from "utils/fetchRSR";
import { ResourceHome } from "components/Resources/ResourceHome";

export const ProfileScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();
  const { fullName, photoURL, uid } = props.route.params;

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRSR(API_URL + "/resource", user?.session)
      .then((res) => res.json())
      .then((body) => {
        setLoading(false);
        setResources(
          body.data.attributes.filter((r: Resource) => r.owner.uid === uid)
        );
      });
  }, [user]);
  const theme = useTheme();
  return (
    <View style={{ height: Dimensions.get("screen").height / 3, flex: 1 }}>
      <ImageBackground
        source={{ uri: HOST_URL + photoURL }}
        style={{ width: "100%" }}
        blurRadius={64}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0, 0.60)",
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: uid === user.data.uid ? "flex-end" : "flex-start",
              width: "100%",
              height: 32,
            }}
          >
            {uid === user.data.uid ? (
              <TouchableOpacity style={styles.button}>
                <PencilIcon size={16} color={core.dark.colors.text} />
                <Text style={{ color: core.dark.colors.text, marginLeft: 3 }}>
                  Éditer
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button}>
                <ExclamationIcon size={16} color={core.dark.colors.text} />
                <Text style={{ color: core.dark.colors.text, marginLeft: 3 }}>
                  Signaler
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Avatar.Image source={{ uri: HOST_URL + photoURL }} size={96} />
            <Text
              style={{
                fontFamily: "Marianne-Bold",
                fontSize: 24,
                color: core.dark.colors.text,
                marginTop: 12,
              }}
            >
              {fullName}
            </Text>
          </View>
          <View
            style={{
              height: 32,
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            {uid !== user.data.uid && (
              <TouchableOpacity style={styles.button} disabled>
                <PlusCircleIcon size={16} color={core.dark.colors.text} />
                <Text style={{ color: core.dark.colors.text, marginLeft: 3 }}>
                  Suivre (prochainement)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          ...styles.statWrapper,
          backgroundColor: theme.colors.background,
          borderColor:
            colorScheme === "dark"
              ? colors.trueGray[700]
              : colors.trueGray[300],
        }}
      >
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>
            {user.data.followers?.length || "0"}
          </Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>
            {user.data.following?.length || "0"}
          </Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statNumber}>
            {user.data.resources?.length || "0"}
          </Text>
          <Text style={styles.statLabel}>Ressources</Text>
        </View>
      </View>
      <FlatList
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        refreshing={loading}
        data={resources}
        renderItem={({ item }) => (
          <ResourceHome
            {...item}
            onPress={() => props.navigation.push("Details", item)}
          />
        )}
        keyExtractor={(item) => item.slug}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderColor: core.light.colors.surface,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statNumber: { fontFamily: "Marianne-Bold", fontSize: 16 },
  statLabel: { fontFamily: "Spectral", fontSize: 12 },
  statContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  statWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
