import React, {useEffect, useState} from "react";
import { View, Text } from "react-native";
import {fetchRSR} from "utils/fetchRSR";

export const ResourcesScreen = () => {
    const [resources, setResources] = useState([]);

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
            setResources(body)
        })
    }, [])

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>{JSON.stringify(resources)}</Text>
        </View>
    )
}