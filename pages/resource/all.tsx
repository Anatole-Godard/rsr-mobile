import React, {useEffect, useState} from "react";
import { View, Text } from "react-native";

export const ResourcesScreen = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetch("http://172.20.10.8:3000/api/resource/all").then((res) => {
            res.json();
        }).then((body) => {
            console.log(body)
        })
    }, [])
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Resources catalog Screen</Text>
        </View>
    )
}