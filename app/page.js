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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "You muster all your strength, but it's not enough to achieve the desired outcome. Your efforts leave you exhausted and disappointed, realizing that you need to further develop your raw power.",

      success:
        "You harness your immense strength to overcome the challenge effortlessly. With a show of force, you achieve the desired outcome, leaving no doubt about your exceptional physical power.",
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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "Despite your best efforts, your lack of dexterity becomes evident. Your movements are clumsy and uncoordinated, leading to unintended consequences. It seems your current level of dexterity is not sufficient for this task.",

      success:
        "Your nimble and precise movements showcase your exceptional dexterity. With graceful finesse, you navigate the challenge flawlessly, leaving no doubt about your remarkable agility and precision. Your mastery of dexterity shines through.",
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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "You push your body to its limits, but your endurance wanes, and the strain becomes too much to bear. You gasp for breath, feeling your energy deplete, realizing that your current constitution falls short for this demanding task.",

      success:
        "Drawing upon your unwavering resilience, you push through the challenge with unwavering determination. Your sturdy constitution allows you to withstand the hardships, and you emerge triumphant, knowing that your endurance is unmatched.",
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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "Despite your best attempts to unravel the complexities of the situation, your lack of intelligence becomes evident. Your reasoning falls short, and you struggle to comprehend the intricacies. It seems your current level of intelligence is not enough to overcome this intellectual challenge.",

      success:
        "Your brilliant mind and vast knowledge come to the forefront. With insightful thinking and logical deductions, you unravel the complexities effortlessly, leaving no doubt about your exceptional intelligence. Your intelligence guides you flawlessly.",
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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "Despite your best efforts to analyze and interpret the situation, your lack of wisdom becomes apparent. Your judgment is clouded, and your insights fall short. It seems your current level of wisdom is not enough to navigate this complex scenario.",

      success:
        "Drawing upon your keen insight and profound wisdom, you grasp the true nature of the situation. Your discerning thoughts and shrewd decisions lead you to the right path, leaving no doubt about your exceptional wisdom. Your wisdom guides you flawlessly.",
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
    level: 0,
    type: "primary",
    triggers: [],
    priority: 1,
    co: [],
    outcomes: {
      failure:
        "Despite your best attempts at persuasion, your lack of charisma becomes evident. Your words fall flat, and your charm fails to make an impact. It seems your current level of charisma is not enough to sway others in this situation.",

      success:
        "Your charismatic demeanor and persuasive skills shine through. With charm and eloquence, you successfully captivate your audience, leaving no doubt about your exceptional charisma. Your words carry weight, and others are swayed by your influence.",
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
      failure:
        "Despite your best efforts, your lack of weapon proficiency becomes evident. Your strikes lack precision and fail to find their mark. It seems you need further training to improve your skill with weapons.",

      success:
        "Your extensive training and mastery of weapons shine through. With precise strikes and fluid movements, you demonstrate exceptional proficiency. Your foes tremble before your skill with weapons.",
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
      failure:
        "Despite your best efforts in the fight, your lack of fighting skill becomes evident. Your punches lack power and your strikes are easily evaded. It seems you need further training to improve your fighting abilities.",

      success:
        "With your exceptional fighting skills, you deliver powerful punches and swift strikes. Your evasive maneuvers and timely counters make you a formidable opponent. Your proficiency in fighting is undeniable.",
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
    level: 0,
    type: "secondary",
    triggers: [
      "Jump",
      "Swim",
      "Balance",
      "Vault",
      "Endure",
      "Lift",
      "Throw",
      "Break",
      "Toss",
    ],
    priority: 2,
    co: ["strength"],
    outcomes: {
      failure: "You feel very weak, too weak for that.",

      success: "You are very strong and that will easily succeed.",
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
  const [location, setLocation] = useState("");
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
  };
  const newGame = () => {
    setStory([]);
    setMemory("");
    setLore([]);
    setModel("cassandra");
    setBiases([]);
    setBans([]);
    setStopSequences([]);
    setTemperature(0.5);
    setTokens(25);
    setTopP(1);
    setTopK(0);
    setTfs(0);
    setTopA(0);
    setTypicalP(0);
    setRepetitionP(0);
    setPresenceP(0);
    setFrequencyP(0);
    setRepetitionPS(0);
    setRepetitionPR(0);
    setOrderItems([
      { name: "Nucleus", active: true, value: 2 },
      { name: "Top-K", active: true, value: 1 },
      { name: "Tail-Free Sampling", active: true, value: 3 },
      { name: "Temperature", active: true, value: 0 },
      { name: "Top-A", active: false, value: 4 },
      { name: "Typical Sampling", active: false, value: 5 },
    ]);
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
    setLocation("home");
    setDifficulty(2);
  };

  // Generations
  const addOutput = (input, type, last, gen, story) => {
    if (input && type === "story") {
      // combine input and generation if both are story
      story.push({ type, text: input + gen });
    } else if (input) {
      // add input and generation to story
      story.push({ type, text: input }, { type: "story", text: gen });
    } else if (last === "story" && story[story.length - 1].type === "story") {
      // add generation to last story object in story array
      story[story.length - 1].text += gen;
    } else {
      // add generation to story array
      story.push({ type: "story", text: gen });
    }
    // add generation to story array
    setStory(story);
    // change location if last stor object has location
    if (checkLocation(story[story.length - 1].text)) {
      setLocation(checkLocation(story[story.length - 1].text));
      console.log(checkLocation(story[story.length - 1].text));
    }
  };

  const generate = async (input, type, last, retry) => {
    let check = skillCheck(input, stats, difficulty, equipment, health);
    let newStory = [...story];
    if (retry) {
      // remove last story object from story array
      newStory.pop();
      // if the new last story object is an action, reroll the skill Check.
      if (newStory[newStory.length - 1].type === "action") {
        check = skillCheck(
          newStory[newStory.length - 1].text,
          stats,
          difficulty,
          equipment,
          health
        );
      }
    }
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
          verbosity,
          verbosityValue,
        },
        extra: {
          equipment,
          inventory,
          check,
          location,
        },
        lore: loreBuilder(newStory, lore, input),
        model,
      })
      .catch((err) => {
        console.log(err);
      });
    if (response.data) {
      addOutput(input, type, last, response.data.text, newStory);
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
