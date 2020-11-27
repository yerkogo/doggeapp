import React, {useState, useEffect, useCallback, useRef }from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Rating, ListItem, Icon  } from "react-native-elements";
import { firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import { map} from "lodash";
import ListReviews from "../../components/Locals/ListReviews";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";




const db= firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Local(props) {

    const{navigation, route} = props;
    const { id, name} = route.params; 
    const [local, setLocal] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();


    

    useEffect(() => {
        navigation.setOptions({ title: name });
      }, [navigation]);

    firebase.auth().onAuthStateChanged((user) =>{
        user ? setUserLogged(true) : setUserLogged(false);
    }) ; 

    useFocusEffect(
        useCallback(() => {
            db.collection("locals")
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setLocal(data);
                setRating(data.rating)
            });
            
        }, [])

    );  

    useEffect(() => {
        if(userLogged && local){
            db.collection("favorites")
            .where("idLocal", "==", local.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                if(response.docs.length === 1 ){
                    setIsFavorite(true);
                }
            })
        }   
        
     }, [userLogged, local]); 

    const addFavorite = ()=>{
        if(!userLogged){
            toastRef.current.show(
                "Para usar el sistema de favoritos tienes que estar logeado"
                )
        } else{
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idLocal: local.id,
            };
            db.collection("favorites")
                .add(payload)
                .then(() =>{
                    setIsFavorite(true);
                    toastRef.current.show("Lugar añadido a favoritos");
                })
                .catch(()=> {
                    toastRef.current.show("Error al añadir lugar a favoritos");
                })
        }
    }

    const removeFavorite = () =>{
        db.collection("favorites")
            .where("idLocal", "==", local.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response)=>{
                response.forEach((doc)=>{
                    const idFavorite = doc.id;
                    db.collection("favorites")
                    .doc(idFavorite)
                    .delete()
                    .then(()=>{
                        setIsFavorite(false);
                        toastRef.current.show("Lugar eliminado de favoritos")
                    })
                    .catch (() =>{
                        toastRef.current.show("Lugar eliminado de favoritos")
                    })
                })
            })
    }


    if(!local) return <Loading isVisible={true} text="CARGANDO..."/>
    

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress= {isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#CF408C" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />

            </View>
            <Carousel
                arrayImages={local.images}
                height={250}
                width={screenWidth}
            />
            <TitleLocal
                name={local.name}
                description={local.description}
                rating={rating}
            />
            <LocalInfo
                location={local.location}
                name={local.name}
                address={local.address}
            />
            <ListReviews
                navigation={navigation}
                idLocal={local.id}
                

            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </ScrollView>
    );
}

function TitleLocal (props){
    const{name, description, rating}= props;

    return(
        <View style={styles.viewLocalTitle}>
            <View style ={{flexDirection: "row"}}>
                <Text style={styles.nameLocal}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionLocal}>{description}</Text>
        </View>
    )

}

function LocalInfo(props){
    const { location, name, address} = props;

    const listInfo = [
        {
        text: address,
        iconName: "map-marker",
        iconType: "material-community",
        action: null,
        },
        {
            text: "111 222 333",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "hola@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        }

     

    ]

    return (
        <View style={styles.viewLocalInfo}>
            <Text style={styles.localInfoTitle}>
                Información sobre el lugar
            </Text>
            <Map location={location} name={name} height={100} />
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#CF408C"
                    }}
                    containerStyle={styles.containerListItem}
                
                />


            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewLocalTitle : {
        padding: 15,

    },
    nameLocal : {
        fontSize: 20,
        fontWeight: "bold",
    },
    descriptionLocal : {
        marginTop: 5,
        color: "grey",
    },
    rating : {
        position: "absolute",
        right:0,
    },
    viewLocalInfo : {
        margin : 15,
        marginTop: 25,
    },
    localInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10, 

    },
    containerListItem : {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth :1 ,
    },
    viewFavorite : {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex:2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,

    },

})

