import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      {/* En-tête du menu avec le logo et l'utilisateur */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.userName}>Bonjour, Ismail !</Text>
      </View>

      {/* Liste des éléments du menu */}
      <DrawerItemList {...props} />
      <DrawerItem
        icon={({ color, size }) => <Icon name="sign-out" color={color} size={size} />}
        label="Se déconnecter"
        onPress={() => alert("Déconnexion")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#6D9EEB',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
