import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/Account/LoginForm";


export default function Login (){
    const toastRef= useRef();
    
    return(
        <ScrollView>
            <Image
                source={require("../../../assets/img/doggelogo.png")}
                resizeMode="contain"
                style={styles.logo} 
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef}/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
            <Text> Social Login</Text>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </ScrollView>
    );

}

function CreateAccount(){

    const navigation = useNavigation();
    console.log(navigation);

    return (
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{" "}
            
            <Text
             style={styles.btnRegister}
             onPress={()=> navigation.navigate("register")}
             >Regístrate
            </Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    logo:{
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop:15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister:{
        color: "#CF408C",
        fontWeight:"bold",
    } ,
    divider:{
        backgroundColor: "#CF408C",
        margin: 40,


    }

});
