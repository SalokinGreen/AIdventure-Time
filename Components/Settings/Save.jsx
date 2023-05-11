import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import styles from "../../Styles/Saves.module.css";

export default function Save({ save, loadSave, index, setSaves }) {
  const { date } = save;
  const [name, setName] = useState(save.name);
  const nameRef = useRef(null);
  const handleDelete = () => {
    let saves = JSON.parse(localStorage.getItem("saves"));
    saves = saves.filter((_, i) => i !== index);
    localStorage.setItem("saves", JSON.stringify(saves));
    setSaves(saves);
  };
  const handleExport = () => {
    const file = new Blob([JSON.stringify(save)], { type: "application/json" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `${name}.save`;
    link.click();
  };
  const handleNameChange = () => {
    const newName = nameRef.current.innerText;
    setName(newName);

    let saves = JSON.parse(localStorage.getItem("saves"));
    saves[index].name = newName;
    localStorage.setItem("saves", JSON.stringify(saves));
    setSaves(saves);
  };

  return (
    <div className={styles.saveContainer}>
      <div className={styles.saveInfo}>
        <h3
          className={styles.saveName}
          ref={nameRef}
          onBlur={handleNameChange}
          contentEditable
        >
          {name}
        </h3>
        <p className={styles.saveDate}>{new Date(date).toLocaleString()}</p>
      </div>
      <div className={styles.saveButtons}>
        <Button
          variant="contained"
          color="success"
          className={styles.loadButton}
          onClick={() => loadSave(save)}
        >
          Load
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={styles.exportButton}
          onClick={handleExport}
        >
          Export
        </Button>
        <Button
          variant="contained"
          color="error"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
