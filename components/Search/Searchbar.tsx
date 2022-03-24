import React from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {SearchIcon} from "react-native-heroicons/outline";

export const Searchbar = () => {
    const [term, setTerm] = React.useState<string | null>("");
    return (
        <View style={styles.container}>
            <SearchIcon size={20} color={"#ccc"}/>
            <TextInput placeholder={"Search"} placeholderTextColor={"#ccc"} underlineColorAndroid={"#fff"}
                       autoCorrect={false} onChangeText={(input) => setTerm(input)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        width: 90 + "%",
        borderRadius: 20,
    },
})