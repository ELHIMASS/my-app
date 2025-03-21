import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExploreScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) {
          router.replace("/");
          return;
        }
  
        const parsedUser = JSON.parse(storedUser);
        const response = await fetch(`http://10.10.4.131:5001/user/email/${parsedUser.email}`);
        const data = await response.json();
  
        if (response.ok) {
          setUser(data);
        } else {
          alert("Erreur lors du chargement des données.");
          router.replace("/");
        }
      } catch (error) {
        console.error("🚨 Erreur lors de la récupération des données :", error);
        alert("Impossible de récupérer les informations.");
        router.replace("/");
      } finally {
        setTimeout(() => setLoading(false), 2000); // 🔴 Forcer le chargement à s'arrêter après 2s
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleLogout = async () => {
    try {
      console.log("🔴 Déconnexion en cours...");
      
      // 🔹 Supprimer l'utilisateur de AsyncStorage
      await AsyncStorage.removeItem("user");
  
      // 🔹 Vérifier si l'utilisateur est bien supprimé
      const userCheck = await AsyncStorage.getItem("user");
      if (!userCheck) {
        console.log("✅ Utilisateur déconnecté !");
      } else {
        console.log("⚠️ Erreur : L'utilisateur est toujours en mémoire !");
      }
  
      // 🔹 Rediriger vers la page de connexion
      router.replace("/");
  
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
      alert("Erreur lors de la déconnexion !");
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
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}> 
      <View style={styles.container}>
        <Text style={styles.title}>Informations utilisateur</Text>
        <Text style={styles.subtitle}>Bienvenue sur votre profil</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Prénom :</Text>
          <Text style={styles.value}>{user.prenom}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{user.nom}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{user.telephone}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Date de naissance :</Text>
          <Text style={styles.value}>{user.date_naissance}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Pays :</Text>
          <Text style={styles.value}>{user.pays}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Numéro CNE :</Text>
          <Text style={styles.value}>{user.cne_bac}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Numéro Carte Identité :</Text>
          <Text style={styles.value}>{user.numero_carte_identite}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Sexe :</Text>
          <Text style={styles.value}>{user.sexe}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Année scolaire en cours :</Text>
          <Text style={styles.value}>{user.annee_scolaire}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Groupe :</Text>
          <Text style={styles.value}>{user.groupe}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Dernière connexion :</Text>
          <Text style={styles.value}>{new Date().toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20, 
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
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
