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
            <Text>{message.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});