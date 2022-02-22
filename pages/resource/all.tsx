import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
// import { fetchRSR } from "utils/fetchRSR";
// import { ResourceCard } from "components/Resources/Resource";
// import Collapsible from "react-native-collapsible";
// import { ChevronRightIcon } from "react-native-heroicons/outline";
// import { Filters } from "components/Search/Filters";
// import { Categories } from "components/Resources/Categories";
import { useAuth } from "hooks/useAuth";
import { API_URL } from "constants/env";
import { Resource } from "types/Resource";
import { usePreferences } from "hooks/usePreferences";
import { useSearch } from "hooks/useSearch";
import { Chip, Searchbar } from "react-native-paper";
import { theme } from "core/theme";
import Paragraph from "components/ui/Paragraph";
import LottieView from "lottie-react-native";
import { Navigation } from "types/Navigation";
import { ResourceHome } from "components/Resources/ResourceHome";

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

  //   const [isSearchbarDisplayed, setIsSearchbarDisplayed] = useState(true);
  //   const [areFiltersDisplayed, setAreFiltersDisplayed] = useState(false);

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
        data={filters}
        renderItem={({ item }: { item: string }) => (
          <Chip
            icon="information"
            children={item}
            onPress={() => {
              if (filtersSelected.includes(item)) {
                setFiltersSelected(
                  filtersSelected.filter((filter) => filter !== item)
                );
              } else {
                setFiltersSelected([...filtersSelected, item]);
              }
            }}
          />
        )}
        keyExtractor={(item) => item}
        horizontal
        style={{
            width: "100%",
            flex:1,
          marginBottom: 16,
        }}
      />

      <FlatList
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          backgroundColor: theme[colorScheme].colors.background,
        }}
        style={{ backgroundColor: theme[colorScheme].colors.background }}
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
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth }} />
        )}
        onRefresh={() => fetchData()}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchData()}
            title="Tirer pour rafraîchir"
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

//   const returnCategory = (title: string) => {
//     return (
//       <View style={styles.container}>
//         <View style={{ width: "20%" }}>
//           <View style={styles.categoryContainer}>
//             <View style={styles.card}>
//               <Text style={styles.title}>Categories</Text>
//               {categories.map((e, i) => {
//                 return <Categories key={i} name={e} />;
//               })}
//             </View>
//           </View>
//         </View>
//         <ScrollView style={{ width: "80%" }}>
//           <View
//             style={
//               isSearchbarDisplayed
//                 ? { display: undefined }
//                 : { display: "none" }
//             }
//           >
//             <Searchbar />
//             <View>
//               <View style={styles.displayFilters}>
//                 <ChevronRightIcon
//                   size={15}
//                   style={areFiltersDisplayed ? styles.icon : styles.iconRotated}
//                   onPress={() => setAreFiltersDisplayed(!areFiltersDisplayed)}
//                 />
//                 <Text
//                   onPress={() => setAreFiltersDisplayed(!areFiltersDisplayed)}
//                 >
//                   Filters
//                 </Text>
//               </View>
//               <Collapsible
//                 style={styles.filters}
//                 collapsed={areFiltersDisplayed}
//               >
//                 {filters.map((e, i) => {
//                   return <Filters key={i} name={e} />;
//                 })}
//               </Collapsible>
//             </View>
//           </View>
//           {/*<View style={styles.category}>*/}
//           {/*    <ChevronRightIcon size={25} style={isCollapsed ? styles.icon : styles.iconRotated}*/}
//           {/*                      onPress={() => setIsCollapsed(!isCollapsed)}/>*/}
//           {/*    <Text style={styles.title} onPress={() => setIsCollapsed(!isCollapsed)}>{title}</Text>*/}
//           {/*</View>*/}
//           <View>
//             {resources.map((resource) => {
//               return <ResourceCard resource={resource} key={resource.id} />;
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     );
//   };
//   return <View style={{ flex: 1 }}>{returnCategory("Top Resources")}</View>;

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   icon: {
//     color: "#000",
//     marginRight: 10,
//   },
//   iconRotated: {
//     color: "#000",
//     marginRight: 10,
//     transform: [{ rotate: "90deg" }],
//   },
//   category: {
//     flex: 1,
//     flexDirection: "row",
//     marginLeft: 30,
//     marginTop: 20,
//   },
//   filters: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignSelf: "center",
//     width: "90%",
//   },
//   displayFilters: {
//     flex: 1,
//     flexDirection: "row",
//     alignSelf: "flex-start",
//     justifyContent: "center",
//     marginLeft: 50,
//     paddingBottom: 10,
//   },
//   container: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   categoryContainer: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     margin: 10,
//     borderRadius: 10,
//   },
// });
