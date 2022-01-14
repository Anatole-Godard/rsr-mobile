import React from "react";
import {View, StyleSheet, Text} from "react-native";

export const Categories = ({name}: { name: string }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    name: {
        fontSize: 15,
        fontWeight: "normal",
        color: "#8f8e93"
    },
    container: {
        padding: 10,
    },
})