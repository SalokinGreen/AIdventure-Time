import React, { useState } from "react";
import styles from "../Styles/NovelaiModal.module.css";
import { Modal } from "@mui/material";
const GooseaiModal = ({ open, setOpen }) => {
    const [key, setKey] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("gooseai-key", key);
    setKey("");
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setOpen(false)}>
          X
        </button>
        <h2 className={styles.modalTitle}>Set your GooseAI api key!</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="key"
            className={styles.input}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default GooseaiModal;