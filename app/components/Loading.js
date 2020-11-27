import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props){
    const {isVisible, text} = props;

    return(
        <Overlay 
        isVisible={isVisible}
        windowBackgroundColor="rgba(0, 0, 0, 0.5)"
        overlayBackgroundColor= "transparent"
        overlayStyle={style.overlay}
        >
            <View style={style.view}>
                <ActivityIndicator size="large" color="#CF408C"/>
                {text && <Text style={style.text}>{text}</Text>}
            </View>
        </Overlay>
    );
}

const style = StyleSheet.create({
    overlay:{
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 10,
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#CF408C",
        textTransform: "uppercase",
        marginTop: 10,

    }
});