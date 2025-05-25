import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { FaTrashAlt } from "react-icons/fa";

function TagsPage() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const fetchTags = async () => {
    const q = query(collection(db, "tags"));
    const snapshot = await getDocs(q);
    const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTags(loaded);
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      navigate("/register");
      return;
    }

    await fetchTags();
  });

  return unsubscribe;
}, []);


  const addTag = async () => {
    if (!newTag.trim()) return;
    await addDoc(collection(db, "tags"), { name: newTag });
    setNewTag("");
    fetchTags();
  };

  const updateTag = async (tagId, newName) => {
    const tagRef = doc(db, "tags", tagId);
    const oldName = tags.find(t => t.id === tagId).name;

    await updateDoc(tagRef, { name: newName });

    // Mettre à jour tous les fragments
    const fragmentsSnap = await getDocs(collection(db, "fragments"));
    fragmentsSnap.forEach(async (fragDoc) => {
      const data = fragDoc.data();
      if (data.tags.includes(oldName)) {
        const updatedTags = data.tags.map(t => t === oldName ? newName : t);
        await updateDoc(doc(db, "fragments", fragDoc.id), { tags: updatedTags });
      }
    });

    fetchTags();
  };

  const deleteTag = async (tagId) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;

    await deleteDoc(doc(db, "tags", tagId));

    // Supprimer ce tag de tous les fragments
    const fragmentsSnap = await getDocs(collection(db, "fragments"));
    fragmentsSnap.forEach(async (fragDoc) => {
      const data = fragDoc.data();
      if (data.tags.includes(tag.name)) {
        const updatedTags = data.tags.filter(t => t !== tag.name);
        await updateDoc(doc(db, "fragments", fragDoc.id), { tags: updatedTags });
      }
    });

    fetchTags();
  };

  return (
    <div>
      <h2>Gestion des tags</h2>
      <input
        value={newTag}
        onChange={e => setNewTag(e.target.value)}
        placeholder="Nouveau tag"
      />
      <button onClick={addTag}>Ajouter</button>

      <ul>
        {tags.map(tag => (
          <li key={tag.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              defaultValue={tag.name}
              onBlur={(e) => updateTag(tag.id, e.target.value)}
            />
            <button onClick={() => deleteTag(tag.id)} style={{ color: "red", background: "transparent", border: "none", cursor: "pointer" }}>
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagsPage;
