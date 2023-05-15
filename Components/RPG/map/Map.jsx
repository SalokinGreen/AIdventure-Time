import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import Tile from "./Tile";
import EditTile from "./EditTile";
import { uuid } from "uuidv4";
import styles from "../../../Styles/Map.module.css";

const Map = ({ map, setMap, open, setOpen }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
      <div className={styles.mapContainer}></div>
    </Modal>
  );
};

export default Map;
