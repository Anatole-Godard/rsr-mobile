import React, {useEffect, useState} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import {fetchRSR} from "utils/fetchRSR";
import {ResourceCard} from "components/Resources/Resource";
import Collapsible from 'react-native-collapsible';
import {ChevronRightIcon} from "react-native-heroicons/outline";
import {Searchbar} from "components/Search/Searchbar";
import {Filters} from "components/Search/Filters";
import {Categories} from "components/Resources/Categories";

export const ResourcesScreen = () => {
    const [resources, setResources] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSearchbarDisplayed, setIsSearchbarDisplayed] = useState(true);
    const [areFiltersDisplayed, setAreFiltersDisplayed] = useState(false);

    const filters = ["Animaux", "Santé", "Education", "Environnement", "Sécurité", "Culture", "Sport", "Autre"];
    const categories = ["Animaux", "Santé", "Education", "Environnement", "Sécurité", "Culture", "Sport", "Autre"];

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

    useEffect(() => {
        fetchRSR("http://172.20.10.8:3000/api/resource/all", user).then((res) => {
            return res.json();
        }).then((body) => {
            setResources(body.data.attributes)
        })
    }, [])

    const returnCategory = (title: string) => {
        return (
            <View style={styles.container}>
                <View style={{width: "20%"}}>
                    <View style={styles.categoryContainer}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Categories</Text>
                            {categories.map((e, i) => {
                                return (<Categories key={i} name={e}/>)
                            })}
                        </View>
                    </View>
                </View>
                <ScrollView style={{width: "80%"}}>
                    <View style={isSearchbarDisplayed ? {display: undefined} : {display: 'none'}}>
                        <Searchbar/>
                        <View>
                            <View style={styles.displayFilters}>
                                <ChevronRightIcon size={15}
                                                  style={areFiltersDisplayed ? styles.icon : styles.iconRotated}
                                                  onPress={() => setAreFiltersDisplayed(!areFiltersDisplayed)}/>
                                <Text onPress={() => setAreFiltersDisplayed(!areFiltersDisplayed)}>Filters</Text>
                            </View>
                            <Collapsible style={styles.filters} collapsed={areFiltersDisplayed}>
                                {filters.map((e, i) => {
                                    return (
                                        <Filters key={i} name={e}/>
                                    )
                                })}
                            </Collapsible>
                        </View>
                    </View>
                    {/*<View style={styles.category}>*/}
                    {/*    <ChevronRightIcon size={25} style={isCollapsed ? styles.icon : styles.iconRotated}*/}
                    {/*                      onPress={() => setIsCollapsed(!isCollapsed)}/>*/}
                    {/*    <Text style={styles.title} onPress={() => setIsCollapsed(!isCollapsed)}>{title}</Text>*/}
                    {/*</View>*/}
                    <View>
                        {resources.map((resource) => {
                            return <ResourceCard resource={resource} key={resource.id}/>
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            {returnCategory("Top Resources")}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    icon: {
        color: "#000",
        marginRight: 10,
    },
    iconRotated: {
        color: "#000",
        marginRight: 10,
        transform: [{rotate: '90deg'}]
    },
    category: {
        flex: 1,
        flexDirection: "row",
        marginLeft: 30,
        marginTop: 20,
    },
    filters: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignSelf: "center",
        width: "90%",
    },
    displayFilters: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "center",
        marginLeft: 50,
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        flexDirection: "row",
    },
    categoryContainer: {
        flex: 1,
        flexDirection: "column",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        margin: 10,
        borderRadius: 10
    },
})