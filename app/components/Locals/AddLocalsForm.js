import React, {useState, useEffect, Children} from "react";
import { StyleSheet,  View, Text, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button} from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import {map, size, filter} from "lodash";
import * as Location from "expo-location";
import Modal from "../Modal";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddLocalsForm (props){
    const {toastRef,setIsLoading, navigation } = props;
    const [localsName, setLocalsName] = useState("");
    const [localsAddress, setLocalsAddress] = useState("");
    const [localsDescription, setLocalsDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationLocal, setLocationLocal] = useState(null);

    

    const addLocals = () => {
        if(!localsName || !localsAddress || !localsDescription) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (size (imageSelected) === 0){
            toastRef.current.show("El lugar debe poseer al menos una foto");
        } else if (!locationLocal){
            toastRef.current.show("Tienes que localizar el lugar en el mapa");
        } else {
            setIsLoading(true);
            uploadImageStoraje().then((response) => {
                
               

                 db.collection("locals")
                    .add({
                        name: localsName,
                        address: localsAddress,
                        description: localsDescription,
                        location: locationLocal,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    

                    })
                    .then(()=>{
                        setIsLoading(false);
                        navigation.navigate("Locales");
                    }).catch (() => {
                        setIsLoading(false);
                        toastRef.current.show(
                            "Error al cargar el lugar, intente más tarde"
                        )
                    })
            });
        }

    };

    const uploadImageStoraje = async () =>{
        
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
                const response =  await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("locals").child(uuid());
                await ref.put(blob).then(async(result)=> {
                    await firebase 
                            .storage()
                            .ref(`locals/${result.metadata.name}`)
                            .getDownloadURL()
                            .then(photoUrl => {
                                imageBlob.push(photoUrl);
                            })
                });
            })
    
        )


        return imageBlob;
    };


    return (
        <ScrollView style={styles.scrollView}>
            <ImageLocal imagenLocal= {imageSelected[0]}/>

            <FormAdd
                setLocalsName={setLocalsName}
                setLocalsAddress={setLocalsAddress}
                setLocalsDescription={setLocalsDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationLocal={locationLocal}

            
            />
            <UploadImage 
                toastRef={toastRef} 
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
                
            
            
            />    
            <Button
                title="Crear Lugar"
                onPress={addLocals}
                buttonStyle={styles.btnAddLocals}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationLocal={setLocationLocal}
                toastRef={toastRef}
            />
        </ScrollView>
    );
};

function ImageLocal(props){
    const {imagenLocal} = props;

    return (
        <View style={styles.viewPhoto}>
            <Image 
            
                source = {imagenLocal ? {uri : imagenLocal}: require("../../../assets/img/no-image.png")}
                style={{ width: widthScreen, height: 200}}
            />
        </View>
    )
}

function FormAdd(props){
    const {
        setLocalsName, 
        setLocalsAddress, 
        setLocalsDescription,
        setIsVisibleMap,
        locationLocal
    } = props; 

    return(
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del lugar"
                containerStyle={styles.input}
                onChange={(e) => setLocalsName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={(e) => setLocalsAddress(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"google-maps",
                    color: locationLocal ? "#CF408C" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true),
                }}
            />
            <Input
                placeholder="Descripcion del sitio"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setLocalsDescription(e.nativeEvent.text)}
            />          
        </View>
    )
}

function Map(props){
    const {isVisibleMap, setIsVisibleMap, setLocationLocal, toastRef} = props;
    const [location, setLocation] = useState(null);

   

    useEffect(() => {

        (async()=>{
            const resultPermissions = await  Permissions.askAsync(
                Permissions.LOCATION
                );
                const statusPermissions = resultPermissions.permissions.location.status;
            
                if(statusPermissions !== "granted"){
                    toastRef.current.show("Debe aceptar los permisos de localización ",3000);
                } else{
                    const loc = await Location.getCurrentPositionAsync({});
                    
                    setLocation ({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001
                    })
                }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationLocal(location);
        toastRef.current.show("Localizacion guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location &&(
                    <MapView
                    style={styles.mapStyle}
                    initialRegion={location}
                    showsUserLocation={true}
                    onRegionChange={(region)=> setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude:location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />

                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                        <Button  
                        title="Guardar Ubicación" 
                        containerStyle={styles.viewMapBtnContainer}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                        />
                        <Button  
                        title="Cancelar Ubicación" 
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                        
                        />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props){

    const {toastRef, imageSelected, setImageSelected}=props;

    const imageSelect = async() =>{
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        if (resultPermissions === "denied"){
            toastRef.current.show("Es necesario conceder los permisos para acceder a la galería", 
            3000
            );
        } else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            
            if(result.cancelled){
                toastRef.current.show(
                    "No has seleccionado ninguna imagen",
                    2000
                )
            } else{
                setImageSelected([...imageSelected, result.uri])
            }
        }
    };

    const removeImage = (image) => {
        

        Alert.alert(
            "Eliminar imagen",
            "¿Estás seguro que seseas eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () =>{
                        setImageSelected(
                            filter ( imageSelected, (imageUrl) => imageUrl !== image )
                        )
                    
                        
                    },
                }
            ],
            { cancelabre :false}
        )
    };
    
    return (
        <View style={styles.viewImages}>
            {size(imageSelected) < 4 && (
                <Icon
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
            )} 
            
        {map(imageSelected, (imageLocal, index)=>(
            <Avatar
            key={index}
            style={styles.miniatureStyle}
            source={{ uri: imageLocal }}
            onPress={()=> removeImage(imageLocal)}
            />
        ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView :{
        height: "100%",

    },
    viewForm : {
        marginLeft: 10,
        marginRight: 10
    },
    input : {
        marginBottom: 10,
    },
    textArea : {
        height :100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddLocals : {
        backgroundColor: "#CF408C",
        margin: 20,
    },
    viewImages : {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },

    miniatureStyle : {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto : {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle : {
        width: "100%",
        height: 500,

    },
    viewMapBtn : {
        flexDirection:"row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,

    },
    viewMapBtnCancel : {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainer: {
        paddingRight: 5,

    },
    viewMapBtnSave: {
        backgroundColor: "#CF408C",

    },


});