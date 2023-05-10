import React, { useState, useEffect } from "react";
import styles from "../Styles/Input.module.css";
import { Chip } from "@mui/material";
import {
  GiBroadsword,
  GiSpeaker,
  GiFountainPen,
  GiConsoleController,
} from "react-icons/gi";
import { BsFillPlayFill } from "react-icons/bs";
import { MdReplay } from "react-icons/md";
import formatInput from "@/util/front/formateInput";
import { AiFillSetting, AiFillBook } from "react-icons/ai";
import axios from "axios";
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

    if (e.key === "Enter") {
      e.preventDefault();
      let eingabe = false;
      let add = true;
      if (generating) return;
      setGenerating(true);
      setInput(text);
      if (text.match(/[a-z0-9]/i)) {
        eingabe = formatInput(type, text);
        setStory((prev) => [...prev, { type, text: eingabe }]);
        if (type !== "story") {
          add = false;
        }
      }
      // if last story item is not story, dont add to it
      if (last !== "story" && type !== "story") {
        add = false;
      }
      e.target.innerText = "";
      setInput("");
      await generate(type, eingabe, add, eingabe, last);
      setGenerating(false);
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
      await handleRetry();
    }
  };

  // handle generate button
  const handleGenerate = () => {
    let text = false;
    setStory((prev) => [...prev, { type, text: formatInput(type, input) }]);
    // text is input if there are letters or numbers in it
    if (input.match(/[a-z0-9]/i)) {
      text = formatInput(type, input);
    }
    generate(type, text);
    setGenerating(false);
  };
  // handle retry button
  const handleRetry = async () => {
    if (generating) return;
    setGenerating(true);
    await retry(type);
    return setGenerating(false);
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
        <div
          contentEditable="true"
          className={styles[type]}
          onBlur={handleInput}
          onKeyDown={handleEnter}
          onPaste={handlePaste}
        ></div>

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