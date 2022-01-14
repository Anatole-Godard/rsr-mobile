import React from "react";
import {View, StyleSheet, Text} from "react-native";

export const Filters = ({name}: { name: string }) => {
    const [isSelected, setIsSelected] = React.useState(false);

    return (
        <View style={isSelected ? styles.containerSelected : styles.container} onTouchStart={() => setIsSelected(!isSelected)}>
            <Text style={isSelected ? {textAlign: 'center', color: '#fff'} : {textAlign: 'center'}}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignSelf: "center",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
        margin: 5,
    },
    containerSelected: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fe4a49',
        alignSelf: "center",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
        margin: 5,
    },
})