import React, {useState, useEffect, useCallback} from "react";
import { StyleSheet, View, Text} from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import { useFocusEffect } from '@react-navigation/native';
import firebase from "firebase/app";
import "firebase/firestore";
import ListLocals from "../../components/Locals/ListLocals";

const db = firebase.firestore(firebaseApp);

export default function Locales(props){
    const { navigation } = props;
    const [user, setUser] = useState(null)
    const [locals, setLocals] = useState([]);
    const [totalLocals, setTotalLocals] = useState(0);
    const [startLocals, setStartLocals] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitLocals = 10;

    
    
    useEffect(() => {
        
        firebase.auth().onAuthStateChanged((userInfo) => {
            console.log(userInfo);
            setUser(userInfo);
        });
    }, []);

    useFocusEffect(
        useCallback(()=>{
            db.collection("locals").get().then((snap) => {
                setTotalLocals(snap.size)
    
            })
    
            const resultLocals = [];
    
            db.collection("locals")
            .orderBy("createAt" , "desc")
            .limit(limitLocals)
            .get()
            .then((response) => {
                setStartLocals(response.docs[response.docs.length - 1]);
    
                response.forEach((doc) =>{
                    const local = doc.data();
                    local.id = doc.id;
                    resultLocals.push(local);
                });
                setLocals(resultLocals);
            });
        }, [])
    );



    const handleLoadMore = () => {
         const resultLocals = [];
         locals.length < totalLocals && setIsLoading(true);

         db.collection("locals")
            .orderBy("createAt", "desc")
            .startAfter(startLocals.data().createAt)
            .limit(limitLocals)
            .get()
            .then((response) =>{
                if(response.docs.length > 0){
                    setStartLocals(response.docs[response.docs.length -1 ]);
                } else{
                    setIsLoading(false);
                }

                response.forEach((doc)=>{
                    const local = doc.data();
                    local.id = doc.id;
                    resultLocals.push( local );
                });

                setLocals([...locals, ...resultLocals]);

            })
    }


    return(
        <View style={styles.viewBody}>
            <ListLocals
                locals = {locals}
                handleLoadMore = {handleLoadMore}
                isLoading={isLoading}


            />
            {user &&(
                <Icon 
                    reverse
                    type="material-community"
                    name="plus"
                    color="#CF408C"
                    containerStyle={styles.btnContainer}
                    onPress = { () => navigation.navigate("add-locals")}
                />
            )}



        </View>
    );
}

const styles = StyleSheet.create ({
    viewBody : {
        flex: 1,
        backgroundColor: "#fff",
    },

    btnContainer : {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor : "black",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,

    },
})