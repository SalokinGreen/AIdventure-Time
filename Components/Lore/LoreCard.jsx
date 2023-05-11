import React from "react";
import { Card, CardContent, CardMedia, Chip } from "@mui/material";
import styles from "../../Styles/Lore.module.css";

export default function LoreCard({
  image,
  title,
  content,
  keywords,
  id,
  setActiveLore,
}) {
  return (
    <div className={styles.card} onClick={() => setActiveLore(id)}>
      {image !== "" && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="green iguana"
          className={styles.cardImage}
        />
      )}
      <CardContent className={styles.cardContent}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardKeywordsArea}>
          {keywords.map((item, index) => {
            return (
              <Chip
                label={item}
                className={styles.keyword}
                color="info"
                key={index}
              />
            );
          })}
        </div>

        <div className={styles.cardContent}>{content}</div>
      </CardContent>
    </div>
  );
}
