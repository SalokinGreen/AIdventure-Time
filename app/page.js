"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "@mui/material";
import Story from "@/Components/Story";
import Input from "@/Components/Input";
import RightSidePanel from "@/Components/RightSidePanel";
import axios from "axios";
import formatInput from "@/util/front/formateInput";
import Lore from "@/Components/Lore/Lore";
import { uuid } from "uuidv4";
export default function Home() {
  const [openSetting, setOpenSetting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState([]);
  const [memory, setMemory] = useState("");
  // Lore
  const [openLore, setOpenLore] = useState(false);
  const [lore, setLore] = useState([
    {
      title: "Bob Hunter",
      content:
        "Bob Hunter is a former police officer who now works in the FBI. He was assigned to investigate the murders of several women who were killed by an unknown serial killer, but he was unable to discover anything about him. The killings stopped suddenly, and Hunter began searching for clues as to why this happened.",
      keywords: ["Bob", "Hunter"],
      image: "",
      id: uuid(),
      settings: {
        range: 10,
        priority: 1,
        active: true,
      },
    },
    {
      title: "Alice Hunter",
      content:
        "Alice Hunter is the sister of Bob Hunter, and she worked with her brother in investigating the murders. She also became involved romantically with Agent Jack Roth, who helped her brother solve the case.",
      keywords: ["Alice", "Hunter", "Thick Ass"],
      image: "https://i.imgur.com/YnAPgRL.png",
      id: uuid(),
      settings: {
        range: 10,
        priority: 1,
        active: true,
      },
    },
  ]);
  const [activeLore, setActiveLore] = useState(null);
  // Settings
  const [model, setModel] = useState("euterpe-v2");
  const [biases, setBiases] = useState([]);
  const [bans, setBans] = useState([]);
  const [stopSequences, setStopSequences] = useState([]);
  const [temperature, setTemperature] = useState(0.63);
  const [tokens, setTokens] = useState(40);
  const [topP, setTopP] = useState(0.975);
  const [topK, setTopK] = useState(0);
  const [tfs, setTfs] = useState(0.975);
  const [topA, setTopA] = useState(1.0);
  const [typicalP, setTypicalP] = useState(1.0);
  const [repetitionP, setRepetitionP] = useState(2.975);
  const [presenceP, setPresenceP] = useState(0);
  const [frequencyP, setFrequencyP] = useState(0);
  const [repetitionPS, setRepetitionPS] = useState(0.09);
  const [repetitionPR, setRepetitionPR] = useState(2048);
  const [orderItems, setOrderItems] = useState([
    { name: "Nucleus", active: true, value: 2 },
    { name: "Top-K", active: true, value: 1 },
    { name: "Tail-Free Sampling", active: true, value: 3 },
    { name: "Temperature", active: true, value: 0 },
    { name: "Top-A", active: false, value: 4 },
    { name: "Typical Sampling", active: false, value: 5 },
  ]);
  const addOutput = (text, add, extra, type, last) => {
    // If the last item is a story, add to it
    if (extra && type === "story") {
      // remove last story item
      const newStory = [...story];
      newStory.pop();
      // set story to new story + extra
      setStory((prev) => [...newStory, { type: "story", text: extra + text }]);
    } else if (add && last === "story") {
      const newStory = [...story];
      newStory[story.length - 1].text += text;
      setStory(newStory);
    } else {
      setStory((prev) => [...prev, { type: "story", text }]);
    }
  };
  const generate = async (type, input, add, extra, last) => {
    // const input = formatInput(type, generate);
    const response = await axios
      .post("/api/generate", {
        story,
        type,
        input,
        key: localStorage.getItem("nai_access_key"),
        memory,
        parameters: {
          model,
          biases,
          bans,
          stopSequences,
          temperature,
          tokens,
          topP,
          topK,
          tfs,
          topA,
          typicalP,
          repetitionP,
          presenceP,
          frequencyP,
          repetitionPS,
          repetitionPR,
          order: orderItems,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    const data = response.data.output;
    console.log(response.data);
    if (data) {
      addOutput(data.replace(/\n\n/g, "\n"), add, extra, type, last);
      console.log(data);
    } else {
      console.log("error");
    }
  };
  const retry = async (type, input, add) => {
    if (generating) return;
    setGenerating(true);
    const newStory = [...story];
    newStory.pop();
    setStory(newStory);
    const response = await axios
      .post("/api/generate", {
        story: newStory,
        type,
        input,
        key: localStorage.getItem("nai_access_key"),
        memory,
        parameters: {
          model,
          biases,
          bans,
          stopSequences,
          temperature,
          tokens,
          topP,
          topK,
          tfs,
          topA,
          typicalP,
          repetitionP,
          presenceP,
          frequencyP,
          repetitionPS,
          repetitionPR,
          order: orderItems,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    const data = response.data.output;
    console.log(response.data);
    if (data) {
      addOutput(data.replace(/\n\n/g, "\n"), add);
      console.log(data);
    } else {
      console.log("error");
    }
    return setGenerating(false);
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Story story={story} setStory={setStory} generating={generating} />
        <Input
          setStory={setStory}
          story={story}
          openSetting={openSetting}
          setOpenSetting={setOpenSetting}
          generate={generate}
          generating={generating}
          setGenerating={setGenerating}
          retry={retry}
          openLore={openLore}
          setOpenLore={setOpenLore}
        />
      </main>
      <RightSidePanel
        openSetting={openSetting}
        setOpenSetting={setOpenSetting}
        memory={memory}
        setMemory={setMemory}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        tokens={tokens}
        setTokens={setTokens}
        topP={topP}
        setTopP={setTopP}
        topK={topK}
        setTopK={setTopK}
        tfs={tfs}
        setTfs={setTfs}
        topA={topA}
        setTopA={setTopA}
        typicalP={typicalP}
        setTypicalP={setTypicalP}
        repetitionP={repetitionP}
        setRepetitionP={setRepetitionP}
        presenceP={presenceP}
        setPresenceP={setPresenceP}
        frequencyP={frequencyP}
        setFrequencyP={setFrequencyP}
        repetitionPS={repetitionPS}
        setRepetitionPS={setRepetitionPS}
        repetitionPR={repetitionPR}
        setRepetitionPR={setRepetitionPR}
        orderItems={orderItems}
        setOrderItems={setOrderItems}
        biases={biases}
        setBiases={setBiases}
        bans={bans}
        setBans={setBans}
        stopSequences={stopSequences}
        setStopSequences={setStopSequences}
      />
      <Lore
        lore={lore}
        setLore={setLore}
        activeLore={activeLore}
        setActiveLore={setActiveLore}
        open={openLore}
        setOpen={setOpenLore}
      />
      <div className={styles.imageContainer}></div>
    </div>
  );
}
