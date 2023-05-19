import React from "react";
import styles from "../../Styles/Stats.module.css";
import { Chip } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
export default function StatDisplay({
  title,
  description,
  keywords,
  level,
  id,
  setStats,
}) {
  return (
    <div className={styles.stat}>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statDescription}>{description}</div>
      <div className={styles.statKeywords}>
        {keywords.map((keyword) => {
          return (
            <Chip label={keyword} className={styles.keyword} color="info" />
          );
        })}
      </div>
      <div className={styles.statLevel}>
        <FaMinus />
        <div className={styles.number}>{level}</div>
        <FaPlus />
      </div>
    </div>
  );
}
