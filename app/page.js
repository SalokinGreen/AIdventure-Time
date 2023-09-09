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
import Saves from "@/Components/Settings/Saves";
import { CircularProgress, Alert, AlertTitle, Snackbar } from "@mui/material";
import { Box } from "@mui/system";
import checkLocation from "@/util/front/checkLocation";
import Stats from "@/Components/Front/Stats";
import skillCheck from "@/util/front/RPG/skillCheck";
import checkForKeys from "@/util/front/checkForKeys";
import newInput from "@/util/front/RPG/newInput";
import Map from "@/Components/RPG/map/Map";
import pickUp from "@/util/front/RPG/pickUp";
import db from "@/util/db";
import itemLevelGenerator from "@/util/front/RPG/itemLevelGenerator";
import getItemUses from "@/util/front/RPG/getItemUses";
import { uuid } from "uuidv4";
import calculateDamage from "@/util/front/RPG/calculateDamage";
import Inventory from "@/Components/RPG/Inventory";
const defaultStats = [
  {
    name: "Strength",
    description:
      "Your strength determines how hard you can hit, how well you can use melee weapons, and how much force you can apply. You can lift heavier objects, break through barriers, or crush your enemies with ease. Strength is important for combat and many activities where you use your body.",
    level: 0,
    type: "primary",
    keywords: [
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
    id: uuid(),
  },
  {
    name: "Dexterity",
    description:
      "Your dexterity determines how well you move, how you're with ranged weapons, and if you can perform acrobatic maneuvers. Dexterity helps in many situations outside combat, like driving and stealth.",
    level: 0,
    type: "primary",
    keywords: [
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

    id: uuid(),
  },
  {
    name: "Constitution",
    description:
      "Your constitution affects how fast you recover from injuries, and how well you take hits. It also affects your ability to resist diseases and poisons. A higher constitution means a faster regeneration rate.",
    level: 0,
    type: "primary",
    keywords: [
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

    id: uuid(),
  },
  {
    name: "Intelligence",
    description:
      "Your intelligence affects your mental abilities and how good you are at using magic and spells. Your mana pool increases based on your Intelligence stat, and you learn new spells quicker. Intelligence also affects how much mana you gain when leveling up.",
    level: 0,
    type: "primary",
    keywords: [
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
    id: uuid(),
  },
  {
    name: "Wisdom",
    description:
      "Your wisdom determines how well you understand things, including people and animals. It's used for determining spell effects and success rates. It also helps you avoid traps, detect traps, and read runes and ancient texts. Higher wisdom makes it easier to understand others.",
    level: 0,
    type: "primary",
    keywords: [
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

    id: uuid(),
  },
  {
    name: "Charisma",
    description:
      "Your charisma affects how well you interact with others and persuades them into doing what you want. Charisma influences whether people trust you or fear you.",
    level: 0,
    type: "primary",
    keywords: [
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
      "Seduce",
      "Flirt",
    ],
    priority: 1,
    co: [],
    outcomes: {
      failure: "[ Your words and body language are weak. ]",

      success: "[ Your words are sweat, and your presence is mesmerizing. ]",
    },

    id: uuid(),
  },
  {
    name: "Weapon Proficiency",
    description:
      "Weapon proficiency improves your ability to wield different melee weaponry. You need a weapon to use this skill.",
    level: 0,
    type: "secondary",
    keywords: [
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

    id: uuid(),
  },
  {
    name: "Fighting",
    description:
      "Fighting helps with unarmed combat. This skill is wonderful for when you don't have a weapon on you.",
    level: 0,
    type: "secondary",
    keywords: [
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

    id: uuid(),
  },
  {
    name: "Athletics",
    description:
      "Athletics helps you with anything that requires your physical strength outside of combat, such as climbing, swimming, jumping, etc.",
    level: 0,
    type: "secondary",
    keywords: [
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

    id: uuid(),
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
  const [genre, setGenre] = useState("Fantasy");
  const [genres, setGenres] = useState([
    "Fantasy",
    "Science Fiction",
    "Drama",
    "Horror",
    "Mystery",
    "Thriller",
    "Detective Noir",
    "Romance",
    "Erotica",
    "Historical Fiction",
    "Modern",
    "Superheroes",
    "Western",
  ]);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState({
    name: "James",
    race: "human",
    occupation: "bard",
    mental: "You're an adventurous bard who loves to travel and explore.",
    appearance: "You're quite handsome.",
    prose: "You're James the great bard.",
  });
  // RPG - Text-Adventure
  // message
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [healthMessage, setHealthMessage] = useState("");
  const [healthMessageOpen, setHealthMessageOpen] = useState(false);
  // prompts
  const [DCPrompts, setDCPrompts] = useState({
    Fantasy: [
      `***\nSweat rolls down your body. You can feel the cool night air on your skin, but it's not enough to quell your raging temperature. The only thing that keeps you from passing out is the steady stream of adrenaline running through your veins.\n> You continue your job and lift the water bucket.\nProcess: A bucket of water is light. Working while almost passing out makes it harder. Lifting this light things is DC 15.\nDC: 15`,
      `***\nYour blade comes down into the guard's throat with a sickening crunch. He falls backward, his blood spurting onto the stone floor, staining the white marble crimson.\n> You drag the body away.\nProcess: A body is heavy. Dragging heavy things is DC 10.\nDC: 10`,
      `***\n"Do you job!" The man screams at you in broken Common. "Do you job or I'll have you flayed alive! Do you hear me?"\nTears form in your eyes as you turn around, seeing the great boulder before you.\n> You roll the boulder down the hill.\nProcess: Rolling a great boulder is very hart. Rolling it downhill makes it easier. Rolling a great boulder down the hill is DC 5.\nDC: 5`,
      `***\nWith your last hammer swing, the two metals collide and shatter against each other. Sparks fly as the pieces of metal fall apart. With a grunt of effort, you toss the ruined sword aside and pick up the second one lying beside it. "I have to set up the other anvil," you say with a sigh.\n> You lift the anvil.\nProcess: An anvil is heavy. Lifting heavy things is DC 20.\nDC: 20`,
      `***\nThe gate crushes into the ground in front of you while your comrades scream and cry. You look around and you know what you have to do to save them.\n> You open the city gate by force.\nProcess: A city gate is extremely heavy. Opening an extremely heavy city gate is DC 25.\nDC: 25`,
      `***\nYou dance with your party until you accidentally bump into the drunk next to you. You try to apologize, but he doesn't seem to listen to anything anyone says. Instead he takes a swing on you.\n> You duck below his punch.\nProcess: Ducking below a punch is difficult. A drunk is slow and bad at fighting. Ducking below the punch of a drunk is DC 5.\nDC: 5`,
      `***\nThe annoying adventurers party chants for their drinks again, this time louder than ever before. The innkeeper stacked all their drinks onto a single tray for you to bring them. "This is too much," you say, but he just shrugs at you.\n> You carry the tray with drinks to the party.\nProcess: Carrying a tray full of drinks is hard. Carrying a tray full of drinks is DC 10.\nDC: 10`,
      `***\nThe beautiful maiden laughs at your jokes and smiles sweetly at your every word. You can tell that she's smitten with you and you are enjoying her company immensely.\n> You impress her by juggling three knives.\nProcess: Juggling three knives is hard. Juggling three knives is DC 15.\nDC: 15`,
      `***\nThe elephant screams at you and stomps its feet angrily on the ground. Its trunk snaps toward you threateningly. The creature's massive bulk towers over you and its sharp tusks point downward toward you like spears aimed directly at your heart.\n> You roll out of harm's way.\nProcess: An elephant is big and dangerous. Rolling away from an angry elephant is DC 20.\nDC: 20`,
      `***\nYou did it, you stole the beholder's tombstone! But now, the alarm is going. You climb upon the roof, but the constructs almost reached you.\n> You run across the tightrope.\nProcess: Running across a tightrope is very hard. Being under stress makes it harder. Running across this tightrope is DC 25.\nDC: 25`,
      `***\nYou roll below the first arrow fired from above, barely missing your head as you dive behind cover. But as your turn around to smile at the archer who fell for your trick, another arrow hits your shoulder this time.\n> You remove the arrow.\nProcess: Removing arrows is difficult without tools or magic items. Your shoulder isn't a dangerous area. Removing an arrow from your shoulder is DC 10.\nDC: 10`,
      `***\nThe golem's fist cracks loudly against your armor, making you fly back and crash into the wall. A you drop, you can see that there's a big hole where you hit.\n> You stand back up.\nProcess: A golem is very strong. Standing back up after such a powerful hit is DC 20.\nDC: 20`,
      `***\nA snowflake falls onto your face as you drop into the snow. Your heavy breaths are visible as steam clouds in front of you as you try to catch your breath.\n> You march on through the snowstorm.\nProcess: Marching through a snowstorm is very hard. Being exhausted makes it harder. Marching in the deep snow is DC 25.\nDC: 25`,
      `***\n"Does someone remember the name of the town we visited two weeks ago?" asks the bard. "I'm sure I had it written somewhere..."\n> You remember the name of this town.\nProcess: Remembering the name of a town is easy. Remembering something easy is DC 5.\nDC: 5`,
      `***\nThe man in front of you looks at you with a sneer on his face and says, "I don't know why I let him talk me into hiring these adventurers. They don't even know what an owlbear is!"\nMark raises his hand. "Are you calling us stupid?"\n> You recall facts about this beast.\nProcess: Facts about an unknown monster are difficult to recall quickly. Recalling difficult facts is DC 10.`,
      `***\nYou sneak into the cleric's room and find it empty except for a paper on which strange symbols are drawn in blood and a dagger lying on top of it.\n> You solve the riddle.\nProcess: Solving a riddle is hard. Solving a hard riddle is DC 15.\nDC: 15`,
      `***\nA mysterious woman in a dark cloak approaches you as you enter a tavern, her face obscured by shadows cast by lantern light in the tavern windows. Her voice low as she whispers in your ear, "Solve this for the brotherhood."\nShe hands you a note and walks away into the darkness outside as you notice it's written in ancient writing.\n> You decipher the ancient writing.\nProcess: Deciphering ancient writings is very difficult. Deciphering very difficult writing is DC 20.\nDC: 20`,
      `***\n"Excuse me, what are planes of existence?" asks the Princess. The barbarian of the party tries to explain it, but only succeeds in confusing everyone more as he speaks in a language no one understands but himself.\n> You explain the relations between planes of existence.\nProcess: Explaining relationships between different planes of existence is difficult. The different planes of existence are confusing. Explaining something difficult and confusing is DC 25.\nDC: 25`,
      `***\nYou arrive at the destroyed taverns. Countless bodies lie scattered around the place, many of them belonging to adventurers who were unlucky enough to be here when this happened. "What in god's name..." you say.\n> You find out who did this.\nProcess: Finding out who attacked the tavern is hard. The big amount of evidence makes it easier. Finding this out is DC 10.\nDC: 10`,
      `***\nYou're cold as you enter the mansion. You came here to catch the ghost of this dead noblewoman and prove that she was murdered.\n> You spot the ghost.\nProcess: Spotting a ghost is hard.\nSpotting something hard is DC 15.\nDC: 15`,
    ],
  });
  const [pickUpPrompts, setPickUpPrompts] = useState({
    Fantasy: [
      "***\n> You walk into the armory.\nA long room with rows of shelves holding everything from weapons to armor to potions. It's not as big as the one at the academy, but it's still pretty big. There are four other people here besides you and the shopkeeper. The shopkeeper is standing behind his counter, talking to two women who look like they're trying on different clothes. You see them looking through many different things, so you head over to another rack of stuff that holds some basic leather armor and a few shields.\n> You grab a shield.\n----\nItem Generator\nAttributes: common, simple, forged\nName: Simple Shield\nVerbs: use your shield, with your shield, block, defend, withstand\nItem Description: This simple wooden shield is just what you need for protection against enemies!",
      `***\n> You sneak into the dungeon.\nYou sneak past the skeletons and zombies at the entrance, and enter the dungeon. The place is enormous; it must span several levels. The first floor looks pretty normal, with some stairs leading down to deeper parts of the dungeon. A sign in front of an opening says "First Floor".\n> You look for treasures.\nYou hear a noise coming from upstairs, and then something drops onto the ground. As you approach the stairwell, you realize it was a skull. There are three more up there now too. Then you notice each skeleton has a treasure chest next to it.\n> You kill the skeletons.\nYou grab your sword out of your pack and go after the skeletons. They're easy enough to deal with once you get close enough. You swing your sword at them and take care of all of them taking no damage yourself. You notice that one sword has a golden shine and an emerald-like gemstone set into its hilt, while another has a blue gem in its hilt. The third is plain black metal.\n> Pick up the sword.\n----\nItem Generator\nAttributes: amazing, shinny, dwarven\nName: Dwarven Sword\nVerbs: use your sword, with your sword, stab, swing, attack\nItem Description: This ancient dwarven blade will cut through any foe`,
      `***\nYou sneaked into the king's bedroom. He had no guards posted outside, so you were able to just walk right in. You stand there silently in his bedroom, staring at him sleeping peacefully on his bed. His face is peaceful, but he doesn't look very well rested.\n> You put the sleeping potion into his mouth.\nYou put the vial containing the sleep potion under his nose and tip it towards his lips until he drinks it. After a moment you see him stir slightly, then fall back asleep again.\n> You grab the king's crown.\n----\nItem Generator\nAttributes: epic, royal, imperial\nName: Royal Crown\nVerbs: use your crown, with your crown, charm, mesmerize, seduce\nItem Description: A royal crown made of pure gold adorns a noble ruler's head.`,
      `***\nYou wake up in a strange room. You do not know where you are or how you got here, but it's obviously a prison cell of some sort. Your body feels sore all over and your throat is dry from lack of water.\n> You look for water.\nYou check around the room and find a jug sitting on the table in front of the door. It contains water but also a piece of paper folded up inside. When you open it, there is a note written on it. You read it aloud: "If you drink this water and use this key I have provided you with, you will be free."\n> You search for the key.\nYou try every key in your pocket, but none of them fit the lock on your door. The only key that fits is the one you found in the jug with the note. When you turn it, the lock pops open and you step out of your cell.\n> You look around.\nYour surroundings appear to be a small castle courtyard filled with trees and plants growing everywhere. To your left are two stone staircases leading upwards to what appears to be a tower. To your right are four wooden doors leading off from the courtyard. A silver bow is lying in front of you.\n> You grab the bow.\n----\nItem Generator\nAttributes: rare, fancy, elven\nName: Silver Bow\nVerbs: use your bow, with your bow, shoot, arrow, aim at\nItem Description: This fine bow is crafted from precious metals and enchanted by elvish hands.`,
      `***\nYou wake up in a dark forest clearing surrounded by tall trees covered in thick fog. You can barely see anything except for the moonlight shining through the trees above.\n***\n> You enter the potion shop.\nThe door opens up into a large circular room full of shelves holding jars and bottles and bottles of potions of all types. In the center is a counter with several chairs around it and behind it is the shopkeeper, who looks up from her book as she greets you with a smile.\n> You greet her.\n"Welcome to my little store! What can I help you with today?" She asks cheerfully, motioning for you to come closer so she can hear you better.\n> You say, "I want a potion of invisibility."\n"Well," she says, "That would be a rare request indeed!" She sets down her book and walks over to a shelf full of glass bottles and pulls one down. "This potion will make you completely invisible for an hour.\n> Take the potion.\n----\nItem Generator\nAttributes: rare. special, arcane\nName: Potion of Invisibility - Rare Formulation\nVerbs: turn invisible, hide, sneak, unseen, secretly\nItem Description: A rare formulation of potion that makes its user disappear entirely for one hour. Potions may vary in effectiveness based on quality and quantity produced by creator.`,
      `***\nThe kitchen is a long hall with counters running down either side where servants are busy cooking meals for everyone else. There is an enormous fireplace near the end of the hallway and a long table with seats along one wall where you sit down\n> You grab some food from the kitchens.\n----\nItem Generator\nAttributes: legendary, mythic, gnomish\nName: Cooked Steak\nVerbs: with your steak, use your steak, eat your steak\nItem Description: This juicy cut of meat has been cooked perfectly by skilled chefs. It's delicious and tender on the inside!`,
      ,
    ],
  });
  const [loreFinder, setLoreFinder] = useState({
    Fantasy: [
      `***\n"Do you job!" The man screams at you in broken Common. "Do you job or I'll have you flayed alive! Do you hear me?"\nTears form in your eyes as you turn around, seeing the great boulder before you.\n----\nLore Finder\nProcess: Broken Common is special. Lore is common.\nLore: common`,
      `***\nYou're cold as you enter the mansion. You came here to catch the ghost of this dead noblewoman and prove that she was murdered.\n----\nLore Finder\nProcess: Ghosts are interesting. Mansion is special. Lore is ghosts, mansion.\nLore: ghosts, mansion\n`,
      `***\n"Excuse me, what are planes of existence?" asks the Princess. The barbarian of the party tries to explain it, but only confuses everyone more as he speaks in a language no one understands but himself.\n----\nLore Finder\nProcess: Planes of exsitence is special. Princess is special. Barbarians is special. Languages is special. Lore is planes of existence, princess, barbarians, languages.\nLore: planes of existence, princess, barbarians, languages`,
      `***\nA mysterious woman in a dark cloak approaches you as you enter a tavern, her face obscured by shadows cast by lantern light in the tavern windows. Her voice low as she whispers in your ear, "Solve this for the brotherhood."\nShe hands you a note and walks away into the darkness outside as you notice it's written in ancient writing.\n----\nLore Finder\nProcess: Brotherhood is special. Myterious woman is special. Anceint Writing is special. Lore is brotherhood, mysterious woman, ancient writing.\nLore: brotherhood, mysterious woman, ancient writing`,
      `***\nThe man in front of you looks at you with a sneer on his face and says, "I don't know why I let him talk me into hiring these adventurers. They don't even know what an owlbear is!"\nMark raises his hand. "Are you calling us stupid?"\n----\nLore Finder\nProcess: Owlbear is special. Mark is special. Adventurers is special. Lore is owlbear, Mark, adventurers.\nLore: owlbear, Mark, adventurers`,
      `***\nA snowflake falls onto your face as you drop into the snow. Your heavy breaths are visible as steam clouds in front of you as you try to catch your breath.\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\nThe golem's fist cracks loudly against your armor, making you fly back and crash into the wall. As you drop, you can see that there's a big hole where you hit.\n----\nLore Finder\nProcess: Golem is special. Lore is golems.\nLore: golems`,
      `***\n"Does someone remember the name of the town we visited two weeks ago?" asks the bard. "I'm sure I had it written somewhere..."\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\nYou did it, you stole the beholder's tombstone! But now, the alarm is going. You climb upon the roof, but the constructs almost reached you.\n----\nLore Finder\nProcess: Beholder is special. Alarm is special. Lore is beholder, alarm system.\nLore: beholder, alarm system`,
      `***\nThe elephant screams at you and stomps its feet angrily on the ground. Its trunk snaps toward you threateningly. The creature's massive bulk towers over you and its sharp tusks point downward toward you like spears aimed directly at your heart.\n----\nLore Finder\nProcess: Elephants is special. Lore is elephants.\nLore: elephants`,
      `***\nYou've never seen a demon before, but you've heard stories about them being able to control minds and bend people to their will. This one seems pretty docile though - it just sits there watching you. Maybe it won't eat you after all?\n----\nLore Finder\nProcess: Demons is special. Demons eating is special. Lore is demons, demons eating habits.\nLore: demons, demons eating habits`,
      `***\nYou arrive at the destroyed taverns. Countless bodies lie scattered around the place, many of them belonging to adventurers who were unlucky enough to be here when this happened. "What in god's name..." you say.\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\nYou dance with your party until you accidentally bump into the drunk next to you. You try to apologize, but he doesn't seem to listen to anything anyone says. Instead he takes a swing on you.\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\nThe annoying adventurers party chants for their drinks again, this time louder than ever before. The innkeeper stacked all their drinks onto a single tray for you to bring them. "This is too much," you say, but he just shrugs at you.\n----\nLore Finder\nProcess: Adventurer party is special. Drink chanting is special. Innkeeper is special. Lore is adventurer party, drink chanting, innkeepers\nLore: adventurer party, drink chanting, innkeepers`,
      `***\n"You want me to fight a dragon?! Are you insane?" asks the fighter with tears streaming down her cheeks. She throws herself at your feet begging for mercy. "Please... please kill me instead..." she whimpers pathetically. It would have been funny if it wasn't so pathetic. You kick her out of your room without another word.\n----\nLore Finder\nProcess: Dragons is special. Lore is dragons.\nLore: dragons`,
      `***\n"What kind of treasure do we expect from this dungeon?" asks the wizard. The barbarian grunts something unintelligible while the ranger laughs at him and shakes her head in disbelief. "It has a dragon lair inside it! How could it not have any treasure?!" she says excitedly. You're not convinced by her words.\n----\nLore Finder\nProcess: Dungeon is special. Wizard is special. Dragon lair is special. Lore is dungeons, wizards dragon lair.\nLore: dungeons, wizards, dragon lair`,
      `***\n"How does it feel to know that your entire village is doomed because of your incompetence?" asks the man behind the desk as he stares coldly at you. He continues to speak even though he knows he isn't going to get a response out of you. "You couldn't save your own wife and daughter, let alone an entire village full of innocent villagers!"\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\n"What is this strange device?" asks the mage as she holds up a strange metal contraption made entirely out of gears and levers that are connected by thin wires and pulleys. "It's obviously magical in nature." she says as she looks closely at it. "But what is it used for?" she wonders aloud as she tries to figure it out by examining it carefully.\n----\nLore Finder\nProcess: Magic devices is special. Lore is magic devices.\nLore: magic devices`,
      `***\n"We should take a break," says the barbarian as he pulls out a flask of whiskey and starts drinking from it greedily. "Let's rest up for a bit." He then buries his face into his arm and passes out immediately. "Wake me up when we're done," he moans. His speech slurs and he drools on himself slightly as he sleeps deeply.\n----\nLore Finder\nProcess: Barbarian is special. Whiskey is special. Lore is barbarians, whiskey.\nLore: barbarians, whiskey`,
      `***\n"I think I can make some money selling this thing to the king," says the wizard proudly as he shows off his creation. He points to a long tube filled with liquid. It's attached to a small tank where he keeps his potions stored safely away. He uses a glass vial to fill a second container with a greenish fluid. Then he pours the contents into a large bottle which he seals tightly before handing it to the knight next to him.\n----\nLore Finder\nProcess: Potions is special. Lore is potions.\nLore: potions`,
      `***\nThe old woman stands on the street corner looking at you accusingly. Her eyes look like they might start bleeding at any moment due to her age. "I told you I'd be able to find someone better than those fools! What did I tell you?"\n----\nLore Finder\nProcess: None is special. Lore is none.\nLore: none`,
      `***\n"You're lucky that we're in the middle of a city," says the ranger as she looks around at the crowd of people passing through the streets of the city. "Otherwise I'd have killed you already for what you've done." She turns towards you and glares at you with an angry expression on her face. "I'm going to let my companion handle this one," she says as she hands you over to the rogue next to her who looks like he's ready to cut your head off right away.\n----\nLore Finder\nProcess: City is special. Ranger is special. Companion is special. Lore is cities, rangers, companions.\nLore: cities, rangers, companions`,
    ],
  });
  const [loreWriter, setLoreWriter] = useState({
    Fantasy: [
      `***\n"Do you job!" The man screams at you in broken Common. "Do you job or I'll have you flayed alive! Do you hear me?"\nTears form in your eyes as you turn around, seeing the great boulder before you.\n----\nLore Writer\nTopic: broken common\nKeywords: broken common\nLore: Broken common is a language spoken by a small tribe of goblins on the outskirts of the elven kingdom of Avalon. It was created from bits and pieces of many languages, including elvish, gnomish, and dwarven.`,
      `***\nYou're cold as you enter the mansion. You came here to catch the ghost of this dead noblewoman and prove that she was murdered.\n----\nLore Writer\nTopic: ghosts\nKeywords: ghosts, ghost\nLore: Ghosts are spirits of deceased creatures that refuse to pass into the afterlife. They remain earthbound and can be summoned through magic rituals. Most people believe ghosts haunt places they were once attached to, such as houses or graves.`,
      `***\n"Excuse me, what are planes of existence?" asks the Princess. The barbarian of the party tries to explain it, but only confuses everyone more as he speaks in a language no one understands but himself.\n----\nLore Writer\nTopic: planes of existence\nKeywords: planes of existence\nLore: Planes of Existence is a term used by many wizards and mages to describe different realms of existence. There are four main planes; Prime Material (Earth), Astral, Ethereal, and Shadow.`,
      `***\nA mysterious woman in a dark cloak approaches you as you enter a tavern, her face obscured by shadows cast by lantern light in the tavern windows. Her voice low as she whispers in your ear, "Solve this for the brotherhood."\nShe hands you a note and walks away into the darkness outside as you notice it's written in ancient writing.\n----\nLore Writer\nTopic: ancient writing\nKeywords: ancient writing\nLore: Ancient writing is the script found on old books, parchments, and stone tablets dating back thousands of years ago. Most scholars agree that the first written records appeared sometime during the Sumerian Empire.`,
      `***\nThe man in front of you looks at you with a sneer on his face and says, "I don't know why I let him talk me into hiring these adventurers. They don't even know what an owlbear is!"
      Mark raises his hand. "Are you calling us stupid?"\n----\nLore Writer\nTopic: owlbear\nKeywords: owlbear, owlbears\nLore: An owlbear is a large, bipedal beast resembling both a bear and an owl. They stand about 6 feet tall when standing upright, weighing over 500 pounds.`,
      `***\nThe golem's fist cracks loudly against your armor, making you fly back and crash into the wall. As you drop, you can see that there's a big hole where you hit.\n----\nLore Writer\nTopic: golem\nKeywords: golem, giant statues made out of rock\nLore: Golems are animated constructs created through powerful magic spells or divine intervention. These creatures are usually made of stone or clay. Some are intelligent enough to speak and carry out simple instructions while others are mindless automatons controlled.`,
      `***\nYou did it, you stole the beholder's tombstone! But now, the alarm is going. You climb upon the roof, but the constructs almost reached you.\n----\nLore Writer\nTopic: beholder\nKeywords: beholder, eye tyrant\nLore: Beholders are a race of eyestalks who live inside their own gigantic eyeballs located in caverns deep underground. They use magic to control their slaves and other beholders to do their bidding.`,
      `***\nThe elephant screams at you and stomps its feet angrily on the ground. Its trunk snaps toward you threateningly. The creature's massive bulk towers over you and its sharp tusks point downward toward you like spears aimed directly at your heart.\n----\nLore Writer\nTopic: elephants\nKeywords: elephants, elephant, pachyderm\nLore: Elephants are mammals native to tropical Africa. Their closest relatives are extinct proboscideans from Europe and Asia known as wooly mammoths. Males grow to be 11 feet tall and weigh 10 tons.`,
      `***\nYou've never seen a demon before, but you've heard stories about them being able to control minds and bend people to their will. This one seems pretty docile though - it just sits there watching you. Maybe it won't eat you after all?\n----\nLore Writer\nTopic: demons\nKeywords: demons, demon, devil spawn\nLore: Demons are evil beings born from corrupted souls trapped within hell. They often serve as servants to devils or worshipers of dark gods. Demons possess great magical powers and are extremely dangerous adversaries.`,
      `***\nThe annoying adventurers party chants for their drinks again, this time louder than ever before. The innkeeper stacked all their drinks onto a single tray for you to bring them. "This is too much," you say, but he just shrugs at you.\n----\nLore Writer\nTopic: adventurers\nKeywords: adventurers\nLore: Adventurers are skilled warriors who make their living fighting monsters for rewards in the dungeons and wildernesses of the world. They can also be found as mercenaries or bodyguards for nobles and wealthy merchants throughout the world.`,
      `***\n"You want me to fight a dragon?! Are you insane?" asks the fighter with tears streaming down her cheeks. She throws herself at your feet begging for mercy. "Please... please kill me instead..." she whimpers pathetically. It would have been funny if it wasn't so pathetic. You kick her out of your room without another word.\n----\nLore Writer\nTopic: dragons\nKeywords: dragons, dragon\nLore: Dragons are large reptilian beasts that inhabit the far reaches of the sky and earth. They have long lifespans and can be found on most continents on Earth, with the exception of Antarctica due to the extreme cold climate.`,
      `***\n"What kind of treasure do we expect from this dungeon?" asks the wizard. The barbarian grunts something unintelligible while the ranger laughs at him and shakes her head in disbelief. "It has a dragon lair inside it! How could it not have any treasure?!" she says excitedly. You're not convinced by her words.\n----\nLore Writer\nTopic: dragon lair\nKeywords: dragon lair, dragon caves, wyrm lair, wyrm caves\nLore: Dragon Lairs are hidden areas beneath mountains and hillsides that contain a number of nests and lairs built by dragons over generations.`,
      `***\n"What is this strange device?" asks the mage as she holds up a strange metal contraption made entirely out of gears and levers that are connected by thin wires and pulleys. "It's obviously magical in nature." she says as she looks closely at it. "But what is it used for?" she wonders aloud as she tries to figure it out by examining it carefully.\n----\nLore Writer\nTopic: magic devices\nKeywords: magic devices, magic artifacts\nLore: Magic is a supernatural ability that allows its user to perform incredible feats that otherwise seem impossible to those without magic.`,
      `***\n"We should take a break," says the barbarian as he pulls out a flask of whiskey and starts drinking from it greedily. "Let's rest up for a bit." He then buries his face into his arm and passes out immediately. "Wake me up when we're done," he moans. His speech slurs and he drools on himself slightly as he sleeps deeply.\n----\nLore Writer\nTopic: barbarians\nKeywords: barbarian, barbarians\nLore: Barbarians are fierce, warlike people who live in tribes across the world's wilder regions. They often spend their days hunting game or raiding settlements for supplies, which they trade to other nearby tribes or sell to traveling merchants and caravans that pass through their lands.`,
      `***\n"I think I can make some money selling this thing to the king," says the wizard proudly as he shows off his creation. He points to a long tube filled with liquid. It's attached to a small tank where he keeps his potions stored safely away. He uses a glass vial to fill a second container with a greenish fluid. Then he pours the contents into a large bottle which he seals tightly before handing it to the knight next to him.\n----\nLore Writer\nTopic: potion making\nKeywords: potion making, alchemy\nLore: Alchemy is the art of creating powerful magical items using natural ingredients and simple tools such as cauldrons, furnaces, mortars, pestles, and alembics. The goal is usually to create an item that has special effects or abilities beyond the scope of normal magic.`,
      `***\n"You're lucky that we're in the middle of a city," says the ranger as she looks around at the crowd of people passing through the streets of the city. "Otherwise I'd have killed you already for what you've done." She turns towards you and glares at you with an angry expression on her face. "I'm going to let my companion handle this one," she says as she hands you over to the rogue next to her who looks like he's ready to cut your head off right away.\n----\nLore Writer\nTopic: cities\nKeywords: cities, town, urban life\nLore: Cities are densely populated urban areas that house thousands or even millions of people who live together in close quarters in order to share resources and build public works such as schools and libraries.`,
    ],
  });
  const [damageFinder, setDamageFinder] = useState({
    Fantasy: [
      `***\n"Do you job!" The man screams at you in broken Common. "Do you job or I'll have you flayed alive! Do you hear me?"\nTears form in your eyes as you turn around, seeing the great boulder before you.\n----\nYour Health Detector\nProcess: The player did not fight. The player did not take damage. The damage is none.\nPlayer Damage Taken: none`,
      `***\nThe golem's fist cracks loudly against your armor, making you fly back and crash into the wall. As you drop, you can see that there's a big hole where you hit.\n----\nYour Health Detector\nProcess: The player got hit. A golem is very strong. The damage is high.\nPlayer Damage Taken: high`,
      `***\nYour blade sinks into the throat of the guard, but he still manages to scream out his warning as blood spills down over your armor. Your blade pulls free as his body hits the ground with a wet thud. You wipe it on your shirt and look up at the guardsman.\n----\nYour Health Detector\nProcess: The player attacks the guard. The player dodged all damage. The damage is none.\nPlayer Damage Taken: none`,
      `***\nYou dodge the first two arrows, but as you turn around, you're not quick enough and take one to the left arm. It makes an annoying little ping noise as it passes through your armor. But then the third arrow flies past your head and strikes the stone wall behind you.\n----\nYour Health Detector\nProcess: The player got hit. An arrow is small. The damage is low.\nPlayer Damage Taken: low`,
      `***\nYou jump away from the creature's claws, but they still catch your shoulder and send you spinning to the side. Your sword comes loose from your hand as you fall onto your backside. The creature looms above you, its claws ready to strike again.\n----\nYour Health Detector\nProcess: The player got hit. The creature sounds dangerous. The damage is medium.\nPlayer Damage Taken: medium`,
      `***\nYour sword slices deep into the creature's belly, and it lets out an awful gurgle as it tries to bring itself upright again. Its claws scrape along the floor as it falls backwards, slamming into the floor hard enough to make the whole room shake.\n----\nYour Health Detector\nProcess: The player did the attack. The player dodged all attacks. The damage is none.\nPlayer Damage Taken: none`,
      `***\nYou swing your sword upwards just in time to block one of the incoming blows, and feel a jolt run up your arm. Your attacker is so close that you can smell its breath, and it snarls angrily at you, trying to force its way inside your guard.\n----\nYour Health Detector\nProcess: The player took damage while blocking. The player blocked damage. The damage is low.\nPlayer Damage Taken: low`,
      `***\nYour opponent's axe smashes into the top of your shoulder, knocking you off balance and forcing you to stagger backwards.\n----\nYour Health Detector\nProcess: The player got hit by the weapon. The attack was successful. The damage is medium.\nPlayer Damage Taken: medium`,
      `***\n"So, what are you doing later?" asks the Princess with a spark in her eyes. "I'm sure we could find something fun for us both." You try to think of a witty reply, but all you manage is some incoherent mumbling. She smiles at you and walks away, leaving you alone once more.\n----\nYour Health Detector\nProcess: The player talked to the princess. The player dodged all damage. The damage is none.\nPlayer Damage Taken: none`,
      `***\nYou duck under the blow aimed at your head and step forward, swinging your hammer at the goblin's legs. It stumbles sideways but doesn't let go of its weapon, which brings you face to face with it.\n----\nYour Health Detector\nProcess: The player fought the goblin. The goblin died. The damage is none.\nPlayer Damage Taken: none`,
      `***\nYou roll for your life, but you're not faster than the dragon's breath and end up being scorched by its flame instead. You're thrown clear of the flames, only to be knocked aside by the dragon's tail. As you land heavily on your back, you realize that this isn't going to help your situation any.\n----\nYour Health Detector\nProcess: The player got attacked by the dragon. The attack was successful. The damage is high.\nPlayer Damage Taken: high`,
      `***\nYour sword slides across the scorpion's carapace, slicing deep into its hide without penetrating too deeply. It snaps its tail at you but misses.\n----\nYour Health Detector\nProcess: The player attacked the scorpion. The scorpion missed its attack on the player. The damage is none.\nPlayer Damage Taken: none`,
      `***\nThe drunk runs into you. "Ey, fuck you!" he says before turning around and throwing up on himself again. You grab him by his shirt collar and haul him upright again, giving him a shake to try and make him focus on your words rather than his puke-filled mouth. "Listen here," you say slowly and clearly, but he gives you a right hook.\n----\nYour Health Detector\nProcess: The player got attacked by the drunkard. The attack is successful. The damage is low.\nPlayer Damage Taken: low`,
      `***\nThe goblin's blade cuts deep into your flesh, and blood spills over your armor as it bites deeper, tearing open your skin like butter made from raw meat. You can hear bones cracking within your armor as you struggle to keep hold of your weapon, even as the pain becomes unbearable.\n----\nYour Health Detector\nProcess: The player was hit by an enemy weapon. The enemy was a goblin. The damage is medium.\nPlayer Damage Taken: medium`,
      `***\nThe annoying village child screams at you again as she kicks your shins with her bare feet and tries to trip you up as you move through town.\n----\nYour Health Detector\nProcess: The player was attacked by a small child. A child is weak. The damage is low.\nPlayer Damage Taken: low`,
      `***\nYou raise your shield up just in time to stop the sword strike aimed at your chest and knock it aside with a loud clang! You take a step forward, raising your own blade as another guard steps up beside his injured companion.\n----\nYour Health Detector\nProcess: The player fought another guard. The player defeated another guard in melee combat. The damage is none.\nPlayer Damage Taken: none`,
      `***\n"What do we have here?" asks the man with his hand outstretched towards you. "Looks like we caught ourselves a pretty little thief." He takes your dagger from you as his companion approaches with his sword raised high above his head.\n----\nYour Health Detector\nProcess: Nobody attacked anybody else or did anything else interesting. There is no change in state or status information. The damage is none.\nPlayer Damage Taken: none`,
      `***\nThe wizard points with his staff at you, chanting a spell as he does so. A ball of fire forms at his fingertip, and it flies through the air straight towards you! You're just able to dive out of the way in time as it explodes against the stone wall behind you, showering sparks everywhere and blasting your away.\n----\nYour Health Detector\nProcess: The wizard cast a spell at the player. The wizard's spell hit the player. The damage is high.\nPlayer Damage Taken: high`,
      `***\nThe guardsman's sword strikes home, driving through your armor and sinking deep into your side with an agonizing stab that nearly knocks the breath from you entirely. You cry out in pain as he withdraws his blade and drives it in again, cutting further into your flesh as blood pours down over your breastplate and onto the floor beneath you.\n----\nYour Health Detector\nProcess: The player was attacked by a guardsman's weapon while wearing light armor or unarmored (unarmored). The damage is medium.\nPlayer Damage Taken: medium`,
      `***\nYour sword slices through the goblin's neck with ease, severing its spine in one smooth movement, and leaving a gurgling mess behind you as it falls to the floor, twitching violently before dying completely.\n----\nYour Health Detector\nProcess: The player killed a goblin with their sword successfully. The damage is none.\nPlayer Damage Taken: none`,
    ],
  });
  const [damageDetector, setDamageDetector] = useState({
    Fantasy: [
      "Attack",
      "Attacks",
      "Strike",
      "Strikes",
      "Hit",
      "Hits",
      "Wound",
      "Wounds",
      "Hurt",
      "Hurts",
      "Shoot",
      "Shoots",
      "Stab",
      "Stabs",
      "Slash",
      "Slashes",
      "Burn",
      "Burns",
      "Freeze",
      "Freezes",
      "Blast",
      "Blasts",
      "Explode",
      "Explodes",
      "Punch",
      "Punches",
      "Kick",
      "Kicks",
      "Bite",
      "Bites",
      "Poison",
      "Poisons",
      "Electrocute",
      "Electrocutes",
      "Crush",
      "Crushes",
      "Cleave",
      "Cleaves",
      "Smite",
      "Smites",
      "Charge",
      "Charges",
      "Cast",
      "Casts",
      "Injure",
      "Injures",
      "Assault",
      "Assaults",
      "Bash",
      "Bashes",
      "Claw",
      "Claws",
      "Whack",
      "Whacks",
      "Pierce",
      "Pierces",
      "Thrash",
      "Thrashes",
      "Slice",
      "Slices",
      "Pain",
      "Spell",
      "Arrow",
      "Arrows",
      "Fire",
      "Flame",
      "Choke",
      "Chokes",
    ],
  });
  // Player Level
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [XP, setXP] = useState(1);
  // Items
  const [itemWords, setItemWords] = useState({
    common: [
      "simple",
      "scratched",
      "old",
      "rusty",
      "dull",
      "worn",
      "dirty",
      "plain",
      "second-hand",
      "cheap",
      "scraps",
      "dangerous",
    ],
    amazing: [
      "shiny",
      "new",
      "clean",
      "polished",
      "bright",
      "sparkling",
      "gleaming",
      "glossy",
      "pristine",
      "sturdy",
      "quality",
      "fine",
      "durable",
      "polished",
      "strong",
    ],
    rare: [
      "unique",
      "special",
      "exotic",
      "magnificent",
      "beautiful",
      "gorgeous",
      "stunning",
      "spectacular",
      "wonderful",
      "marvelous",
      "fantastic",
      "incredible",
      "astonishing",
      "awe-inspiring",
      "breathtaking",
      "extraordinary",
      "remarkable",
      "unbelievable",
    ],
    epic: [
      "mind-blowing",
      "impressive",
      "elegant",
      "precise",
      "elite",
      "exquisite",
      "majestic",
      "grand",
      "radiant",
      "magnificient",
      "powerful",
      "stunning",
      "superior",
      "heroic",
      "imperial",
      "mythical",
    ],
    legendary: [
      "mythic",
      "heroic",
      "divine",
      "godly",
      "utlimate",
      "sacred",
      "supreme",
      "exalted",
      "unrivaled",
      "celestial",
      "omniscient",
    ],
  });
  const [genreWords, setGenreWords] = useState({
    Fantasy: [
      "arcane",
      "magical",
      "mythical",
      "cursed",
      "blessed",
      "dragonforged",
      "elven",
      "dwarven",
      "gnomish",
      "spellbound",
      "elemental",
      "necromantic",
      "enchanted",
      "divine",
      "holy",
      "celestial",
      "infernal",
      "demonic",
      "fey-touched",
      "runed",
      "shadowy",
      "ethereal",
      "vampiric",
      "forged",
      "imperial",
    ],
  });
  const [pickUpKeys, setPickUpKeys] = useState([
    "pick up",
    "pick it up",
    "grab it",
    "take it",
    "get it",
    "take the",
    "take a",
  ]);
  const [inventory, setInventory] = useState([
    {
      name: "Sword",
      description: "A simple sword",
      attributes: "",
      uses: 10,
      keywords: ["with sword", "use sword", "using sword", "stab", "slash"],
      id: uuid(),
      priority: 0,
    },
  ]);
  const [openInventory, setOpenInventory] = useState(false);
  // remove equipment
  const [equipment, setEquipment] = useState({
    weapon: [],
    armor: [],
    consumable: [],
    ammo: [],
  });
  // Abilities
  const [abilities, setAbilities] = useState([]);
  const [skillTree, setSkillTree] = useState([]);
  const [openAbilities, setOpenAbilities] = useState(false);
  // Difficulty
  const [difficulty, setDifficulty] = useState(1);
  const [difficultyName, setDifficultyName] = useState({
    1: "Easy",
    2: "Normal",
    3: "Hard",
    4: "Nightmare",
  });
  const [DCs, setDCs] = useState({
    easy: 5,
    normal: 10,
    hard: 15,
    nightmare: 20,
  });
  // Stats
  const [stats, setStats] = useState(defaultStats);
  const [failMessages, setFailMessages] = useState([
    "You try",
    "You're trying",
    "You attempt",
    "You fail",
    "You're failing",
    "You can't",
    "You can not",
    "You are unable",
    "You're unable",
    "Despite your best efforts",
  ]);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [energyWord, setEnergyWord] = useState("mana");
  // Location / Map
  const [location, setLocation] = useState("home");
  const [locationName, setLocationName] = useState("Home");
  const [openStats, setOpenStats] = useState(false);
  const [newLocationArray, setNewLocationArray] = useState([
    "check map",
    "go to",
    "walk to",
    "move to",
    "travel to",
    "enter the",
    "check location",
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
  const [model, setModel] = useState("cassandra-lit-6-9b");
  const [models, setModels] = useState("GooseAI");
  const [evalModel, setEvalModel] = useState("clio-v1");

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
  const [repetitionP, setRepetitionP] = useState(1.148125);
  const [presenceP, setPresenceP] = useState(0);
  const [frequencyP, setFrequencyP] = useState(0);
  const [repetitionPS, setRepetitionPS] = useState(0.09);
  const [repetitionPR, setRepetitionPR] = useState(2048);
  const [cfg_scale, setCfg_scale] = useState(0.0);
  const [phrase_rep_pen, setPhrase_rep_pen] = useState("very_aggressive");
  const [top_g, setTop_g] = useState(1.0);
  const [mirostat_tau, setMirostat_tau] = useState(0.0);
  const [mirostat_lr, setMirostat_lr] = useState(0.0);
  const [orderItems, setOrderItems] = useState([
    { name: "Nucleus", active: true, value: 2 },
    { name: "Top-K", active: true, value: 1 },
    { name: "Tail-Free Sampling", active: true, value: 3 },
    { name: "Temperature", active: true, value: 0 },
    { name: "Top-A", active: false, value: 4 },
    { name: "Typical Sampling", active: false, value: 5 },
    { name: "CFG", active: false, value: 6 },
    { name: "Top-G", active: false, value: 7 },
    { name: "Mirostat", active: false, value: 8 },
  ]);
  const [evalSettings, setEvalSettings] = useState({
    tokens: 100,
    temperature: 0.63,
    topP: 0.975,
    topK: 0,
    tfs: 0.975,
    topA: 1.0,
    typicalP: 1.0,
    repetitionP: 1.148125,
    presenceP: 1.0,
    frequencyPenalty: 0.0,
    repetitionP: 0.0,
    repetitionPR: 2048,
    repetitionPS: 0.09,
    orderItems: [
      { name: "Nucleus", active: true, value: 2 },
      { name: "Top-K", active: true, value: 1 },
      { name: "Tail-Free Sampling", active: true, value: 3 },

      { name: "Temperature", active: true, value: 0 },
      { name: "Top-A", active: false, value: 4 },
      { name: "Typical Sampling", active: false, value: 5 },
    ],
    biases: [],
    bans: [],
    stopSequences: [],
  });
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
    cfg_scale,
    phrase_rep_pen,
    top_g,
    mirostat_lr,
    mirostat_tau,
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
        cfg_scale,
        phrase_rep_pen,
        top_g,
        mirostat_lr,
        mirostat_tau,
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
        cfg_scale,
        phrase_rep_pen,
        top_g,
        mirostat_lr,
        mirostat_tau,
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
    setCfg_scale(save.state.cfg_scale);
    setPhrase_rep_pen(save.state.phrase_rep_pen);
    setTop_g(save.state.top_g);
    setMirostat_lr(save.state.mirostat_lr);
    setMirostat_tau(save.state.mirostat_tau);
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
    // setCfg_scale(0);
    // setPhrase_rep_pen("Off");
    // setTop_g(0);
    // setMirostat_lr(0);
    // setMirostat_tau(0);
    // setOrderItems([
    //   { name: "Nucleus", active: true, value: 2 },
    //   { name: "Top-K", active: true, value: 1 },
    //   { name: "Tail-Free Sampling", active: true, value: 3 },
    //   { name: "Temperature", active: true, value: 0 },
    //   { name: "Top-A", active: false, value: 4 },
    //   { name: "Typical Sampling", active: false, value: 5 },
    //   { name: "CFG", active: false, value: 6 },
    //   { name: "Top-G", active: false, value: 7 },
    //   { name: "Mirostat", active: false, value: 8 },
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

  // Eval
  const evalStory = async (prompts, story, input, type) => {
    const naiKey = localStorage.getItem("nai_access_key");
    const gooseKey = localStorage.getItem("gooseai-key");
    const response = await axios
      .post("/api/eval", {
        prompts,
        story,
        input,
        model: evalModel,
        settings: evalSettings,
        type,
        gooseKey,
        naiKey,
      })
      .catch((err) => console.log(err));
    const output = response.data.output;
    return output;
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
      setLocationName(checkLocation(story[story.length - 1].text));
      generateImage(checkLocation(story[story.length - 1].text));
    }
  };

  const generate = async (input, type, last, retry, story) => {
    if (generating) {
      return;
    } else {
      setGenerating(true);
    }
    // the conditions to check for
    let check, item, ability, pick, link, movingTo, newLocation;
    // if retry remove last generation from story
    if (retry) {
      story.pop();
      // sort story by index
      story.sort((a, b) => a.index - b.index);
    }
    // if no input, check if last generation is an action
    if (
      (retry || input === "" || !input) &&
      story[story.length - 1].type === "action"
    ) {
      console.log("addd");
      input = story[story.length - 1].text;
      type = "action";
      // remove from the story
      story.pop();
      // sort story by index
      story.sort((a, b) => a.index - b.index);
    }
    if (input && type === "action" && input !== "") {
      // check for the check condition
      check = stats.find((stat) => {
        return checkForKeys(input, stat.keywords);
      });
      // check if item is being picked up
      pick = checkForKeys(input, pickUpKeys);
      // add check for links here to see if they're moving somewhere specific
      link = checkForLinks(input);
      // check if moving to an existing location
      movingTo = map.find((location) => {
        return checkForKeys(input, location.keywords);
      });
      // check if moving to a new location
      newLocation = checkForKeys(input, newLocationArray);
      // check if item is being used
      const sorted = inventory.sort((a, b) => b.priority - a.priority);
      item = sorted.find((item) => {
        return (
          checkForKeys(input, item.keywords) && item.uses > 0 && item.active
        );
      });
      // check if ability is used
      const sortedAbilities = abilities.sort((a, b) => b.priority - a.priority);
      ability = sortedAbilities.find((ability) => {
        return (
          checkForKeys(input, ability.keywords) &&
          ability.energyCost <= energy &&
          ability.active
        );
      });

      if (check) {
        const neW = "Process:";
        const evaluation =
          (await evalStory(
            DCPrompts[genre],
            story,
            newInput(input, neW),
            "DC"
          )) || 10;
        let DC = 10;
        // check if evaluation includes a number string
        if (evaluation.includes("DC:")) {
          // get first line which is the reasoning
          const reasoning = evaluation.match(/.*/g)[0];
          // get DC from "DC: " line
          DC = parseInt(evaluation.match(/(?<=DC: ).*/g)[0]);
          console.log("reasoning:", reasoning, "\nDC:", DC);
        }
        check = skillCheck(
          input,
          stats,
          difficulty,
          inventory,
          health,
          DC,
          item,
          ability
        );
        console.log("check:", check);
        if (check.item) {
          // if item is used, lower its uses by 1
          setInventory(
            inventory.map((item) => {
              if (item.id === check.item.id) {
                item.uses--;
              }
              return item;
            })
          );
          setMessage(`You used ${check.item.name}!`);
          setMessageOpen(true);
          item = check.item;
        } else if (ability) {
          // if ability is used, take the energy cost from the player
        }
      } else if (pick) {
        // pick up item
        let attributes = "Attributes:";
        // get level and add it to the attributes
        const level = itemLevelGenerator(score, playerLevel, difficulty);
        attributes += ` ${level}`;
        // get item word and add it to the attributes
        const extraWord =
          itemWords[level][Math.floor(Math.random() * itemWords[level].length)];
        attributes += `, ${extraWord}`;
        // get genre word and add it to the attributes
        const genreWord =
          genreWords[genre][
            Math.floor(Math.random() * genreWords[genre].length)
          ];
        attributes += `, ${genreWord}`;

        // send request to server to pick up item
        const pickUpResponse = await evalStory(
          pickUpPrompts[genre],
          story,
          newInput(input, `----\nItem Generator\n${attributes}\nName:`)
        );
        const output = pickUpResponse;
        if (output.includes("Description:") && output.includes("Verbs:")) {
          // get name from first line
          const name = output.match(/.*/g)[0];
          // get verbs from "Verbs: " line
          const keywords = output.match(/(?<=Verbs: ).*/g)[0];
          // get description from "Description: " line
          const description = output.match(/(?<=Description: ).*/g)[0];
          // get item uses
          const uses = getItemUses(level, difficulty, playerLevel);
          console.log(
            attributes,
            "\nUses:",
            uses,
            "\nname: ",
            name,
            "\nverbs: ",
            keywords,
            "\ndesc: ",
            description
          );
          // remove "Attributes: " from attributes
          attributes = attributes.replace("Attributes: ", "");
          // turn keywords into array
          const keywordsArray = keywords.split(", ");

          pick = {
            attributes,
            uses,
            name,
            keywords: keywordsArray,
            description,
            id: uuid(),
            priority: inventory.length,
            active: true,
          };
          // add item to inventory logic here
          setMessage(`You picked up ${name}!`);
          setMessageOpen(true);
          setInventory([...inventory, pick]);
        } else {
          console.log("error", output);
        }
      } else if (link) {
        // move to link
      } else if (movingTo) {
        // move to existing location
      } else if (newLocation) {
        // move to new location
        console.log("New location");
      }
    }
    let key;
    if (models === "NovelAI") {
      key = localStorage.getItem("nai_access_key");
    } else {
      key = localStorage.getItem("gooseai-key");
    }
    console.log(phrase_rep_pen);
    const response = await axios
      .post("/api/generate", {
        story,
        type,
        input,
        key,
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
          cfg_scale,
          phrase_rep_pen,
          top_g,
          mirostat_tau,
          mirostat_lr,
        },
        extra: {
          equipment,
          inventory,
          abilities,
          check,
          pick,
          item,
          ability,
          link,
          movingTo,
          location: locationName,
          newLocation,
          failMessage:
            failMessages[Math.floor(Math.random() * failMessages.length)],
          pick,
          attg: {
            author,
            title,
            tags: [],
            genre,
          },
          profile,
        },
        lore: loreBuilder(story, lore, input),
        model,
        models,
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.status);
        setHealthMessage(
          "Something went wrong generating, please try again. Check your credentials!"
        );
        setHealthMessageOpen(true);
        setGenerating(false);

        return;
      });
    if (response.data) {
      console.log("data:", response.data);
      const lastOutput = response.data.text;
      // check for lore and generate it
      evalStory(
        loreFinder[genre],
        story,
        lastOutput +
          "\n----\n{ Write the lore about something special and interesting if there is anything. Ignore normal or everyday stuff. }\nLore Finder\nProcess:",
        "Lore Finder"
      ).then((res) => {
        // logic for lore creation
        // if res doesn't include "Lore: " then there is no lore
        if (!res.includes("Lore:")) {
          console.log("no lore:", res);
          return;
        }
        // get first line which is the process
        const process = res.match(/.*/g)[0];
        // get lore from "Lore: " line
        let keys = res.match(/(?<=Lore: ).*/g)[0];
        // remove first whitespace if there is one
        if (keys[0] === " ") {
          keys = keys.slice(1);
        }
        // split keys into array
        keys = keys.split(", ");
        console.log("PROCESS:", process);
        console.log("KEYS:", keys);
        if (keys[0] !== "none") {
          keys.forEach((key) => {
            generateLores(key, lastOutput);
          });
        }
      });
      // check for damage
      if (checkForKeys(lastOutput, damageDetector[genre])) {
        // take damage
        const damage = await takeDamage(lastOutput);
        if (damage) {
          setHealth(health - damage);
          setHealthMessage(`You took ${damage} damage!`);
          setHealthMessageOpen(true);
        } else {
          // heal 1 hp per turn

          setHealth(health + 1);
        }
      } else {
        // heal 1 hp per turn
        setHealth(health + 1);
      }
      addOutput(input, type, last, response.data.text, story);
    }
    setGenerating(false);
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
    if (!currentLocation) {
      return false;
    }

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
  const generateLores = async (input, lastOutput) => {
    const exists = lore.find((lore) => {
      return checkForKeys(input, lore.keywords);
    });
    if (!exists) {
      const newLore = await evalStory(
        loreWriter[genre],
        story,
        lastOutput + `\n----\nLore Writer\nTopic: ${input}\nKeywords:`,
        "Lore Finder"
      );
      console.log(newLore);
      if (newLore.includes("Lore:")) {
        // get first line which are the keys
        let keys = newLore.match(/.*/g)[0];
        // remove first whitespace if there is one
        if (keys[0] === " ") {
          keys = keys.slice(1);
        }
        // split keys into array
        keys = keys.split(", ");
        // get the "Lore:" line
        let lore = newLore.split("Lore:")[1];
        // remove the *** or \n*** at the end, or ---- or \n---- at the end
        if (lore.includes("\n***")) {
          lore = lore.split("\n***")[0];
        } else if (lore.includes("***")) {
          lore = lore.split("***")[0];
        } else if (lore.includes("\n----")) {
          lore = lore.split("\n----")[0];
        } else if (lore.includes("----")) {
          lore = lore.split("----")[0];
        }
        setMessage(`You learned about ${input}!`);
        setMessageOpen(true);

        // add lore to lore state
        setLore((prev) => {
          return [
            ...prev,
            {
              title: input,
              id: uuid(),
              image: "",
              keywords: keys,
              content:
                "----" +
                `<div>[ Knowledge: ${input} ]</div>` +
                "<div>" +
                lore +
                "</div>",
              settings: {
                range: 10,
                priority: 1,
                active: true,
              },
            },
          ];
        });
      }
    }
  };
  const takeDamage = async (lastOutput) => {
    console.log("Searching for damage");
    const response = await evalStory(
      damageFinder[genre],
      story,
      lastOutput +
        "\n----\n{ Find the damage that the player, you, takes, ignore everyone else's damge. }\nYour Health Detector\nProcess:",
      "Lore Finder"
    );
    console.log(response);
    if (!response.includes("Damage Taken:")) {
      return false;
    }
    // get the "Damage:" line
    let damage = response.split("Damage Taken: ")[1];
    // remove the *** or \n*** at the end
    if (damage.includes("\n***")) {
      damage = damage.split("\n***")[0];
    }
    // remove the *** or \n*** at the end
    if (damage.includes("***")) {
      damage = damage.split("***")[0];
    }
    damage = calculateDamage(damage, difficulty);
    return damage;
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
            <h1 style={{ color: "white" }}>AIdventure Time</h1>
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
          <Snackbar
            open={messageOpen}
            autoHideDuration={6000}
            onClose={() => setMessageOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Alert
              onClose={() => setMessageOpen(false)}
              severity="info"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
          <Snackbar
            open={healthMessageOpen}
            autoHideDuration={6000}
            onClose={() => setHealthMessageOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Alert
              onClose={() => setHealthMessageOpen(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {healthMessage}
            </Alert>
          </Snackbar>
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
          setLocation={setLocationName}
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
          setOpenInventory={setOpenInventory}
          models={models}
          setModels={setModels}
          openAbilities={openAbilities}
          setOpenAbilities={setOpenAbilities}
          cfg_scale={cfg_scale}
          setCfg_scale={setCfg_scale}
          phrase_rep_pen={phrase_rep_pen}
          setPhrase_rep_pen={setPhrase_rep_pen}
          top_g={top_g}
          setTop_g={setTop_g}
          mirostat_tau={mirostat_tau}
          setMirostat_tau={setMirostat_tau}
          mirostat_lr={mirostat_lr}
          setMirostat_lr={setMirostat_lr}
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
        <Stats
          open={openStats}
          setOpen={setOpenStats}
          stats={stats}
          setStats={setStats}
          XP={XP}
          setXP={setXP}
          difficulty={difficulty}
          genre={genre}
          setGenre={setGenre}
          genres={genres}
          setGenres={setGenres}
          author={author}
          setAuthor={setAuthor}
          title={title}
          setTitle={setTitle}
          profile={profile}
          setProfile={setProfile}
          health={health}
          setHealth={setHealth}
          energy={energy}
          setEnergy={setEnergy}
          energyWord={energyWord}
          setEnergyWord={setEnergyWord}
          playerLevel={playerLevel}
          setPlayerLevel={setPlayerLevel}
          abilities={abilities}
          setAbilities={setAbilities}
          skillTree={skillTree}
          setSkillTree={setSkillTree}
        />
        <Inventory
          open={openInventory}
          setOpen={setOpenInventory}
          inventory={inventory}
          setInventory={setInventory}
          type="inventory"
        />
        <Inventory
          open={openAbilities}
          setOpen={setOpenAbilities}
          inventory={abilities}
          setInventory={setAbilities}
          type="abilities"
        />
        <Map map={map} setMap={setMap} open={openMap} setOpen={setOpenMap} />

        <div
          className={styles.imageContainer}
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
      </div>
    );
  }
}
