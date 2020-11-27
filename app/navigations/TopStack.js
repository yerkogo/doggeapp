import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Top from "../screens/Top";

const Stack = createStackNavigator();

export default function TopStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Top"
                component={Top}
                optiond={ {title:"Top"} }
            />
        </Stack.Navigator>

    )
}