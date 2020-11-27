import React, {useState, useEffect, useRef} from "react";
import {View, Text} from "react-native";
import Toast from "react-native-easy-toast";

import {firebaseApp} from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListTopLocals from "../components/Ranking/ListTopLocals";

const db = firebase.firestore(firebaseApp);

export default function Top(props){
    const { navigation }= props;
    const [locals, setLocals] = useState([])
    const toastRef = useRef()

    

    useEffect(() => {
        db.collection("locals")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then((response) =>{
            const localArray = [];

            response.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                localArray.push(data);

            })
            setLocals(localArray);
        })
    }, [])


    return(
        <View>
            <ListTopLocals  locals={locals} navigation={navigation}/>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
    );
}