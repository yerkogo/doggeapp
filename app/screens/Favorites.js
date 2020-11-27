import React, {useState, useRef, useCallback } from "react";
import {StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import { Image, Icon, Button} from "react-native-elements";
import {useFocusEffect} from "@react-navigation/native";
import {firebaseApp} from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";


const db = firebase.firestore(firebaseApp);

export default function Favorites(props){
    const {navigation} = props;

    const [locals, setLocals] = useState(null);
    const [userLogged, setUserLogged] = useState (false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false)
    const toastRef = useRef();




    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false)
    });

    useFocusEffect(
        useCallback(()=>{
            if(userLogged){
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                    .where("idUser","==", idUser)
                    .get()
                    .then((response) =>{
                        const idLocalsArray =[];
                        response.forEach((doc)=>{
                            idLocalsArray.push(doc.data().idLocal);
                        })
                        getDataLocal(idLocalsArray).then((response)=>{
                            const locals = [];
                            response.forEach((doc)=>{
                               const local = doc.data();
                               local.id = doc.id;
                               locals.push(local);
                            })
                            setLocals(locals);
                        })
                    })
            }
            setReloadData(false);
        }, [userLogged, reloadData])
    );
    
   

    const getDataLocal = (idLocalsArray ) => {
        const arrayLocals = [];
        idLocalsArray.forEach((idLocal)=>{
            const result = db.collection("locals").doc(idLocal).get();
            arrayLocals.push(result);
        })
        return Promise.all(arrayLocals);
    };

    if(!userLogged){
        return <UserNoLogged navigation={navigation}/>
    }

    if(locals?.length === 0){
         return <NotFoundLocals/>;
    }


    return (
        <View style={styles.viewBody}>
            {locals ? (
                <FlatList
                    data={locals}
                    renderItem={(local)=> 
                        (<Local local={local} 
                            setIsLoading={setIsLoading} 
                            toastRef={toastRef}
                            setReloadData ={setReloadData}
                            navigation ={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ): (
                <View style={styles.loaderLocals}>
                    <ActivityIndicator size="large" />
                    <Text style={{ textAlign:"center"}}>Cargando lugares</Text>
                </View>
            )}
            <Toast ref ={toastRef} position="center" opacity={0.9}/>
            <Loading text="Eliminando lugar" isVisible={isLoading}/>
        </View>
    );
}

function NotFoundLocals (){

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{fontSize:20, fontWeight:"bold"}}>
                No tienes lugares en tu lista
            </Text>
        </View>
    );

}

function UserNoLogged(props){
    const {navigation} = props;

    return(
        <View style={{ flex: 1, alignItems:"center", justifyContent:"center"}}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{fontSize: 20, fontWeight: "bold", textAlign:"center"}}>
                Necesitas iniciar sesión para ver esta sección
            </Text>
            <Button 
                title="Ir al login"
                containerStyle={{margin:20, width:"80%"}}
                buttonStyle={{backgroundColor:"#CF408C"}}
                onPress={()=> navigation.navigate("account", {screen: "login"})}
            />

        </View>
    )
}

function Local(props){
    const {local, setIsLoading, toastRef, setReloadData, navigation} = props;
    const {id, name, images} = local.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
          "Eliminar Restaurante de Favoritos",
          "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Eliminar",
              onPress: removeFavorite,
            },
          ],
          { cancelable: false }
        );
      };

    const removeFavorite = () => {
        setIsLoading(true)
        db.collection("favorites")
        .where("idLocal", "==", id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response)=> {
            response.forEach((doc)=>{
                const idFavorite= doc.id;
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(()=>{
                    setIsLoading(false)
                    setReloadData(true);
                    toastRef.current.show("Lugar eliminado correctamente")
                })
                .catch(() =>{
                    setIsLoading(false)
                    toastRef.current.show("Error al eliminar el lugar")
                })

            })
        })
    }
   
    return(
        <View style={styles.local}>
            <TouchableOpacity onPress={()=> navigation.navigate("locals", {screen : "local", params: {id}})}>
                <Image 
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={
                        images[0]
                        ? {uri: images[0]}
                        : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#CF408C"
                        containerStyle={styles.favorites}
                        onPress= {confirmRemoveFavorite}
                        underlayColor="transparent"

                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create ({
    viewBody: {
        flex :1 ,
        backgroundColor: "#f2f2f2",
    },
    loaderLocals: {
        marginTop: 10,
        marginBottom: 10,
    },
    local : {
        margin: 10,
    },
    image : {
        width: "100%",
        height: 180,
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
      },
      name: {
        fontWeight: "bold",
        fontSize: 30,
      },
      favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
      },
})