import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import styles from "../../Styles/Stats.module.css";

export default function Stats({ open, setOpen }) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="Stats"
      aria-describedby="Stats"
      className={styles.modal}
    >
      <div> test </div>
    </Modal>
  );
}
