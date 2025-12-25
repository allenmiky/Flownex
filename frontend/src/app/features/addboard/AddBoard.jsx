import { useState } from "react";

export default function AddBoard({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  function handleSubmit() {
    if (!name.trim()) return;

    onSubmit({
      name,
      image,
    });

    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div className="fn-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="fn-modal fn-card">
        <h3 className="fn-modal-title">Create Board</h3>

        <div className="fn-flex fn-gap-md" style={{ flexDirection: "column" }}>
          <input
            className="fn-input"
            placeholder="Board name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <input
            type="file"
            accept="image/*"
            className="fn-input"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="fn-actions">
          <button className="fn-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="fn-btn" onClick={handleSubmit}>
            Create Board
          </button>
        </div>
      </div>
    </>
  );
}
