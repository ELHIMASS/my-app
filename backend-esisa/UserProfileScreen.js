import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function AddUserScreen() {
    const [user, setUser] = useState({
        prenom: '',
        nom: '',
        courriel: '',
        telephone: '',
        pays: '',
        cne: '',
        cin: '',
        sexe: '',
        annee_scolaire: '',
    });

    const handleChange = (name, value) => {
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        if (data.success) {
            alert('User added successfully');
        } else {
            alert('Failed to add user');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Ajouter un utilisateur</Text>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={user.prenom}
                        onChangeText={(text) => handleChange('prenom', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={user.nom}
                        onChangeText={(text) => handleChange('nom', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={user.courriel}
                        onChangeText={(text) => handleChange('courriel', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Téléphone"
                        value={user.telephone}
                        onChangeText={(text) => handleChange('telephone', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Pays d'origine"
                        value={user.pays}
                        onChangeText={(text) => handleChange('pays', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Numéro CNE"
                        value={user.cne}
                        onChangeText={(text) => handleChange('cne', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Numéro Carte d'Identité"
                        value={user.cin}
                        onChangeText={(text) => handleChange('cin', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Sexe"
                        value={user.sexe}
                        onChangeText={(text) => handleChange('sexe', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Année scolaire"
                        value={user.annee_scolaire}
                        onChangeText={(text) => handleChange('annee_scolaire', text)}
                    />
                    <Button title="Ajouter" onPress={handleSubmit} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    content: { marginTop: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
    input: { fontSize: 16, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 5 },
});
