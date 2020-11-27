import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating} from "react-native-elements";

export default function ListTopLocals(props) {
    const { locals, navigation}= props;
    return (
        <FlatList
            data={locals}
            renderItem={(local)=> (
            <Local  local={local} navigation={navigation}/>
            )}
            keyExtractor={(item, index) => index.toString ()}
        
        />
    )
}

function Local (props) {
    const {local, navigation}= props;
    const {id, name, rating, images, description } = local.item;
    const [iconColor, setIconColor] = useState("#000");

    useEffect(() => {
        if(local.index === 0 ){
            setIconColor("#efb819")
        } else if (local.index === 1){
            setIconColor("#e3e4e5")
    
        }else if (local.index === 2){
            setIconColor("#cd7f32")
            
        }

    }, [])

 
    return (
        <TouchableOpacity onPress={()=> navigation.navigate("locals", {screen : "local", params: {id}})}>
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="star"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image 
                    style={styles.localImage}
                    resizeMode="cover"
                    source = {
                        images [0]
                            ? {uri: images [0]}
                            : require("../../../assets/img/no-image.png")
                    }
                />
                <View style ={styles.titleRating}>
                    <Text style ={styles.title}>{name}</Text>
                    <Rating 
                        imageSize={20}
                        startingValue={rating}
                        readonly
                        
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCard : {
        marginBottom: 30,
        borderWidth: 0,

    },
    containerIcon : {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1, 
    },
    localImage : {
        width: "100%",
        height: 200,
    }, 
    titleRating : {
        flexDirection: "row",
        marginTop: 10, 
        justifyContent:"space-between",
    },
    title : {
        fontSize: 20,
        fontWeight: "bold",

    },
    description : {
        color: "grey",
        marginTop:0,
        textAlign: "justify",
    },

})
