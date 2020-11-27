import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [locals, setLocals] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM locals WHERE name LIKE '${search}%'`)
        .then((response) => {
          setLocals(response);
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Busca un lugar..."
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {locals.length === 0 ? (
        <NoFoundLocals />
      ) : (
        <FlatList
          data={locals}
          renderItem={(local) => (
            <Local local={local} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NoFoundLocals() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

function Local(props) {
  const { local, navigation } = props;
  const { id, name, images } = local.item;

  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-image.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("locals", {
          screen: "local",
          params: { id, name },
        })
      }
    />
  );
}


const styles = StyleSheet.create({
    searchBar: {
      marginBottom: 20,
    },
  });