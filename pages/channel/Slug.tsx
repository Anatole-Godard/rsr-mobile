import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList, TextInput, Button} from "react-native";
import {ChannelMessage} from "pages/channel/Message";
import {InputZone} from "pages/channel/InputZone";
import {Message} from "@definitions/Message";
import io, {Socket} from "socket.io-client";

const socket = io("http://192.168.0.28:3000")

export const ChannelSlug = () => {
    const [chat, setChat] = useState<Message[]>([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetch('http://192.168.0.28:3000/api/channel/slug/socket').finally(() => {
            if (socket) {
                socket.once('connect', () => {
                    console.log('Connection')
                })

                socket.on('notification', (message) => {
                    console.log(message)
                })

                socket.on('res-new-message', (message: string) => {
                    console.log("New user message: " + message)
                })

                socket.on('get-messages', (messages: Message[]) => {
                    setChat(messages);
                })

                return () => {
                    socket.off('connect');
                };
            }
        })
    }, [])

    const sendMsg = () => {
        console.log("Sending msg...")
        console.log(socket.connected)
        if (socket.connected) {
            socket.emit('new-message', msg)
            setMsg("");
        }
        socket.emit('refresh-chat');
    }

    return (
        //TODO: Hide btn + on this view ?
        <View style={styles.container}>
            <View style={styles.chatZone}>
                <FlatList data={chat} renderItem={({item}) => <ChannelMessage message={item}/>}/>
            </View>
            <View style={styles.inputZone}>
                <View style={styles.mainContainer}>
                    <TextInput style={styles.input} onChangeText={msg => setMsg(msg)}/>
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
