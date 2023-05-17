"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Container } from "@mui/material";
import JSZip from "jszip";
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
import checkForKeys from "@/util/front/checkForKeys";
import Map from "@/Components/RPG/map/Map";
import pickUp from "@/util/front/RPG/pickUp";
import db from "@/util/db";
const defaultStats = [
  {
    name: "Strength",
    description:
      "Your strength determines how hard you can hit, how well you can use melee weapons, and how much force you can apply. You can lift heavier objects, break through barriers, or crush your enemies with ease. Strength is important for combat and many activities where you use your body.",
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
      failure: "[ Your body is too weak for this. ]",

      success: "[ You're strong enough for this. ]",
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
    description:
      "Your dexterity determines how well you move, how you're with ranged weapons, and if you can perform acrobatic maneuvers. Dexterity helps in many situations outside combat, like driving and stealth.",
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
      failure: "[ Your movements and reaction time are too slow for this. ]",

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
    description:
      "Your constitution affects how fast you recover from injuries, and how well you take hits. It also affects your ability to resist diseases and poisons. A higher constitution means a faster regeneration rate.",
    level: 0,
    type: "primary",
    triggers: [
      "survive",
      "endure",
      "persist",
      "withstand",
      "tolerate",
      "sustain",
      "persevere",
      "resist",
      "toughen",
      "recover",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "[ Your body is too weak for that. ]",

      success: "[ That's easy for your body. ]",
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
    description:
      "Your intelligence affects your mental abilities and how good you are at using magic and spells. Your mana pool increases based on your Intelligence stat, and you learn new spells quicker. Intelligence also affects how much mana you gain when leveling up.",
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
      failure: "[ Your mind is not sharp enough for that. ]",

      success: "[ That's easy for your mind. ]",
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
    description:
      "Your wisdom determines how well you understand things, including people and animals. It's used for determining spell effects and success rates. It also helps you avoid traps, detect traps, and read runes and ancient texts. Higher wisdom makes it easier to understand others.",
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
      failure: "[ You mind isn't sharp enough for that. ]",

      success: "[ You can do that easily. ]",
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
    description:
      "Your charisma affects how well you interact with others and persuades them into doing what you want. Charisma influences whether people trust you or fear you.",
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
      failure: "[ Your words and body language are weak. ]",

      success: "[ Your words are sweat, and your presence is mesmerizing. ]",
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
    description:
      "Weapon proficiency improves your ability to wield different melee weaponry. You need a weapon to use this skill.",
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
      failure: "[ You're not skilled with this kind of weapon yet. ]",

      success: "[ You're a master of your weapon. ]",
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
    description:
      "Fighting helps with unarmed combat. This skill is wonderful for when you don't have a weapon on you.",
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
      failure: "[ Your fighting skill is terrible. ]",

      success: "[ You're a strong, and great at fighting. ]",
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
    description:
      "Athletics helps you with anything that requires your physical strength outside of combat, such as climbing, swimming, jumping, etc.",
    level: 0,
    type: "secondary",
    triggers: [
      "Jump",
      "Swim",
      "Lift",
      "Throw",
      "Break",
      "Toss",
      "smash",
      "shatter",
      "hold",
      "climb",
    ],
    priority: 2,
    co: ["strength"],
    outcomes: {
      failure: "[ You're not fit enough for this. ]",

      success: "[ You're more than strong enough for this. ]",
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
    console.log("Loading");
    const loadAutoSave = async () => {
      const autoSave = await db.getItem("autosave");
      console.log(autoSave);
      if (autoSave) {
        loadSave(autoSave);
      }
      setLoading(false);
    };

    loadAutoSave();
  }, []);
  const [openSetting, setOpenSetting] = useState(false);
  const [messageNumber, setMessageNumber] = useState(0);
  // Background
  const [bgImage, setBgImage] = useState("https://i.imgur.com/11cQWuD.jpg");
  // AI
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState([]);
  const [memory, setMemory] = useState("");
  const [formate, setFormate] = useState(true);
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
  const [failMessages, setFailMessages] = useState([
    "You try",
    "You're trying",
    "You attempt",
    "You're attempting",
    "You fail",
    "You're failing",
    "You can't",
    "You can not",
    "You are unable",
    "You're unable",
    "Despite your best efforts",
  ]);
  const [health, setHealth] = useState(100);
  const [location, setLocation] = useState("home");
  const [locationName, setLocationName] = useState("Home");
  const [openStats, setOpenStats] = useState(false);
  const [newLocationArray, setNewLocationArray] = useState([
    "look around",
    "check map",
    "go to",
    "walk to",
    "move to",
    "travel to",
  ]);
  const [map, setMap] = useState([
    {
      name: "Home",
      address: "home",
      description: "Your home.",
      keywords: [
        "go home",
        "go to home",
        "walk home",
        "drive home",
        "travel home",
        "go back home",
      ],
      id: 0,
      image: "",
      imagePrompt: "",
      links: [],
      order: 0,
      prompts: [],
    },
  ]);
  const [locationHistory, setLocationHistory] = useState(["home"]);
  const [openMap, setOpenMap] = useState(false);
  const [time, setTime] = useState(0);
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
    const interval = setInterval(async () => {
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

  const autoSaveState = async () => {
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

    await db.setItem("autosave", autoSave);
  };
  const [saves, setSaves] = useState([]);
  const saveState = async () => {
    let currentSaves = (await db.getItem("saves")) || [];

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
    await db.setItem("saves", currentSaves);
    setSaves(currentSaves);
  };
  const loadSave = async (save) => {
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
      generateImage(checkLocation(story[story.length - 1].text));
    }
  };

  const generate = async (input, type, last, retry, story) => {
    let check, newLocation, pick, link, movingTo;
    // console.log("change: ", checkForLinks(input));
    if (input && input !== "") {
      check = skillCheck(input, stats, difficulty, equipment, health);
      if (!check) {
        // check if item is being picked up
        pick = pickUp(input);
        if (pick) {
          console.log("pick-up:", pick);
          // send request to server to pick up item
          const pickUpResponse = await axios
            .post("/api/eval", {
              type: "pickUp",
              story,
              extra: pick,
              model,
            })
            .catch((err) => console.log(err));

          const output = pickUpResponse.data.output;
          // get name from first line
          const name = output.match(/.*/g)[0];
          // get type from "Type: " lines
          const type = output.match(/(?<=Type: ).*/g)[0];
          console.log("name: ", name, "type: ", type);
        } else if (!pick) {
          // add check for links here to see if they're moving somewhere specific
          link = checkForLinks(input);
          // if not moving somewhere specific, check if the new locations exists
          if (!link) {
            movingTo = map.find((location) => {
              return checkForKeys(input, location.keywords);
            });
            // if the location doesn't exist, check if moving happens at all
            if (!movingTo) {
              newLocation = checkForKeys(input, newLocationArray);
            }
          }
        }
      }
    } else if (retry) {
      // remove last story object from story array
      story.pop();
      // if the new last story object is an action, reroll the skill Check.
      if (story[story.length - 1].type === "action") {
        console.log("text: ", story[story.length - 1].text);
        check = skillCheck(
          story[story.length - 1].text,
          stats,
          difficulty,
          equipment,
          health
        );
        // also check for new location
        newLocation = checkForKeys(
          story[story.length - 1].text,
          newLocationArray
        );
      }
    } else if (!input || input === "") {
      // if last story object is an action, reroll the skill Check.
      if (story[story.length - 1].type === "action") {
        check = skillCheck(
          story[story.length - 1].text,
          stats,
          difficulty,
          equipment,
          health
        );
        // also check for new location
        newLocation = checkForKeys(
          story[story.length - 1].text,
          newLocationArray
        );
      }
    }
    console.log(check);
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
          location: locationName,
          newLocation,
          failMessage:
            failMessages[Math.floor(Math.random() * failMessages.length)],
          pickUp,
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
  const generateImage = async (location) => {
    // change location to prompt later
    let error = false;
    const response = await axios
      .post(
        "api/image",
        {
          location,
          key: localStorage.getItem("nai_access_key"),
        },
        {
          responseType: "blob",
        }
      )
      .catch((err) => {
        console.log(err);
        error = true;
      });
    if (!error && response.data) {
      console.log(response);
      const jszip = new JSZip();
      const zip = await jszip.loadAsync(response.data);
      console.log(zip);
      if (zip.files["image_0.png"]) {
        const imageData = await zip.file("image_0.png").async("blob");

        const reader = new FileReader();
        reader.onloadend = function () {
          setBgImage(reader.result); // reader.result contains the base64 data.
        };
        reader.readAsDataURL(imageData);
      }
    }
  };
  const checkForLinks = (input) => {
    // find current location in map where the address is the current location
    const currentLocation = map.find(
      (mapLocation) =>
        mapLocation.address.toLowerCase() === location.toLowerCase()
    );

    // Go through it's links
    let found = false;
    currentLocation.links.forEach((link) => {
      // if the input matches a keyword of the link, change found to the address of the link
      if (checkForKeys(input, link.keywords)) {
        found = link.address;
      }
      // stop searching if found
      if (found) {
        return;
      }
    });
    // return found
    return found;
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
            formate={formate}
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
          location={locationName}
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
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          formate={formate}
          setFormate={setFormate}
          openMap={openMap}
          setOpenMap={setOpenMap}
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
          saves={saves}
          setSaves={setSaves}
          loadSave={loadSave}
          newGame={newGame}
        />
        <Stats open={openStats} setOpen={setOpenStats} />
        <Map map={map} setMap={setMap} open={openMap} setOpen={setOpenMap} />
        <div
          className={styles.imageContainer}
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
      </div>
    );
  }
}
