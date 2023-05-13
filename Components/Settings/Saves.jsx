import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import Save from "./Save";
import { Button } from "@mui/material";
import styles from "../../Styles/Saves.module.css";
export default function Saves({
  open,
  setOpen,
  saveState,
  setSaves,
  loadSave,
  newGame,
}) {
  const saves = JSON.parse(localStorage.getItem("saves")) || [];

  useEffect(() => {
    // get the saves data from local storage when component mounts
    const savedData = localStorage.getItem("saves");
    if (savedData) {
      setSaves(JSON.parse(savedData));
    }
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (readerEvent) => {
        const content = readerEvent.target.result;
        let parsedSave;
        try {
          parsedSave = JSON.parse(content);
        } catch (err) {
          alert("The selected file does not contain valid JSON data.");
          return;
        }
        const newSaves = [...saves, parsedSave];
        localStorage.setItem("saves", JSON.stringify(newSaves));
        setSaves(newSaves); // This will trigger a re-render
      };
      reader.readAsText(file);
    }
  };

  const triggerImport = () => {
    document.getElementById("importInput").click();
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className={styles.modal}
    >
      <div className={styles.modalContainer}>
        <div className={styles.savesArea}>
          {saves.map((save, index) => (
            <Save
              key={index}
              save={save}
              index={index}
              setSaves={setSaves}
              loadSave={loadSave}
            />
          ))}
        </div>
        <Button
          variant="contained"
          color="secondary"
          //   className={styles.saveButton}
          onClick={saveState}
        >
          Save current state
        </Button>
        <input
          accept=".save"
          style={{ display: "none" }}
          id="importInput"
          type="file"
          onChange={handleImport}
        />
        <Button
          variant="contained"
          color="secondary"
          className={styles.importButton}
          onClick={triggerImport}
        >
          Import Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={styles.newGameButton}
          onClick={newGame}
        >
          New Game
        </Button>
      </div>
    </Modal>
  );
}
