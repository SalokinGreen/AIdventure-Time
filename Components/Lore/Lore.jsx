import React, { useState } from "react";
import styles from "../../Styles/Lore.module.css";
import { ImPlus } from "react-icons/im";
import { uuid } from "uuidv4";

import { Modal, Card, CardContent, CardMedia, Button } from "@mui/material";
import LoreCard from "./LoreCard";
import LoreEdit from "./LoreEdit";
export default function Lore({
  lore,
  setLore,
  activeLore,
  setActiveLore,
  open,
  setOpen,
}) {
  const [search, setSearch] = useState("");
  const handleAdd = () => {
    const newLore = [...lore];
    newLore.push({
      title: "New Entry",
      content: "",
      image: "",
      keywords: [],
      id: uuid(),
      settings: {
        range: 10,
        priority: 1,
      },
    });
    setLore(newLore);
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
        {activeLore !== null ? (
          <LoreEdit
            lore={lore}
            setLore={setLore}
            setActiveLore={setActiveLore}
            activeLore={activeLore}
          />
        ) : (
          <>
            <div className={styles.searchArea}>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>
            <div className={styles.cardArea}>
              {lore.map((item, index) => {
                return (
                  <LoreCard
                    title={item.title}
                    content={item.content}
                    image={item.image}
                    keywords={item.keywords}
                    index={index}
                    setActiveLore={setActiveLore}
                    id={item.id}
                  />
                );
              })}
            </div>
            <Button
              className={styles.speedDial}
              onClick={handleAdd}
              color="success"
            >
              <ImPlus />
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
