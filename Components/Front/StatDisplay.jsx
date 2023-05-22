import React, { useState, useEffect } from "react";
import styles from "../../Styles/Stats.module.css";
import { Chip, Accordion, AccordionSummary } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function StatDisplay({
  title,
  description,
  keywords,
  level,
  id,
  setStats,
  type,
  XP,
  setXP,
  difficulty,
  index,
}) {
  const [canUpgrade, setCanUpgrade] = useState(false);
  const [canDowngrade, setCanDowngrade] = useState(false);
  const [cost, setCost] = useState(1);

  const downgrade = () => {
    if (level > 0) {
      if (type === "primary") {
        setXP(XP + 3 * (level ^ difficulty));
        setStats((prev) => {
          return prev.map((stat) => {
            if (stat.id === id) {
              return { ...stat, level: stat.level - 1 };
            } else {
              return stat;
            }
          });
        });
      } else {
        setXP(XP + 1 + level * difficulty);
        setStats((prev) => {
          return prev.map((stat) => {
            if (stat.id === id) {
              return { ...stat, level: stat.level - 1 };
            } else {
              return stat;
            }
          });
        });
      }
    }
  };
  const upgrade = () => {
    if (type === "primary") {
      if (3 * (level ^ difficulty) <= XP) {
        setXP(XP - 3 * (level ^ difficulty));
        setStats((prev) => {
          return prev.map((stat) => {
            if (stat.id === id) {
              return { ...stat, level: stat.level + 1 };
            } else {
              return stat;
            }
          });
        });
      }
    } else {
      if (1 + level * difficulty <= XP) {
        setXP(XP - 1 - level * difficulty);
        setStats((prev) => {
          return prev.map((stat) => {
            if (stat.id === id) {
              return { ...stat, level: stat.level + 1 };
            } else {
              return stat;
            }
          });
        });
      }
    }
  };
  useEffect(() => {
    if (type === "primary") {
      if (3 * (level ^ difficulty) <= XP) {
        setCanUpgrade(true);
      } else {
        setCanUpgrade(false);
      }
    } else {
      if (1 + level * difficulty <= XP) {
        setCanUpgrade(true);
      } else {
        setCanUpgrade(false);
      }
    }
    if (level > 0) {
      setCanDowngrade(true);
    } else {
      setCanDowngrade(false);
    }
  }, [
    XP,
    level,
    type,
    difficulty,
    setStats,
    canUpgrade,
    canDowngrade,
    downgrade,
    upgrade,
  ]);
  return (
    <Accordion style={{ width: "100%" }} key={index}>
      <AccordionSummary
        expandIcon={<FaMinus />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={styles.accordionSummary}
      >
        {title}
      </AccordionSummary>
      <div className={styles.stat}>
        <div className={styles.statDescription}>{description}</div>
        <div className={styles.statKeywords}>
          {keywords.map((keyword, index) => {
            return (
              <Chip
                label={keyword}
                className={styles.keyword}
                color="info"
                key={index}
              />
            );
          })}
        </div>
        <div className={styles.statLevel}>
          <div className={styles.levelTitle}>Level: </div>
          <div className={styles.levelArea}>
            {canDowngrade && (
              <FaMinus className={styles.icon} onClick={() => downgrade()} />
            )}
            <div className={styles.number}>{level}</div>
            {canUpgrade && (
              <FaPlus className={styles.icon} onClick={() => upgrade()} />
            )}
          </div>
        </div>
      </div>
    </Accordion>
  );
}
