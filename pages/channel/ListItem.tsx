import React, {useEffect} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, GestureResponderEvent} from "react-native";
import {useNavigation} from "@react-navigation/native";

export const ChannelListItem = ({chatRoom}) => {

    const nav = useNavigation();

    const displayChannel = (id: string) => {
        console.log("channel " + id);
        nav.navigate({
            key: "ChannelSlug",
            name: "ChannelSlug",
            params: {
                title: chatRoom.name
            }
        });
    }

    return (
        <TouchableOpacity style={styles.channel} key={chatRoom.id} onPress={() => displayChannel(chatRoom.id)}>
            <View style={styles.pictureContainer}>
                <View style={[styles.channelPicture, {backgroundColor: chatRoom.picture}]}/>
            </View>
            <View style={styles.channelInfos}>
                <Text style={styles.channelName}>{chatRoom.name}</Text>
                <Text numberOfLines={2} style={styles.channelLastMessage}>{chatRoom.lastMessage}</Text>
            </View>
            <View style={styles.timestampContainer}>
                <Text style={styles.channelLastMessageTimestamp}>{chatRoom.timestamp}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    channel: {
        flexDirection: "row",
        padding: 1,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0"
    },
    pictureContainer: {
    },
    channelPicture: {
        width: 44,
        marginRight: 15,
        height: 44,
        borderRadius: 44 / 2,
    },
    channelInfos: {
        width: 80 + "%",
        marginBottom: 10,
    },
    channelName: {
        fontSize: 18,
        fontWeight: "600"
    },
    channelLastMessage: {
        maxWidth: 90 + "%",
        color: "#9e9e9e",
        marginBottom: 5,
    },
    channelLastMessageTimestamp: {
        justifyContent: "flex-end",
    },
    timestampContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
});