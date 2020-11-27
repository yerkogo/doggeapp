import React, {useState} from 'react';
import { StyleSheet, View,   } from "react-native";
import { ListItem } from "react-native-elements";
import {map} from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";



export default function AccountOptions(props){
    const {userInfo, toastRef, setReloadUserInfo} = props;
    const [showModal, setshowModal] = useState(false);

    const [renderComponent, setrenderComponent] = useState(null);

    
    const selectedComponent  = (key)=>{
        switch (key) {
            case "displayName":
                setrenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setshowModal={setshowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setshowModal(true);
                break;
            case "email":
                setrenderComponent(
                    <ChangeEmailForm 
                        email ={userInfo.email}
                        setshowModal={setshowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setshowModal(true);
                break;
            case "password":

                setrenderComponent(
                    <ChangePasswordForm setshowModal={setshowModal} toastRef={toastRef}/>
                );
                setshowModal(true);

                break;    

            default:
                setrenderComponent(null);
                setshowModal(false);
                break;
        }
    };
    const menuOptions = generateOptions(selectedComponent);

    
    return (
        <View>
            {map (menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRigth,
                        color: menu.iconColorRight,

                    }}
                    containerStyle = {styles.menuItem}
                    onPress ={menu.onPress}
                />
            ))}

            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setshowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
}

function generateOptions (selectedComponent){
    return[
        {
            title:"Cambiar nombre y apellido",
            iconType : "material-community",
            iconNameLeft : "account-circle",
            iconColorLeft : "#ccc",
            iconNameRigth: "chevron-right",
            iconColorRight: "#ccc",
            onPress : () => selectedComponent("displayName")
        },
        {
            title:"Cambiar Email",
            iconType : "material-community",
            iconNameLeft : "at",
            iconColorLeft : "#ccc",
            iconNameRigth: "chevron-right",
            iconColorRight: "#ccc",
            onPress : () => selectedComponent("email")
        },
        {
            title:"Cambiar Contraseña",
            iconType : "material-community",
            iconNameLeft : "lock-reset",
            iconColorLeft : "#ccc",
            iconNameRigth: "chevron-right",
            iconColorRight: "#ccc",
            onPress : () => selectedComponent("password")
        },
    ]

}


const styles = StyleSheet.create({
    menuItem : {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",

    }

});
