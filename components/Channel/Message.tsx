import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Message} from "@definitions/Message";

export type ChannelMessageProps = {
    message: Message
}

export const ChannelMessage = (props: ChannelMessageProps) => {

    const {message} = props;

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

    const isUser = () => {
        return user.data._id === message.user._id;
    }

    return (
        <>
            <View style={styles.container}>
                <View style={[isUser() ? styles.messageSent : styles.messageReceived]}>
                    <Text style={[isUser() ? styles.userMessageSent : styles.userMessageReceived]}>{isUser() ? "Me" : message.user.fullName}</Text>
                    <View style={[isUser() ? styles.messageSentBox : styles.messageReceivedBox]}>
                        <Text style={[isUser() ? styles.messageSentText : styles.messageReceivedText]}>{message.text}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageReceived: {
        alignSelf: "flex-start",
        maxWidth: 70 + "%"
    },
    messageSent: {
        flex: 1,
        flexDirection: "column",
        alignSelf: "flex-end",
    },
    messageReceivedBox: {
        backgroundColor: "#ddd",
        borderRadius: 5,
        padding: 8,
        margin: 10,
        alignSelf: "flex-start",
        maxWidth: 70 + "%"
    },
    messageSentBox: {
        flexDirection: "column",
        alignSelf: "flex-end",
        backgroundColor: "#42a5f5",
        borderRadius: 5,
        padding: 10,
        margin: 10,
        maxWidth: 70 + "%"
    },
    userMessageReceived: {
        fontWeight: "bold",
        color: "#aaa"
    },
    userMessageSent: {
        alignItems: "flex-end",
        fontWeight: "bold",
        color: "#2196f3",
    },
    messageReceivedText: {},
    messageSentText: {
        color: "white"
    },
});