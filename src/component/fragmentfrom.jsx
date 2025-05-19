import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

function FragmentFormPage() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth check + load fragment if editing
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      navigate("/register");
      return;
    }

    setUser(currentUser);

    try {
      const snapshot = await getDocs(collection(db, "tags"));
      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setAvailableTags(tags);

      // Charger le fragment si on édite
      if (id) {
        await loadFragment(currentUser.uid);
      }
    } catch (err) {
      console.error("Erreur Firebase :", err);
      alert("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, [id, navigate]);

  const loadFragment = async (uid) => {
    const docRef = doc(db, "fragments", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().uid === uid) {
      const data = docSnap.data();
      setTitle(data.title);
      setCode(data.code);
      setSelectedTags(data.tags || []);
    } else {
      alert("Fragment introuvable ou accès refusé.");
      navigate("/");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !code) return;

    const fragmentData = {
      uid: user.uid,
      title,
      code,
      tags: selectedTags,
      updatedAt: serverTimestamp(),
    };

    if (id) {
      const docRef = doc(db, "fragments", id);
      await updateDoc(docRef, fragmentData);
    } else {
      await addDoc(collection(db, "fragments"), {
        ...fragmentData,
        createdAt: serverTimestamp(),
      });
    }

    navigate("/");
  };

  const handleDelete = async () => {
    if (id && window.confirm("Supprimer ce fragment ?")) {
      await deleteDoc(doc(db, "fragments", id));
      navigate("/");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{id ? "Modifier le fragment" : "Nouveau fragment"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label>Tags :</label>
        <select
          multiple
          size={availableTags.length < 5 ? availableTags.length : 5}
          value={selectedTags}
          onChange={(e) =>
            setSelectedTags(
              Array.from(e.target.selectedOptions).map((option) => option.value)
            )
          }
        >
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">{id ? "Mettre à jour" : "Créer"}</button>
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ marginLeft: "1rem", color: "red" }}
            >
              Supprimer
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FragmentFormPage;