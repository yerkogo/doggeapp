import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from "react-native-elements";
import { size } from "lodash";
import {useNavigation} from "@react-navigation/native";



export default function ListLocals(props) {

    const {locals, handleLoadMore, isLoading}=props;
    const navigation = useNavigation();


    return (
        <View>
            { size (locals) > 0  ? (
                <FlatList 
                    data={locals}
                    renderItem={(local)=> <Local local={local} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style = {styles.loaderLocals}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando lugares</Text>
                </View>
            )}
        </View>
    );
}

function Local(props){
    const {local, navigation } = props;
    const { id, images, name, address, description } = local.item;
    const imageLocal = images[0];

    const goLocal = () =>{
        navigation.navigate("local", {
            id,
            name,
        });
    }
    
    return (
        <TouchableOpacity onPress={goLocal}>
            <View style={styles.viewLocal}>
                <View style={styles.viewLocalImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff"/>}
                        source={
                            imageLocal 
                            ? {uri: imageLocal }
                            : require("../../../assets/img/no-image.png")
                        }

                        style={styles.imageLocal}

                    />

                </View>
                    <View>
                        <Text style={styles.localName}>{name}</Text>
                        <Text style={styles.localAddress}>{address}</Text>
                        <Text style={styles.localDescription}>{description.substr(0, 60)}...</Text>
                    </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList (props) {
    const {isLoading} = props;

    if(isLoading ){
        return (
            <View  style={styles.loaderLocals}>
                <ActivityIndicator size ="large" />
            </View>
        )
    } else{
        return (
            <View style={styles.notFoundLocals}>
                <Text>No quedan lugares por cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderLocals : {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    viewLocal : {
        flexDirection: "row",
        margin: 10,

    },
    viewLocalImage : {
        marginRight: 15,
    },
    imageLocal : {
        width : 90,
        height: 90,
    },
    localName : {
        fontWeight: "bold",
    },
    localAddress : {
        paddingTop: 2,
        color: "grey",
    },
    localDescription : {
        paddingTop: 2,
        color: "grey",
        width: 300,
    },
    notFoundLocals: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",

    }
})
