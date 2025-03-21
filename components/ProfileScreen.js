import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/user/662f1e4a8c6d5b001b7d5e99") // ID de l'utilisateur
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur de récupération :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#6D9EEB" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations utilisateur</Text>
      <Text style={styles.subtitle}>Pour toute modification, contactez le support.</Text>
      
      {/* Avatar */}
      <Image source={require('../../assets/avatar.png')} style={styles.avatar} />

      {/* Informations */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Prénom: <Text style={styles.value}>{user.prenom}</Text></Text>
        <Text style={styles.label}>Nom: <Text style={styles.value}>{user.nom}</Text></Text>
        <View style={styles.editableField}>
          <Text style={styles.label}>Date de Naissance: <Text style={styles.value}>{user.date_naissance}</Text></Text>
          <TouchableOpacity>
            <Icon name="pencil" size={20} color="#6D9EEB" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Pays d'Origine: <Text style={styles.value}>{user.pays}</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#3A6EA5',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  editableField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
