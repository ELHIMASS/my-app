import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSendReset = async () => {
    try {
      const response = await fetch("http://192.168.100.219:5001/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Lien de réinitialisation envoyé à votre email !");
      } else {
        Alert.alert("Erreur", data.message || "Utilisateur introuvable.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Image source={require('../../assets/images/image1.png')} style={styles.backgroundImage} />
        <View style={styles.container}>
          <Text style={styles.label}>Entrez votre email :</Text>
          <TextInput
            style={styles.input}
            placeholder="example@domain.com"
            onChangeText={setEmail}
            value={email}
          />
          <TouchableOpacity onPress={handleSendReset} style={styles.button}>
            <Text style={styles.buttonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBlock: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    marginRight: '20%',
    marginLeft: '20%'
  },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 20, width: 200 },
  button: { backgroundColor: '#6C63FF', padding: 9, borderRadius: 5, width: 130 },
  buttonText: { color: '#fff', textAlign: 'center' },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
