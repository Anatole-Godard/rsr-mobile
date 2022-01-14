import React from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, GestureResponderEvent} from "react-native";
import {ChannelListItem} from "components/Channel/ListItem";
import {ChannelSlug} from "@pages/channel/Slug";

export const ChannelList = () => {
    const DATA = [
        {
            id: "1",
            name: "Channel 1",
            lastMessage: "Last message received/sent",
            read: true,
            timestamp: "30min",
            picture: "blue",
        },
        {
            id: "2",
            name: "Channel 2",
            lastMessage: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aut cum ducimus eos eveniet nihil quae sapiente sit soluta tempore? Eos fuga id nulla odit sequi? Aliquam officiis reprehenderit voluptate?",
            read: true,
            timestamp: "5j",
            picture: "red",
        },
        {
            id: "3",
            name: "Channel 3 (groupe)",
            lastMessage: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aut cum ducimus eos eveniet nihil quae sapiente sit soluta tempore? Eos fuga id nulla odit sequi? Aliquam officiis reprehenderit voluptate?",
            read: true,
            timestamp: "10j",
            picture: "green",
        }
    ]

    return (
        // TODO: uncomment, <ChannelSlug/> is only for developing socket feature while navigation isn't ready
        <FlatList style={styles.container} data={DATA} renderItem={({item}) => <ChannelListItem key={item.id} chatRoom={item}/>} keyExtractor={(item) => item.id}/>
        // <ChannelSlug/>
    );
};

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
