import React, {useState} from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import {useNavigation} from "@react-navigation/native";
import * as firebase from "firebase";
import Loading from "../Loading";

import { validateEmail } from "../../utils/validations";

export default function LoginForm(props){

    const { toastRef} = props; 
    const [showPassword, setshowPassword] = useState(false);
    const [formData, setformData] = useState(defaultFormValue());
    const [loading, setloading] = useState(false);
    const navigation = useNavigation();
    

    const onChange = (e, type) => {
        setformData ({ ...formData, [type]: e.nativeEvent.text })
    };

    const onSubmit = () => {
        if (isEmpty(formData.email || isEmpty(formData.password)) ) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if(!validateEmail(formData.email)){
            toastRef.current.show("El email no es correcto");
        } else {
            setloading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                setloading(false);
                navigation.navigate("account");
            })
            .catch(() =>{
                setloading(false);
                toastRef.current.show("Email o contraseña incorrecta");
            })
        }
    };

    return (
        <View style={style.formContainer}>
            <Input
                placeholder = "Correo Electrónico"
                containerStyle= {style.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon = {
                    <Icon
                        type="material-community"
                        name = "email-outline"
                        iconStyle={style.iconRight}
                    />
                }
            />
            <Input
                placeholder= "Contraseña"
                containerStyle={style.inputForm}
                onChange={(e) => onChange(e, "password")}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon = {
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={style.iconRight}
                        onPress= { () => setshowPassword (!showPassword)}
                    />
                }
            />
            <Button
                title="Iniciar sesión"
                containerStyle={style.btnContainerLogin}
                buttonStyle={style.btnLogin}
                onPress = {onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    )
}

function defaultFormValue(){
    return {
        email: "",
        password: "",

    };
}

const style= StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30, 

    },
    inputForm :{
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",

    },
    btnLogin : {
        backgroundColor: "#CF408C",
    },
    iconRight : {
        color: "#CF408C",
    }

})