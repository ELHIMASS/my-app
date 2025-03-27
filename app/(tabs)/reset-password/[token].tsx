// app/reset-password/[token].tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ResetPasswordPage() {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    try {
      const response = await fetch(`http://192.168.100.219:5001/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Mot de passe réinitialisé !");
        router.replace("/");
      } else {
        Alert.alert("Erreur", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de réinitialiser.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nouveau mot de passe :</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleReset} style={styles.button}>
        <Text style={styles.buttonText}>Réinitialiser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
  button: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
