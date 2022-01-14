import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList, TextInput, Button} from "react-native";
import {ChannelMessage} from "components/Channel/Message";
import {Message} from "@definitions/Message";
import io from "socket.io-client";

export const ChannelSlug = () => {
    const [chat, setChat] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");

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

    useEffect((): any => {
        const socket = io("http://172.20.10.8:3000", {
            path: "/api/channel/[slug]/socket",
        });

        fetch("http://172.20.10.8:3000/api/channel/"+ "general" +"/all").then((res) => {
            return res.json()
        }).then((body) => setChat(body))

        socket.on("connect", () => {
            console.log("SOCKET CONNECTED!", socket.id);
        });

        // update chat on new message dispatched
        socket.on("message", (message: Message) => {
            // chat.push(message);
            setChat(oldChat =>[...oldChat, message]);
        });

        if (socket) return () => socket.disconnect();

    }, []);

    const sendMsg = async () => {
        const msg: Message = {
            user: user.data,
            text: message,
            attachment: null,
            channel: "general",
        };

        const resp = await fetch("http://172.20.10.8:3000/api/channel/"+ "general" +"/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(msg),
        });
        if (resp.ok) setMessage("");
    }

    return (
        //TODO: Hide btn + on this view ?
        <View style={styles.container}>
            <View style={styles.chatZone}>
                <FlatList data={chat} renderItem={({item}) => <ChannelMessage key={item.id} message={item}/>}/>
            </View>
            <View style={styles.inputZone}>
                <View style={styles.mainContainer}>
                    <TextInput style={styles.input} value={message} onChangeText={msg => setMessage(msg)}/>
                    <Button onPress={sendMsg} title="Send"/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    chatZone: {
        flex: 1,
    },
    inputZone: {
        flexDirection: "row",
        margin: 10,
        justifyContent: "flex-end",
    },
    mainContainer: {
        backgroundColor: "white",
        flex: 1,
        padding: 10,
        flexDirection: "row",
        borderRadius: 50,
        marginRight: 10,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
    }
});
