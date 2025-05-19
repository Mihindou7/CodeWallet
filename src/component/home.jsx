import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableFragment from "./sortablefragment.jsx"; 

function FragmentsPage() {
  const [user, setUser] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  //Affiche ou non la barre de filtre
  const [showFilter, setShowFilter] = useState(false); 
  // Terme de recherche pour filtrer les fragments
  // par tags 
  const [searchTerm, setSearchTerm] = useState("");      
  const navigate = useNavigate();

  // Détection d'un utilisateur connecté
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("Utilisateur connecté :", currentUser);
        setUser(currentUser);
        fetchFragments(currentUser.uid);
      }else {
        console.log("Aucun utilisateur connecté");
      }
    });
  }, []);

  // Récupération des fragments depuis Firestore
  const fetchFragments = async (uid) => {
    const q = query(collection(db, "fragments"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const loaded = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFragments(loaded);
  };

  // Drag & Drop : configuration des capteurs
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Gestion du déplacement de fragment dans la liste
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fragments.findIndex((f) => f.id === active.id);
      const newIndex = fragments.findIndex((f) => f.id === over.id);
      setFragments((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // Gestion du drop d'un fichier pour créer un fragment
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    if (!user) {
      alert("Veuillez vous connecter pour ajouter un fragment.");
      return;
    }

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const newFragment = {
        title: file.name,
        code: content,
        tags: [],
        uid: user.uid,
        createdAt: new Date()
      };

      try {
        await addDoc(collection(db, "fragments"), newFragment);
        fetchFragments(user.uid);
      } catch (err) {
        console.error("Erreur lors de l'ajout du fragment :", err);
      }
    };

    reader.readAsText(file);
  };

  //Écoute de Ctrl + F 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault(); //empêche la recherche native du navigateur
        setShowFilter(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  //Liste filtrée par les tags selon le terme entré
  const filteredFragments = fragments.filter(fragment =>
    !searchTerm || // Si aucun terme de recherche, inclure tous les fragments
    (fragment.tags && fragment.tags.some(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div>
      <button onClick={() => navigate("/fragment/new")}>New</button>

      {/* Barre de recherche par tag (affichée après Ctrl+F) */}
      {showFilter && (
        <div style={{ margin: "1rem 0" }}>
          <input
            type="text"
            placeholder="Filter by tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button onClick={() => { setSearchTerm(""); setShowFilter(false); }}>✖</button>
        </div>
      )}

      {/* Zone de drop de fichier */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: dragOver ? "2px dashed blue" : "2px dashed lightgray",
          padding: "2rem",
          marginBottom: "1rem",
          textAlign: "center",
          transition: "border 0.3s"
        }}
      >
        Drop a file here to create a fragment
      </div>

      {/* Liste triable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredFragments.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {filteredFragments.map((frag) => (
            <SortableFragment key={frag.id} fragment={frag} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default FragmentsPage;
