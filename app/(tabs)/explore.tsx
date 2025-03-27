import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Importer SecureStore
import { Header, Icon, Overlay, ListItem } from "react-native-elements";

export default function ExploreScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer les données de l'utilisateur depuis SecureStore
        const storedUser = await SecureStore.getItemAsync("user");

        if (!storedUser) {
          router.replace("/"); // Redirection si l'utilisateur n'est pas connecté
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        // Utilisation de l'API pour récupérer les données utilisateur
        const response = await fetch(`http://192.168.100.219:5001/user/email/${parsedUser.email}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          await SecureStore.deleteItemAsync("user"); // Supprimer les données utilisateur si erreur
          router.replace("/"); // Redirection vers la page de login
        }
      } catch (error) {
        Alert.alert("Erreur", "Impossible de récupérer les données.");
        router.replace("/"); // En cas d'erreur, rediriger vers la page de login
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user"); // Suppression des données de l'utilisateur
      setUser(null);
      router.replace("/"); // Redirection vers la page de login
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Aucun utilisateur chargé.</Text>
      </View>
    );
  }

  return (
    <>
      {/* 🟣 CONTENU */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Informations utilisateur</Text>
          <Text style={styles.subtitle}>Bienvenue sur votre profil</Text>

          {[ 
            { label: "Prénom", value: user.prenom },
            { label: "Nom", value: user.nom },
            { label: "Email", value: user.email },
            { label: "Téléphone", value: user.telephone },
            { label: "Date de naissance", value: user.date_naissance },
            { label: "Pays", value: user.pays },
            { label: "Numéro CNE", value: user.cne_bac || "Non renseigné" },
            { label: "Numéro Carte Identité", value: user.numero_carte_identite || "Non renseigné" },
            { label: "Sexe", value: user.sexe },
            { label: "Année scolaire", value: user.annee_scolaire },
            { label: "Groupe", value: user.groupe },
            { label: "Dernière connexion", value: user.derniere_connexion || "Non disponible" },
          ].map((item, index) => (
            <View key={index} style={styles.infoBox}>
              <Text style={styles.label}>{item.label} :</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

// ✅ STYLES
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
