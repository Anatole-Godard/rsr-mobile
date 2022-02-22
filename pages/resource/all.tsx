import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "hooks/useAuth";
import { API_URL } from "constants/env";
import { Resource } from "types/Resource";
import { usePreferences } from "hooks/usePreferences";
import { useSearch } from "hooks/useSearch";
import { Chip, Modal, Portal, Searchbar } from "react-native-paper";
import { theme } from "core/theme";
import Paragraph from "components/ui/Paragraph";
import LottieView from "lottie-react-native";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resources/ResourceHome";
import { Separator } from "components/ui/Separator";

interface Props {
  navigation: Navigation;
}

export const ResourcesScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();
  const [loading, setLoading] = useState<boolean>(true);

  const [resources, setResources] = useState<Resource[]>([]);
  const { search, onChange, filtered } = useSearch("slug", resources);
  const [filtersSelected, setFiltersSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const filters = [
    "Animaux",
    "Santé",
    "Education",
    "Environnement",
    "Sécurité",
    "Culture",
    "Sport",
    "Autre",
  ];

  const fetchData = () =>
    fetch(API_URL + "/resource")
      .then((res) => res.json())
      .then((body) => setResources(body.data.attributes));

  useEffect(() => {
    fetchData();
  }, []);

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 256,
      }}
    >
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128,
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
      behavior="padding"
      keyboardVerticalOffset={56}
    >
      <Searchbar
        placeholder="Rechercher une ressource..."
        onChangeText={onChange}
        value={search}
        style={{
          fontFamily: "Spectral",
          elevation: 0,
          backgroundColor: theme[colorScheme].colors.surface,
          borderRadius: 0,
        }}
      />

      

      <FlatList
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          backgroundColor: theme[colorScheme].colors.background,
        }}
        style={{
          backgroundColor: theme[colorScheme].colors.background,
          flex: 1,
        }}
        data={filtered.map((resource) => ({
          ...resource,
          onPress: () =>
            props.navigation &&
            props.navigation.push("Details", {
              ...resource,
            }),
        }))}
        renderItem={({ item }) => <ResourceHome {...item} />}
        keyExtractor={(item: Resource) => item.slug.toString()}
        ItemSeparatorComponent={Separator}
        // onRefresh={() => fetchData()}
        // refreshing={loading}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading}
        //     onRefresh={() => fetchData()}
        //     title="Tirer pour rafraîchir"
        //     tintColor={
        //       theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
        //     }
        //     titleColor={
        //       theme[colorScheme === "dark" ? "light" : "dark"].colors.surface
        //     }
        //   />
        // }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
