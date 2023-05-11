import React, { useState, useEffect } from "react";
import { Button, Chip } from "@mui/material";
import styles from "../../Styles/Lore.module.css";
import Slid from "../Settings/Slid";
export default function LoreEdit({ lore, setLore, activeLore, setActiveLore }) {
  const [active, setActive] = useState(null);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    const activeItem = lore.find((item) => item.id === activeLore);
    setActive(activeItem);
  }, [activeLore]);

  useEffect(() => {
    if (active) {
      const updatedLore = lore.map((item) =>
        item.id === active.id ? active : item
      );
      setLore(updatedLore);
    }
  }, [active]);

  const handleActive = () => {
    setActive({
      ...active,
      settings: { ...active.settings, active: !active.settings.active },
    });
  };

  const handleInputChange = (key) => (e) => {
    setActive({ ...active, [key]: e.target.value });
  };

  const handleContentChange = (e) => {
    setActive({ ...active, content: e.currentTarget.textContent });
  };
  const removeChip = (index) => {
    const newKeywords = [...active.keywords];
    newKeywords.splice(index, 1);
    setActive({ ...active, keywords: newKeywords });
  };
  const setSetting = (key) => (value) => {
    setActive({
      ...active,
      settings: { ...active.settings, [key]: value },
    });
  };
  const handleDelete = () => {
    const newLore = lore.filter((item) => item.id !== active.id);
    setLore(newLore);
    setActiveLore(null);
  };
  return (
    active && (
      <div className={styles.editContainer}>
        <div className={styles.editTitleArea}>
          <input
            id="outlined-basic"
            type="text"
            label="Outlined"
            variant="outlined"
            className={styles.editTitle}
            value={active.title}
            onChange={handleInputChange("title")}
          ></input>
          <button onClick={handleActive} className={styles.editActiveButton}>
            {active.settings.active ? "Active" : "Deactivated"}
          </button>
        </div>
        <div className={styles.editContentArea}>
          <div
            className={styles.editContent}
            onBlur={handleContentChange}
            contentEditable
            dangerouslySetInnerHTML={{ __html: active.content }}
          />
        </div>
        <div className={styles.editKeywordsArea}>
          <div className={styles.editKeywords}>
            {active.keywords.map((item, index) => {
              return (
                <Chip
                  label={item}
                  className={styles.keyword}
                  color="info"
                  onClick={() => removeChip(index)}
                />
              );
            })}
          </div>
          <div className={styles.editKeywordsInput}>
            <input
              label="keyword"
              variant="standard"
              placeholder="Add Keyword"
              value={newKeyword}
              color="info"
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setActive({
                    ...active,
                    keywords: [...active.keywords, newKeyword],
                  });
                  setNewKeyword("");
                }
              }}
              className={styles.keywordInput}
            />
          </div>
        </div>
        <h1 className={styles.settingsTitle}>Settings</h1>
        <div className={styles.settingsContainer}>
          <div className={styles.settings}>
            <Slid
              title="Range"
              value={active.settings.range}
              setValue={setSetting("range")}
              min={1}
              max={200}
              step={1}
            />
            <Slid
              title="Priority"
              value={active.settings.priority}
              setValue={setSetting("priority")}
              min={1}
              max={200}
              step={1}
            />
          </div>
        </div>
        <h1 className={styles.extraTitle}>Extra</h1>

        <div className={styles.extraContainer}>
          <div className={styles.extra}>
            <div className={styles.extraItem}>
              <h2 className={styles.extraItemTitle}>Image</h2>
              <input
                type="text"
                value={active.image}
                onChange={handleInputChange("image")}
                className={styles.extraItemInput}
              />
            </div>
          </div>
          <div className={styles.extra}>
            <div className={styles.extraItem}>
              <h2 className={styles.extraItemTitle}></h2>
              <button
                onClick={() => handleDelete()}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <Button onClick={() => setActiveLore(null)}>Back</Button>
      </div>
    )
  );
}
