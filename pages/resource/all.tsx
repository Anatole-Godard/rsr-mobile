import React, {useEffect, useState} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import {fetchRSR} from "utils/fetchRSR";
import {ResourceCard} from "components/Resources/Resource";
import Collapsible from 'react-native-collapsible';
import {ChevronRightIcon} from "react-native-heroicons/outline";

export const ResourcesScreen = () => {
    const [resources, setResources] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const returnCategory = (title:string) => {
        return (
            <View>
                <View style={styles.category}>
                    <ChevronRightIcon size={25} style={isCollapsed ? styles.icon : styles.iconRotated}
                                      onPress={() => setIsCollapsed(!isCollapsed)}/>
                    <Text style={styles.title} onPress={() => setIsCollapsed(!isCollapsed)}>{title}</Text>
                </View>
                <Collapsible collapsed={isCollapsed}>
                    {resources.map((resource) => {
                        console.log(resource)
                        return <ResourceCard resource={resource} key={resource.id}/>
                    })}
                </Collapsible>
            </View>
        )
    }

    return (
        <ScrollView style={{flex: 1}}>
            {returnCategory("Top Resources")}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
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
        marginTop: 20
    }
})