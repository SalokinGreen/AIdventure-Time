import React, { useEffect, useState } from "react";
import styles from "../../Styles/HealthBar.module.css";

function HealthBar({ health }) {
  const [displayHealth, setDisplayHealth] = useState(health);

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayHealth > health) {
        setDisplayHealth(displayHealth - 1);
      } else if (displayHealth < health) {
        setDisplayHealth(displayHealth + 1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [health, displayHealth]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.bar} ${
          displayHealth > 50 ? styles.green : styles.red
        }`}
        style={{ width: `${displayHealth}%` }}
      ></div>
    </div>
  );
}

export default HealthBar;
