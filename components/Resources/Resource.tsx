import React from "react";
import {Dimensions, StyleSheet, Text, View, Image} from "react-native";
import { AppleHeader } from "@freakycoder/react-native-header-view";
import moment from "moment";

export const ResourceCard = ({resource}) => {
    const date = moment(resource.date).format('dddd, DD MMMM YYYY').toUpperCase();
    return (
        <View style={styles.container}>
            <AppleHeader
            dateTitle={date}
            largeTitle={resource.data.attributes.name}
            />
            <Text style={styles.description}>{resource.description}</Text>
            <Image source={{uri: resource.photoURL}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 30,
        marginLeft: 30,
        marginTop: 15,
        marginBottom: 15,
        padding: 20,
        backgroundColor: "#fff",
        minHeight: 0,
        borderRadius: 10
    },
    description: {
        fontSize: 15,
        fontWeight: "normal",
        color: "#000",
        padding: 20
    }
});