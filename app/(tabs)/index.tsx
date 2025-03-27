import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Correctement importé
import 'react-native-gesture-handler';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user'); // Utilisation correcte
        if (storedUser) {
          console.log("✅ Utilisateur déjà connecté, redirection vers /explore...");
          router.replace('/explore');
        }
      } catch (error) {
        console.error("⚠️ Erreur lors de la vérification de la session :", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      console.log("📢 Tentative de connexion avec :", username, password);
  
      const apiUrl = "http://192.168.100.219:5001/login";
      if (!apiUrl) {
        throw new Error("API URL is not defined.");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📢 Réponse API :", data);
  
      if (response.ok) {
        if (data && data.user) {
          console.log("✅ Connexion réussie ! Stockage des données...");
  
          // Stockage de l'utilisateur dans SecureStore
          await SecureStore.setItemAsync('user', JSON.stringify(data.user)); // Utilisation correcte
          console.log("➡️ Utilisateur stocké :", data.user);
  
          // Redirection avec un délai pour s'assurer que le stockage est fait avant
          setTimeout(() => {
            router.replace("/explore");
          }, 500);  // Délai de 500ms pour assurer que SecureStore a bien terminé
        } else {
          Alert.alert("Erreur", "Utilisateur non trouvé dans la réponse.");
        }
      } else {
        Alert.alert("Erreur", "Nom d’utilisateur ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("🚨 Erreur lors de la connexion :", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Identifiant"
        placeholderTextColor="#999" 
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
