import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Favorites from "../screens/Favorites";

const Stack = createStackNavigator();

export default function FavoritesStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Lugares favoritos"
                component={Favorites}
                optiond={ {title:"Locales Favoritos"} }
            />
        </Stack.Navigator>

    )
}