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
import checkLocation from "@/util/front/checkLocation";
import Stats from "@/Components/Front/Stats";
import skillCheck from "@/util/front/RPG/skillCheck";
const defaultStats = [
  {
    name: "Strength",
    description: "Your physical strength.",
    level: 0,
    type: "primary",
    triggers: [
      "Lift",
      "Push",
      "Pull",
      "Carry",
      "Bend",
      "Break",
      "Crush",
      "Overpower",
      "Wrestle",
      "Strike",
      "Smash",
      "Shatter",
      "Demolish",
      "Toss",
      "Grapple",
      "Squeeze",
      "Hurl",
      "Subdue",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "You feel too weak for that, it won't work.",

      success: "Your strength and muscles are outstanding, that will be easy.",
    },
    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Dexterity",
    description: "Your agility and reflexes.",
    level: 0,
    type: "primary",
    triggers: [
      "Dodge",
      "Leap",
      "Tumble",
      "Balance",
      "Twist",
      "Flip",
      "Maneuver",
      "Dash",
      "Weave",
      "Evade",
      "Parry",
      "Finesse",
      "Dance",
      "Vault",
      "Slink",
      "Scurry",
      "Swoop",
      "Dart",
      "Crouch",
      "Skim",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "Your body is very slow, that's too hard for you.",

      success: "You move with grace and agility, that will be easy for you.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Constitution",
    description: "Your physical health.",
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure: "Your body is too weak for that.",

      success: "Your body and endurance are strong, that's easy for you.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Intelligence",
    description: "Your mental sharpness.",
    level: 0,
    type: "primary",
    triggers: [
      "Analyze",
      "Solve",
      "Discover",
      "Invent",
      "Decode",
      "Calculate",
      "Research",
      "Investigate",
      "Deduce",
      "Unravel",
      "Strategize",
      "Design",
      "Create",
      "Decipher",
      "Conceptualize",
      "Synthesize",
      "Brainstorm",
      "Evaluate",
      "Innovate",
      "Formulate",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "Your mind is not sharp enough for that.",

      success: "That will be easy for your sharp mind.",
    },
    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Wisdom",
    description: "Your mental health.",
    level: 0,
    type: "primary",
    triggers: [
      "Perceive",
      "Discern",
      "Understand",
      "Intuit",
      "Foresee",
      "Judge",
      "Reflect",
      "Meditate",
      "Interpret",
      "Enlighten",
      "Grasp",
      "Learn",
      "Sense",
      "Comprehend",
      "Investigate",
      "Deliberate",
      "Gain Insight",
      "Acquire Knowledge",
      "Apply Experience",
      "Drive",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "Your mind isn't sharp enough for that.",

      success: "Your wisdom will be more than enough for that.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Charisma",
    description: "Your presence and charisma.",
    level: 0,
    type: "primary",
    triggers: [
      "Persuade",
      "Charm",
      "Influence",
      "Inspire",
      "Entice",
      "Captivate",
      "Convince",
      "Enchant",
      "Flatter",
      "Negotiate",
      "Connect",
      "Engage",
      "Empathize",
      "Radiate",
      "Diplomacy",
      "Mesmerize",
      "Allure",
      "Coax",
      "Enthrall",
      "Command",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "Your words are weak and your presence is is below noticable. That will fail.",

      success:
        "Your words are strong and your presence is is above mersmerizing. That will succeed.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Weapon Proficiency",
    description: "Your weapon handling.",
    level: 0,
    type: "secondary",
    triggers: [
      "slash",
      "cleave",
      "pierce",
      "strike",
      "thrust",
      "parry",
      "block",
      "execute",
      "counter",
      "overwhelm",
      "defend",
      "shatter",
      "demolish",
      "strike",
      "smash",
      "break",
      "crush",
      "overpower",
      "subdue",
      "throw",
    ],
    priority: 10,
    co: ["strength"],
    outcomes: {
      failure: "Your weapon handling is very poor, that's too hard for you.",

      success: "You're a master of your weapon, that will be easy for you.",
    },

    weapon: {
      weapon: true,
      weaponType: "melee",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
  {
    name: "Fighting",
    description: "Your fighting skills.",
    level: 0,
    type: "secondary",
    triggers: [
      "punch",
      "kick",
      "grapple",
      "block",
      "counter",
      "strike",
      "unleash",
      "defend",
      "engage",
      "strike",
      "hit",
      "subdue",
      "smash",
      "wrestle",
      "overpower",
      "slash",
    ],
    priority: 2,
    co: ["strength"],
    outcomes: {
      failure: "Your fighting skills are very poor, that's too hard for you.",

      success: "Your fighting skills are very good, that will be easy for you.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: true,
      armorType: "any",
    },
  },
  {
    name: "Athletics",
    description: "Your ability to perform athletic feats.",
    level: 0,
    type: "secondary",
    triggers: ["Jump", "Swim", "Lift", "Throw", "Break", "Toss"],
    priority: 2,
    co: ["strength"],
    outcomes: {
      failure: "You feel very weak, too weak for that.",

      success: "You are very strong, that will be easy for you.",
    },

    weapon: {
      weapon: false,
      weaponType: "none",
    },
    armor: {
      armor: false,
      armorType: "none",
    },
  },
];

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
  const [messageNumber, setMessageNumber] = useState(0);
  // AI
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState([]);
  const [memory, setMemory] = useState("");
  // RPG - Text-Adventure
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({
    weapon: [],
    armor: [],
    consumable: [],
    ammo: [],
  });
  const [difficulty, setDifficulty] = useState(1);
  const [stats, setStats] = useState(defaultStats);
  const [health, setHealth] = useState(100);
  const [location, setLocation] = useState("Home");
  const [openStats, setOpenStats] = useState(false);
  // Lore
  const [openLore, setOpenLore] = useState(false);
  const [lore, setLore] = useState([]);
  const [activeLore, setActiveLore] = useState(null);
  const [savesOpen, setSavesOpen] = useState(false);
  // Main Settings
  const [model, setModel] = useState("euterpe-v2");
  const [verbosity, setVerbosity] = useState(0);
  const [verbosityValue, setVerbosityValue] = useState(null);
  // Advanced Settings
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
    verbosity,
    verbosityValue,
    score,
    highScore,
    inventory,
    equipment,
    stats,
    health,
    location,
    difficulty,
    stats,
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
        verbosity,
        verbosityValue,
        score,
        highScore,
        inventory,
        equipment,
        stats,
        health,
        location,
        difficulty,
        stats,
        messageNumber,
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
        verbosity,
        verbosityValue,
        score,
        highScore,
        inventory,
        equipment,
        stats,
        health,
        location,
        difficulty,
        stats,
        messageNumber,
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
    setVerbosity(save.state.verbosity);
    setVerbosityValue(save.state.verbosityValue);
    setScore(save.state.score);
    setHighScore(save.state.highScore);
    setInventory(save.state.inventory);
    setStats(save.state.stats);
    setHealth(save.state.health);
    setLocation(save.state.location);
    setDifficulty(save.state.difficulty);
    setStats(save.state.stats);
    setMessageNumber(save.state.messageNumber);
  };
  const newGame = () => {
    setStory([]);
    setMemory("");
    setLore([]);
    setModel("cassandra");
    // setBiases([]);
    // setBans([]);
    // setStopSequences([]);
    // setTemperature(0.5);
    // setTokens(25);
    // setTopP(1);
    // setTopK(0);
    // setTfs(0);
    // setTopA(0);
    // setTypicalP(0);
    // setRepetitionP(0);
    // setPresenceP(0);
    // setFrequencyP(0);
    // setRepetitionPS(0);
    // setRepetitionPR(0);
    // setOrderItems([
    //   { name: "Nucleus", active: true, value: 2 },
    //   { name: "Top-K", active: true, value: 1 },
    //   { name: "Tail-Free Sampling", active: true, value: 3 },
    //   { name: "Temperature", active: true, value: 0 },
    //   { name: "Top-A", active: false, value: 4 },
    //   { name: "Typical Sampling", active: false, value: 5 },
    // ]);
    setVerbosity(2);
    setScore(0);
    setHighScore(0);
    setInventory([]);
    setEquipment({
      weapon: [],
      armor: [],
      consumable: [],
      ammo: [],
    });
    setStats(defaultStats);
    setHealth(100);
    setLocation("Home");
    setDifficulty(2);
    setMessageNumber(0);
  };

  // Generations
  const addOutput = (input, type, last, gen, story) => {
    if (input && type === "story") {
      // combine input and generation if both are story
      story.push({ type, text: input + gen, index: messageNumber });
      setMessageNumber(messageNumber + 1);
    } else if (input) {
      // add input and generation to story
      story.push(
        { type, text: input, index: messageNumber },
        { type: "story", text: gen, index: messageNumber + 1 }
      );
      setMessageNumber(messageNumber + 2);
    } else if (last === "story" && story[story.length - 1].type === "story") {
      // add generation to last story object in story array
      story[story.length - 1].text += gen;
    } else {
      // add generation to story array
      story.push({ type: "story", text: gen, index: messageNumber });
      setMessageNumber(messageNumber + 1);
    }
    // sort story array by index
    story.sort((a, b) => a.index - b.index);
    // add generation to story array
    setStory(story);
    // change location if last stor object has location
    if (checkLocation(story[story.length - 1].text)) {
      setLocation(checkLocation(story[story.length - 1].text));
      console.log(checkLocation(story[story.length - 1].text));
    }
  };

  const generate = async (input, type, last, retry, story) => {
    let check = skillCheck(input, stats, difficulty, equipment, health);

    if (retry) {
      // remove last story object from story array
      story.pop();
      // if the new last story object is an action, reroll the skill Check.
      if (story[story.length - 1].type === "action") {
        check = skillCheck(
          story[story.length - 1].text,
          stats,
          difficulty,
          equipment,
          health
        );
      }
    }
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
          verbosity,
          verbosityValue,
        },
        extra: {
          equipment,
          inventory,
          check,
          location,
        },
        lore: loreBuilder(story, lore, input),
        model,
      })
      .catch((err) => {
        console.log(err);
      });
    if (response.data) {
      addOutput(input, type, last, response.data.text, story);
    }
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
          <Story
            story={story}
            setStory={setStory}
            generating={generating}
            setScore={setScore}
          />
          <Input
            setStory={setStory}
            story={story}
            openSetting={openSetting}
            setOpenSetting={setOpenSetting}
            generate={generate}
            generating={generating}
            setGenerating={setGenerating}
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
          verbosity={verbosity}
          setVerbosity={setVerbosity}
          score={score}
          highScore={highScore}
          location={location}
          setLocation={setLocation}
          health={health}
          setOpenStats={setOpenStats}
          stats={stats}
          setStats={setStats}
          inventory={inventory}
          setInventory={setInventory}
          equipment={equipment}
          setEquipment={setEquipment}
          newGame={newGame}
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
          newGame={newGame}
        />
        {/* <Stats open={openStats} setOpen={setOpenStats} /> */}
        <div className={styles.imageContainer}></div>
      </div>
    );
  }
}
