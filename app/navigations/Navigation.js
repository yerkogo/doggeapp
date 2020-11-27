import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LocalesStack from "./LocalesStack";
import FavoritesStack from "./FavoritesStack";
import TopStack from "./TopStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
import { Icon } from "react-native-elements";






const Tab =createBottomTabNavigator();

export default function Navigation(){
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName="locals"
            tabBarOptions={{
                inactiveTintColor: "#646464",
                activeTintColor: "#CF408C"
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),

            })}
            >
                
                <Tab.Screen 
                name="locals" 
                component={LocalesStack} 
                options={{ title:"Lugares"} } 
                />
                <Tab.Screen 
                name="favorites" 
                component={FavoritesStack}
                options={{ title:"Favoritos"} }  
                />
                <Tab.Screen 
                name="top" 
                component={TopStack}
                options={{ title:"Top"} }  
                />
                <Tab.Screen 
                name="search" 
                component={SearchStack}
                options={{ title:"Buscar"} }  
                />
                <Tab.Screen 
                name="account" 
                component={AccountStack}
                options={{ title:"Cuenta"} }  
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function screenOptions (route, color){
    let iconName;
    
    switch (route.name) {
        case "locals":
            iconName ="compass-outline";
            
            break;
        case "favorites":
            iconName ="heart-outline";
                
            break;
        case "top":
            iconName ="star-outline";
                            
            break;
        case "search":
            iconName ="magnify";
            
            break;
        case "account":
            iconName ="account";
            
            break;        
        default:
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    );
}