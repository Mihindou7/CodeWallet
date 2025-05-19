import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {FaEye} from "react-icons/fa";

function FragmentCard({ fragment, onModalToggle = () => {} }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleModal = (value) => {
    setShowModal(value);
    onModalToggle(value);
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fragment.code);
  };
  const formatTags = (tags) => {
    if (tags.length <= 3) return tags.join(", ");
    return `${tags[0]}, ${tags[1]}, ..., ${tags[tags.length - 1]}`;
  };


  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", border: "1px solid #ccc", margin: "0.5rem", padding: "1rem", cursor: "pointer" }}
      onClick={() => navigate(`/fragment/${fragment.id}`)}
    >
      <span>{fragment.title}</span>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span>{formatTags(fragment.tags)}</span>
        <button onClick={(e) => { e.stopPropagation(); toggleModal(true); }}>
          <FaEye />
        </button>
      </div>

      {showModal && (
        <div
          onClick={() => toggleModal(false)}
          className="modal-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            <h3>{fragment.title}</h3>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", overflowX: "auto" }}>{fragment.code}</pre>
            <button onClick={copyToClipboard}>📋 Copier</button>
            <button
              onClick={() => toggleModal(false)}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              ✖
            </button>
          </div>
        </div>

      )}
    </div>
  );
}


export default FragmentCard;
