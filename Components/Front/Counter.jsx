import React, { useState, useEffect } from "react";
import styles from "../../Styles/Counter.module.css";

function Counter({ score, title }) {
  const [displayScore, setDisplayScore] = useState(score);
  const defaultDisplay = "0000000000"; // default 10-digit display
  let displayString = "1";
  let digits = "0";
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayScore((prevScore) =>
        prevScore < score
          ? prevScore + 1
          : prevScore > score
          ? prevScore - 1
          : score
      );
    }, 100);
    return () => clearInterval(timer);
  }, [score]);
  try {
    displayString = defaultDisplay + displayScore.toString();
    displayString = displayString.slice(-defaultDisplay.length);

    digits = displayString.split("").map((digit, index) => ({
      digit,
      ledOn: index >= displayString.length - displayScore.toString().length,
    }));
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    if (!displayString) {
      let displayString = defaultDisplay + "0";
      displayString = displayString.slice(-defaultDisplay.length);

      digits = displayString.split("").map((digit, index) => ({
        digit,
        ledOn: index >= displayString.length - displayScore.toString().length,
      }));
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.counter}>
        {digits.map((digit, index) => (
          <div
            key={index}
            className={`${styles.led} ${digit.ledOn ? styles.ledOn : ""}`}
          >
            {digit.digit}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Counter;
