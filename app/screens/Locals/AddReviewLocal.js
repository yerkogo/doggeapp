import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AirbnbRating, Button, Input} from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db=firebase.firestore(firebaseApp);

export default function AddReviewLocal(props) {
    const { navigation, route} = props;
    const {idLocal} = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () =>{
        if (!rating){
            toastRef.current.show("No has dado ninguna puntuación")
        } else if (!title) {
            toastRef.current.show("El título es obligatorio")
        } else if (!review){
            toastRef.current.show("El comentario es obligatorio")
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const paylod = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idLocal: idLocal,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            };

            db.collection("reviews")
                .add(paylod)
                .then(()=>{
                    updateLocal();
                })
                .catch(()=>{
                    toastRef.current.show("Error al enviar la review");
                    setIsLoading(false);
                });
        }
    }
    
    const updateLocal = () => {
        const localRef = db.collection("locals").doc(idLocal);

        localRef.get().then((response)=>{
            const localData = response.data();
            const ratingTotal = localData.ratingTotal + rating;
            const quantityVoting = localData.quantityVoting +1;
            const ratingResult = ratingTotal / quantityVoting;

            localRef.update({
                rating: ratingResult,
                ratingTotal,
                quantityVoting,
            }) .then(()=>{
                setIsLoading(false);
                navigation.goBack();
            })

        });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
             <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pésimo", "Deficiente","Normal", "Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value)=> {setRating(value)}}

                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Título"
                    containerStyle={styles.input}
                    onChange={(e)=> setTitle(e.nativeEvent.text)}

                />
                <Input
                    placeholder="Comentario..."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e)=> setReview(e.nativeEvent.text)}

                />
                <Button
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast  ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando comentario"/>
        </View>
        </TouchableWithoutFeedback>
       
    )
}

const styles = StyleSheet.create({
    viewBody : {
        flex : 1,
    },
    viewRating : {
        height: 110,
        backgroundColor: "#f2f2f2",
    },
    formReview : {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop:40, 
    },
    input : {
        marginBottom: 10,
    },
    textArea : {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0, 
    },
    btnContainer : {
       flex: 1,
       justifyContent: "flex-end",
       marginTop: 20,
       marginBottom: 10,
       width: "95%", 
    },
    btn : {
        backgroundColor: "#CF408C"
    }
})
