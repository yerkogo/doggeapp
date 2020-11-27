import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

export default function UserLogged(){   
    const [userInfo, setuserInfo] = useState(null);
    const [loading, setloading] = useState(false);
    const [loadingText, setloadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);
    const toastRef= useRef();

    useEffect(() => {
       (async () => {
           const user = await firebase.auth().currentUser;
           setuserInfo(user);
       })() ;    
       setReloadUserInfo(false); 
    }, [reloadUserInfo]);

    return(
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            userInfo={userInfo} 
                            toastRef ={toastRef}
                            setloading={setloading}
                            setloadingText={setloadingText}
                            /> }
            
            
            <AccountOptions 
                userInfo={userInfo} 
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo}    
            />

            <Button 
                title ="Cerrar sesión"
                buttonStyle={styles.btnCloseSesion}
                titleStyle={styles.btnCloseSesionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity= {0.9} />
            <Loading text ={loadingText} isVisible ={loading} />
        </View>
    );
}

const styles = StyleSheet.create ({
    viewUserInfo : { 
      minHeight : "100%",
      backgroundColor : "#f2f2f2",  
    },

    btnCloseSesion : {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSesionText : {
        color : "#CF408C",
    },
});