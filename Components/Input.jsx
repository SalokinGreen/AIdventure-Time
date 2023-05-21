import React, { useState, useEffect } from "react";
import styles from "../Styles/Input.module.css";
import { Chip, LinearProgress } from "@mui/material";
import {
  GiBroadsword,
  GiSpeaker,
  GiFountainPen,
  GiConsoleController,
} from "react-icons/gi";
import { BsFillPlayFill } from "react-icons/bs";
import { MdReplay } from "react-icons/md";

import { AiFillSetting, AiFillBook } from "react-icons/ai";
import formateInput from "@/util/front/formateInput";
export default function Input({
  story,
  setStory,
  generate,
  retry,
  openSetting,
  setOpenSetting,
  generating,
  setGenerating,
  openLore,
  setOpenLore,
  formate,
}) {
  const [input, setInput] = useState("");
  const [type, setType] = useState("action");
  // get last story object
  const [last, setLast] = useState("action");
  useEffect(() => {
    if (story[0]) {
      setLast(story[story.length - 1].type);
    }
  }, [story]);

  //   handle input

  const handleInput = (e) => {
    setInput(e.target.value);
  };
  const handleEnter = async (e) => {
    const text = e.target.innerText;
    let send = false;
    if (e.key === "Enter") {
      if (generating) return;
      e.preventDefault();
      if (text.match(/[a-z0-9]/i)) {
        send = formate ? formateInput(type, text) : text;
        // order by messageNumber
        let newStory = [...story];
        newStory.sort((a, b) => a.messageNumber - b.messageNumber);
        setStory([...newStory, { type, text: send }]);
      }
      e.target.innerText = "";
      await generate(send, type, last, false, story);
    }
    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      if (type === "action") {
        setType("talk");
      } else if (type === "talk") {
        setType("story");
      } else {
        setType("action");
      }
    }
    // if ctrl + r
    if (e.altKey && e.key === "r") {
      let newStory = [...story];
      newStory.sort((a, b) => a.messageNumber - b.messageNumber);
      newStory.pop();
      setStory(newStory);
      await generate(false, false, last, true, story);
    }
  };

  // handle generate button
  const handleGenerate = async () => {
    if (generating) return;
    let send = false;
    if (input !== "" && input && input.match(/[a-z0-9]/i)) {
      send = formate ? formateInput(type, text) : text;
      // order by messageNumber
      let newStory = [...story];
      newStory.sort((a, b) => a.messageNumber - b.messageNumber);
      setStory([...newStory, { type, text: send }]);
    }
    setInput("");
    await generate(send, type, last, false, story);
  };
  // handle retry button
  const handleRetry = async () => {
    let newStory = [...story];
    newStory.sort((a, b) => a.messageNumber - b.messageNumber);

    newStory.pop();
    setStory(newStory);
    await generate(false, false, last, true, story);
  };
  // handle paste, only text
  const handlePaste = (e) => {
    e.preventDefault();

    // Get pasted data
    const pastedData = (e.clipboardData || window.clipboardData).getData(
      "Text"
    );

    if (pastedData) {
      // If the pasted data is text, insert it at the cursor position
      document.execCommand("insertText", false, pastedData);
    }
  };
  return (
    <div className={styles.inputArea}>
      <div className={styles.settingContainer}>
        <div className={styles.chipContainer}>
          <Chip
            label="Action"
            icon={<GiBroadsword />}
            onClick={() => setType("action")}
            variant={type === "action" ? "filled" : "outlined"}
            color="success"
          />
          <Chip
            label="Talk"
            icon={<GiSpeaker />}
            onClick={() => setType("talk")}
            variant={type === "talk" ? "filled" : "outlined"}
            color="primary"
          />
          <Chip
            label="Story"
            icon={<GiFountainPen />}
            onClick={() => setType("story")}
            variant={type === "story" ? "filled" : "outlined"}
            color="secondary"
          />
        </div>
        <div className={styles.extras}>
          <AiFillSetting
            size="2rem"
            onClick={() => setOpenSetting(!openSetting)}
            className={styles.button}
          />
          <AiFillBook
            size="2rem"
            className={styles.button}
            onClick={() => setOpenLore(!openLore)}
          />
        </div>
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.inputBarContainer}>
          {generating && (
            <LinearProgress color="info" className={styles.progress} />
          )}
          <div
            contentEditable="true"
            className={styles[type]}
            onBlur={handleInput}
            onKeyDown={handleEnter}
            onPaste={handlePaste}
          ></div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles[last]} onClick={() => handleRetry()}>
            <MdReplay size="3rem" />
          </button>
          <button className={styles[type]} onClick={() => handleGenerate()}>
            <BsFillPlayFill size="3rem" />
          </button>
        </div>
      </div>
    </div>
  );
}
