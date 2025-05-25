import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      setCurrentUser(user);
      setMessage("Un email de vérification vous a été envoyé. Vérifiez votre boîte de réception.");
    } catch (error) {
      setMessage("Erreur : " + error.message);
    }
  };

  const handleCheckVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload(); // recharge les infos
      if (auth.currentUser.emailVerified) {
        setMessage("Email vérifié ✅ Redirection...");
        navigate("/login"); // ou la page que tu veux
      } else {
        setMessage("Votre email n'est pas encore vérifié ❌");
      }
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage("Lien de vérification renvoyé 📩");
      } catch (error) {
        setMessage("Erreur lors de l'envoi : " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Inscription</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>

      {message && <p>{message}</p>}

      {currentUser && (
        <>
          <button type="button" onClick={handleCheckVerification}>
            Vérifier maintenant
          </button>
          <button type="button" onClick={handleResendVerification}>
            Renvoyer le lien
          </button>
        </>
      )}
    </form>
  );
}

export default RegisterForm;
