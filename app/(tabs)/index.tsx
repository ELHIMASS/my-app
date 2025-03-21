import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isCon, setCon] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        console.log("Utilisateur déjà connecté, redirection...");
        router.replace('/explore');
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      console.log("Tentative de connexion avec :", username, password);
  
      const response = await fetch("http://10.10.4.131:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
  
      const data = await response.json();
      console.log("📢 Réponse de l'API :", data); // 🔴 DEBUG
  
      if (response.ok) {
        console.log("✅ Connexion réussie ! Stockage des données...");
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        console.log("📢 Utilisateur stocké :", data.user); // 🔴 DEBUG
        router.replace("/explore");
      } else {
        alert("Nom d’utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("🚨 Erreur lors de la connexion :", error);
      alert("Erreur de connexion au serveur.");
    }
  };
  


  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/image1.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>PORTAIL INTRANET ESISA</Text>
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
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  loginBox: {
    width: '60%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  forgotPassword: {
    color: '#6C63FF',
    fontSize: 14,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
