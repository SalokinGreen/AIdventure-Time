"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "@mui/material";
import Story from "@/Components/Story";
import Input from "@/Components/Input";
import RightSidePanel from "@/Components/RightSidePanel";
import axios from "axios";
import formatInput from "@/util/front/formateInput";
import Lore from "@/Components/Lore/Lore";
import loreBuilder from "@/util/front/loreBuilder";
import { uuid } from "uuidv4";
import Saves from "@/Components/Settings/Saves";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function Home() {
  // Loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // if (localStorage.getItem("saves")) {
    //   setSaves(JSON.parse(localStorage.getItem("saves")));
    // }
    const autoSave = JSON.parse(localStorage.getItem("autosave"));
    if (autoSave) {
      loadSave(autoSave);
    }
    setLoading(false);
  }, []);
  const [openSetting, setOpenSetting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState([]);
  const [memory, setMemory] = useState("");
  // Lore
  const [openLore, setOpenLore] = useState(false);
  const [lore, setLore] = useState([]);
  const [activeLore, setActiveLore] = useState(null);
  const [savesOpen, setSavesOpen] = useState(false);
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
  // saves
  useEffect(() => {
    const interval = setInterval(() => {
      autoSaveState();
    }, 5000); // autosave every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [
    generating,
    story,
    memory,
    openLore,
    lore,
    activeLore,
    savesOpen,
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
    orderItems,
  ]);

  const autoSaveState = () => {
    const autoSave = {
      name: "Autosave",
      date: Date.now(),
      state: {
        // add all states
        openSetting,
        generating,
        story,
        memory,
        openLore,
        lore,
        activeLore,
        savesOpen,
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
        orderItems,
      },
    };

    localStorage.setItem("autosave", JSON.stringify(autoSave));
  };
  const [saves, setSaves] = useState([]);
  const saveState = () => {
    let currentSaves = JSON.parse(localStorage.getItem("saves")) || [];

    const newSave = {
      name: `Save ${currentSaves.length + 1}`,
      date: Date.now(),
      state: {
        // add all states you want to save here
        openSetting,
        generating,
        story,
        memory,
        openLore,
        lore,
        activeLore,
        savesOpen,
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
        orderItems,
      },
    };

    currentSaves.push(newSave);
    localStorage.setItem("saves", JSON.stringify(currentSaves));
    setSaves(currentSaves);
  };
  const loadSave = (save) => {
    setStory(save.state.story);
    setMemory(save.state.memory);
    setLore(save.state.lore);
    setModel(save.state.model);
    setBiases(save.state.biases);
    setBans(save.state.bans);
    setStopSequences(save.state.stopSequences);
    setTemperature(save.state.temperature);
    setTokens(save.state.tokens);
    setTopP(save.state.topP);
    setTopK(save.state.topK);
    setTfs(save.state.tfs);
    setTopA(save.state.topA);
    setTypicalP(save.state.typicalP);
    setRepetitionP(save.state.repetitionP);
    setPresenceP(save.state.presenceP);
    setFrequencyP(save.state.frequencyP);
    setRepetitionPS(save.state.repetitionPS);
    setRepetitionPR(save.state.repetitionPR);
    setOrderItems(save.state.orderItems);
  };

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
    console.log(loreBuilder(story, lore, input));
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
        lore: loreBuilder(story, lore, input),
        model,
      })
      .catch((err) => {
        console.log(err);
      });
    try {
      const data = response.data;
      console.log(response.data);
      if (data) {
        addOutput(data.replace(/\n\n/g, "\n"), add, extra, type, last);
        console.log(data);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
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
        lore: loreBuilder(story, lore, input),
        model,
      })
      .catch((err) => {
        console.log(err);
      });
    try {
      const data = response.data;
      console.log(response.data);
      if (data) {
        addOutput(data.replace(/\n\n/g, "\n"), add);
        console.log(data);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }

    return setGenerating(false);
  };
  if (loading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>AIdventure Time</h1>
            <CircularProgress color="secondary" />
          </Box>
        </main>
        <div className={styles.imageContainer}></div>
      </div>
    );
  } else {
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
          savesOpen={savesOpen}
          setSavesOpen={setSavesOpen}
        />
        <Lore
          lore={lore}
          setLore={setLore}
          activeLore={activeLore}
          setActiveLore={setActiveLore}
          open={openLore}
          setOpen={setOpenLore}
        />
        <Saves
          open={savesOpen}
          setOpen={setSavesOpen}
          saveState={saveState}
          setSaves={setSaves}
          loadSave={loadSave}
        />
        <div className={styles.imageContainer}></div>
      </div>
    );
  }
}
