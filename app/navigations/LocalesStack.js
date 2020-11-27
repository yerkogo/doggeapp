import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Locales from "../screens/Locals/Locales";
import AddLocals from "../screens/Locals/AddLocals";
import Local from "../screens/Locals/Local";
import AddReviewLocal from "../screens/Locals/AddReviewLocal";

const Stack = createStackNavigator();

export default function LocalesStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Locales"
                component={Locales}
                options={ {title:"Lugares"} }
            />
            <Stack.Screen 
                name="add-locals"
                component={AddLocals}
                options={ { title: "Añadir Nuevo Lugar "}}
            />
            <Stack.Screen
                name="local"
                component={Local}
                
            />
            <Stack.Screen 
                name="add-review-local"
                component={AddReviewLocal}
                options={{ title: "Nuevo comentario" }}
            
            />
        </Stack.Navigator>

    )
}