import React from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, GestureResponderEvent} from "react-native";
import {grey500} from "react-native-paper/lib/typescript/styles/colors";
import {ChatRoom} from "@definitions/Channel";
import {useNavigation} from "@react-navigation/native";

export type ChatListItemProps = {
    chatRoom: ChatRoom
}

export const ChannelListItem = (props: ChatListItemProps) => {
    const {chatRoom} = props;

    const displayChannel = (id: string) => {
        console.log("channel " + id);
        // TODO: Navigation
    }

    const nav = useNavigation();

    return (
        <TouchableOpacity style={styles.channel} key={chatRoom.id} onPress={() => displayChannel(chatRoom.id)}>
            <View style={[styles.channelPicture, {backgroundColor: chatRoom.picture}]}/>
            <View style={styles.channelInfos}>
                <Text style={styles.channelName}>{chatRoom.name}</Text>
                <Text numberOfLines={2} style={styles.channelLastMessage}>{chatRoom.lastMessage}</Text>
            </View>
            <Text style={styles.channelLastMessageTimestamp}>{chatRoom.timestamp}</Text>
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
    channelLastMessageTimestamp: {}
});