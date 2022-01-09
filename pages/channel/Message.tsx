import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Message} from "@definitions/Message";

export type ChannelMessageProps = {
    message: Message
}

export const ChannelMessage = (props: ChannelMessageProps) => {

    const {message} = props;

    return (
        <View style={styles.container}>
            <View style={[message.user.uid === "1234567890" ? styles.messageSent : styles.messageReceived]}>
                <Text style={[message.user.uid === "1234567890" ? styles.messageSentText : styles.messageReceivedText]}>{message.text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageReceived: {
        flexDirection: "row",
        backgroundColor: "#ddd",
        borderRadius: 5,
        padding: 8,
        margin: 10,
        width: 70 + "%"
    },
    messageSent: {
        flexDirection: "column",
        alignSelf: "flex-end",
        backgroundColor: "#42a5f5",
        borderRadius: 5,
        padding: 10,
        margin: 10,
        width: 70 + "%"
    },
    messageReceivedText: {
    },
    messageSentText: {
        color: "white"
    },
});