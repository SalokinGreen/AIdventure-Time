import React, { useEffect, useRef, useState } from "react";
import { GiBroadsword, GiSpeaker, GiFountainPen } from "react-icons/gi";
import styles from "../Styles/Story.module.css";
import { usePrevious } from "react-use";
export default function Story({ story, setStory, generating, setScore }) {
  // Ref for scroll
  const storyRef = useRef();
  //   handle scroll
  const handleScroll = () => {
    const scroll = storyRef.current.scrollHeight;
    storyRef.current.scrollTo(0, scroll);
  };
  // scroll on story change
  const prevStoryLength = usePrevious(story.length);

  useEffect(() => {
    if (prevStoryLength !== undefined && story.length > prevStoryLength) {
      handleScroll();
    }
    setScore(story.length);
  }, [story, prevStoryLength]);
  useEffect(() => {
    handleScroll();
  }, []);
  // edit story
  const handleEdit = (e, index) => {
    const newText = e.target.innerText.replace(/^\n/, "");
    const newStory = [...story];
    newStory[index].text = e.target.innerText;
    setStory(newStory);
    // check if any of the story is empty and rmove it
    const empty = newStory.filter((part) => part.text === "");
    if (empty.length > 0) {
      const newStory = [...story];
      newStory.splice(index, 1);
      setStory(newStory);
    }
  };
  //   delete story
  const handleDelete = (index) => {
    const newStory = [...story];
    newStory.splice(index, 1);
    setStory(newStory);
  };
  // change story type
  const handleType = (type, index) => {
    const newStory = [...story];
    if (type === "action") {
      newStory[index].type = "talk";
    } else if (type === "talk") {
      newStory[index].type = "story";
    } else {
      newStory[index].type = "action";
    }
    setStory(newStory);
  };
  // delete if text is empty and backspace is pressed
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && e.target.innerText === "") {
      handleDelete(index);
    }
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
  const sortedStory = story.sort((a, b) => a.messageNumber - b.messageNumber);
  return (
    <div className={styles.allContainer} ref={storyRef}>
      {sortedStory.map((part, index) => {
        if (part.type === "action") {
          return (
            <div className={styles.actionContainer} key={index}>
              <GiBroadsword
                className={styles.actionIcon}
                size={"3rem"}
                onClick={() => handleType(part.type, index)}
              />
              <div className={styles.actionText}>
                <div
                  className={styles.text}
                  contentEditable={!generating}
                  onBlur={(e) => handleEdit(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  dangerouslySetInnerHTML={{ __html: part.text }}
                  onPaste={handlePaste}
                ></div>
              </div>
            </div>
          );
        } else if (part.type === "story") {
          return (
            <div className={styles.storyContainer} key={index}>
              <GiFountainPen
                className={styles.storyIcon}
                size={"3rem"}
                onClick={() => handleType(part.type, index)}
              />
              <div className={styles.storyText}>
                <div
                  className={styles.text}
                  contentEditable={!generating}
                  onBlur={(e) => handleEdit(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  dangerouslySetInnerHTML={{ __html: part.text.trim() }}
                  onPaste={handlePaste}
                ></div>
              </div>
            </div>
          );
        } else if (part.type === "talk") {
          return (
            <div className={styles.talkContainer} key={index}>
              <GiSpeaker
                className={styles.talkIcon}
                size={"3rem"}
                onClick={() => handleType(part.type, index)}
              />
              <div className={styles.talkText}>
                <div
                  className={styles.text}
                  contentEditable={!generating}
                  onBlur={(e) => handleEdit(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  dangerouslySetInnerHTML={{ __html: part.text }}
                  onPaste={handlePaste}
                ></div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
