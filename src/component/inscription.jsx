import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth,db } from "../firebaseconfig.js";
import { doc, setDoc } from "firebase/firestore";



function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });
      await sendEmailVerification(user);
      setMessage("Inscription réussie 🎉");
      console.log("Utilisateur :", userCredential.user);
    } catch (error) {
      setMessage("Erreur : " + error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Inscription</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default RegisterForm;