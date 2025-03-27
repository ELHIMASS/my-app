require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("🟢 MongoDB connecté !"))
    .catch(err => console.error("🔴 Erreur MongoDB :", err));

// 🔹 Définition du modèle User
const UserSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  date_naissance: String,
  pays: String,
  email: { type: String, unique: true },
  telephone: String,
  password: String,
  cne_bac: String, // Numéro CNE du Bac
  numero_carte_identite: String, // Numéro de carte d'identité
  sexe: String, // Sexe (M/F)
  groupe: String, // Groupe de l'étudiant
  annee_scolaire: String, // Année scolaire en cours
  derniere_connexion: String, // Dernière connexion (date et heure)
});

const User = mongoose.model("User", UserSchema);

// 🔹 Endpoint pour ajouter un utilisateur (inscription)
app.post("/user", async (req, res) => {
    try {
        const { prenom, nom, date_naissance, pays, email, telephone, password, cne_bac, numero_carte_identite, sexe, groupe, annee_scolaire } = req.body;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer un nouvel utilisateur
        const newUser = new User({
            prenom,
            nom,
            date_naissance,
            pays,
            email,
            telephone,
            password: hashedPassword,
            cne_bac,
            numero_carte_identite,
            sexe,
            groupe,
            annee_scolaire,
            derniere_connexion: new Date().toLocaleString() // Date actuelle au format local
        });

        await newUser.save();
        res.json({ success: true, message: "Utilisateur ajouté !" });
    } catch (err) {
        console.error("Erreur lors de l'inscription :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔹 Endpoint pour récupérer un utilisateur par ID (exclut le mot de passe)
app.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); 
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔹 Endpoint pour mettre à jour un utilisateur
app.put("/user/:id", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true, message: "Utilisateur mis à jour !" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔹 Endpoint de connexion (login)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    // Vérifier si le mot de passe est correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    // 🔹 Mettre à jour la dernière connexion
    const currentDate = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" });
    await User.updateOne({ email }, { derniere_connexion: currentDate });

    // 🔹 Retourner les informations correctes
    const updatedUser = await User.findOne({ email }).select("-password");

    res.json({ success: true, message: "Connexion réussie !", user: updatedUser });

  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// 🔹 Endpoint pour récupérer un utilisateur par email (exclut le mot de passe)
app.get("/user/email/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.json(user);
    } catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔹 Lancer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://192.168.100.219:${PORT}`));



const nodemailer = require("nodemailer");

app.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const resetToken = Math.random().toString(36).substring(2);
    user.resetToken = resetToken;
    user.tokenExpiry = Date.now() + 3600000; // expire dans 1h
    await user.save();

    // 🔐 CONFIGURER LE TRANSPORTEUR
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ismailelhimass@gmail.com",       // Ton email
        pass: "hxvs zxyc mzet juvy"   // Mot de passe ou App Password
      }
    });

    const resetLink = `http://192.168.100.219:5001/reset-password/${resetToken}`;

    // ✉️ CONFIGURER LE MAIL
    const mailOptions = {
      from: "PORTAIL ESISA administration@esisa.ma",
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Bonjour ${user.prenom},</p>
             <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Ce lien expire dans 1 heure.</p>`
    };

    // 📤 ENVOYER
    await transporter.sendMail(mailOptions);

    console.log("✅ Email envoyé à :", email);
    res.json({ message: "Lien de réinitialisation envoyé par email !" });

  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

