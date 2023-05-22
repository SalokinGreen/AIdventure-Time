import React from "react";
import { Card, CardContent, CardMedia, Chip } from "@mui/material";
import styles from "../../Styles/Lore.module.css";
import ContentEditable from "react-contenteditable";

export default function LoreCard({
  image,
  title,
  content,
  keywords,
  id,
  setActiveLore,
  index,
}) {
  return (
    <div className={styles.card} onClick={() => setActiveLore(id)} key={index}>
      {image !== "" && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          key={index}
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

        {/* <div className={styles.cardContent}>{content}</div> */}
        <ContentEditable
          html={content}
          disabled={true}
          // tagName="lore"
          className={styles.cardContent}
        />
      </CardContent>
    </div>
  );
}
