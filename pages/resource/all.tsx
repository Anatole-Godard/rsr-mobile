import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  View,
} from "react-native";
import { useAuth } from "hooks/useAuth";
import { API_URL } from "constants/env";
import { Resource } from "types/Resource";
import { usePreferences } from "hooks/usePreferences";
import { useSearch } from "hooks/useSearch";
import { Searchbar } from "react-native-paper";
import { theme } from "core/theme";
import Paragraph from "components/ui/Paragraph";
import LottieView from "lottie-react-native";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resources/ResourceHome";
import { Separator } from "components/ui/Separator";
import { fetchRSR } from "utils/fetchRSR";

interface Props {
  navigation: Navigation;
}

export const ResourcesScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const [resources, setResources] = useState<Resource[]>([]);
  const { search, onChange, filtered } = useSearch("slug", resources);
  const [loading, setLoading] = useState(true);
  const fetchData = () => {
    setLoading(true);
    fetchRSR(API_URL + "/resource", user?.session)
      .then((res) => res.json())
      .then((body) => {
        setResources(body.data.attributes);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 256
      }}
    >
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128
        }}
        source={require("../../assets/lotties/empty.json")}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Oh! Il n'y a pas encore de ressources disponibles...
      </Paragraph>
      <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
        Peut-être avez-vous un problème de réseau ?
      </Paragraph>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={56}
    >
      <Searchbar
        placeholder='Rechercher une ressource...'
        onChangeText={onChange}
        value={search}
        style={{
          fontFamily: "Spectral",
          elevation: 0,
          backgroundColor: theme[colorScheme].colors.surface,
          borderRadius: 0
        }}
      />


      <FlatList
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          backgroundColor: theme[colorScheme].colors.background
        }}
        style={{
          backgroundColor: theme[colorScheme].colors.background,
          flex: 1
        }}
        data={filtered.map((resource) => ({
          ...resource,
          onPress: () =>
            props.navigation &&
            props.navigation.push("Details", {
              ...resource
            })
        }))}
        renderItem={({ item }) => <ResourceHome {...item} />}
        keyExtractor={(item: Resource) => item.slug.toString()}
        ItemSeparatorComponent={Separator}
        onRefresh={() => fetchData()}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchData()}
            title='Tirer pour rafraîchir'
            tintColor={
              theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
            }
            titleColor={
              theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
            }
          />
        }
      />
    </KeyboardAvoidingView>
  );
};
