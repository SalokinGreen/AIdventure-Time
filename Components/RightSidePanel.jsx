import React, { useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { IoClose, IoBody } from "react-icons/io5";
import { useTheme } from "@mui/material/styles";
import { AiFillSave } from "react-icons/ai";
import { BsMapFill } from "react-icons/bs";
import { GiBackpack, GiMagicPalm } from "react-icons/gi";
import useMediaQuery from "@mui/material/useMediaQuery";
import Counter from "./Front/Counter";
import styles from "../Styles/RightSidePanel.module.css";
import NovelaiModal from "./NovelaiModal";
import getNaiAccessToken from "@/util/front/getNaiAccessToken";
import Slid from "./Settings/Slid";
import Order from "./Settings/Order";
import Groupe from "./Settings/Groupe";
import HealthBar from "./Front/HealthBar";
import Knob from "./Settings/Knob";
import GooseaiModal from "./GooseaiModal";
const gooseModels = ["cassandra-lit-2-8b", "cassandra-lit-6-9b"];
const novelaiModels = ["euterpe-v2", "krake-v2"];
export default function RightSidePanel({
  openSetting,
  setOpenSetting,
  memory,
  setMemory,
  model,
  setModel,
  temperature,
  setTemperature,
  tokens,
  setTokens,
  topP,
  setTopP,
  topK,
  setTopK,
  tfs,
  setTfs,
  topA,
  setTopA,
  typicalP,
  setTypicalP,
  repetitionP,
  setRepetitionP,
  presenceP,
  setPresenceP,
  frequencyP,
  setFrequencyP,
  repetitionPS,
  setRepetitionPS,
  repetitionPR,
  setRepetitionPR,
  orderItems,
  setOrderItems,
  biases,
  setBiases,
  bans,
  setBans,
  stopSequences,
  setStopSequences,
  savesOpen,
  setSavesOpen,
  verbosity,
  setVerbosity,
  score,
  highScore,
  location,
  setLocation,
  health,
  setOpenStats,
  difficulty,
  setDifficulty,
  formate,
  setFormate,
  setOpenMap,
  setOpenInventory,
  models,
  setModels,
  openAbilities,
  setOpenAbilities,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [gooseOpen, setGooseOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [samplers, setSamplers] = useState(false);
  const [groups, setGroups] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const onBlur = (e) => {
    setMemory(e.target.innerText);
  };
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const getNovelaiAccessKey = async (email, password) => {
    const result = await getNaiAccessToken(email, password);
    if (result) {
      // put key(result) in local storage
      localStorage.setItem("nai_access_key", result);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };
  const handleModelChange = (event, newModel) => {
    if (newModel !== null) {
      setModels(newModel);
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor="right"
      open={openSetting}
      variant="persistent"
      onClose={() => {
        if (window.innerWidth <= 768) {
          setOpenSetting(false);
        }
      }}
      // onOpen={() => setOpenSetting(true)}
      className={styles.drawer}
      ModalProps={{
        BackdropProps: {
          classes: {
            root: styles.backdrop,
          },
        },
      }}
    >
      <div className={`${styles.daddyContainer} ${styles.flexContainer}`}>
        <div className={styles.topContainer}>
          <button
            onClick={() => setOpenSetting(false)}
            style={{
              position: "absolute",
              right: 30,
              top: 50,
              background: "none",
              border: "none",
              color: "white",
            }}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className={styles.scrollContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Main" className={styles.tab} />
            <Tab label="Settings" className={styles.tab} />
            <Tab label="Advanced" className={styles.tab} />
          </Tabs>
          {/* Main */}
          {tabValue === 0 && (
            <>
              <div className={styles.container}>
                <div className={styles.container}>
                  <Counter score={score} title="Score" />
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Health</div>
                  <div className={styles.description}>
                    Your health is important, take care of yourself!
                  </div>
                  <HealthBar health={health} />
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Location</div>
                  <div className={styles.description}>
                    Where are you? Physically, not phylosophically.
                  </div>
                  <input
                    className={styles.locationInput}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  ></input>
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Stats</div>
                  <div className={styles.description}>
                    What can you do, what can't you do?
                  </div>
                  <Button
                    className={styles.buttonSave}
                    variant="contained"
                    color={model === "euterpe-v2" ? "warning" : "info"}
                    onClick={() => setOpenStats(true)}
                  >
                    <IoBody size={"3rem"} />
                  </Button>
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Inventory</div>
                  <div className={styles.description}>
                    What's in your bag? What's in your bag?!
                  </div>
                  <Button
                    className={styles.buttonSave}
                    variant="contained"
                    color={model === "euterpe-v2" ? "warning" : "info"}
                    onClick={() => setOpenInventory(true)}
                  >
                    <GiBackpack size={"3rem"} />
                  </Button>
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Abilities</div>
                  <div className={styles.description}>
                    You're a wizard, James! Or are you?
                  </div>
                  <Button
                    className={styles.buttonSave}
                    variant="contained"
                    color={model === "euterpe-v2" ? "warning" : "info"}
                    onClick={() => setOpenAbilities(true)}
                  >
                    <GiMagicPalm size={"3rem"} />
                  </Button>
                </div>

                <div className={styles.container}>
                  <div className={styles.title}>Map</div>
                  <div className={styles.description}>
                    Check out the map of the world!
                  </div>
                  <Button
                    className={styles.buttonSave}
                    variant="contained"
                    color="info"
                    onClick={() => setOpenMap(true)}
                  >
                    <BsMapFill size={"3rem"} />
                  </Button>
                </div>

                <div className={styles.container}>
                  <div className={styles.title}>Saves</div>
                  <div className={styles.description}>
                    Save your adventure or cry in regret! Just kidding, autosave
                    saves your butt.
                  </div>
                  <Button
                    className={styles.buttonSave}
                    variant="contained"
                    color={model === "euterpe-v2" ? "warning" : "info"}
                    onClick={() => setSavesOpen(true)}
                  >
                    <AiFillSave size={"3rem"} />
                  </Button>
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Memory</div>
                  <div className={styles.description}>
                    Jeep everything that is important to you here!
                  </div>
                  <div
                    className={styles.memoryField}
                    contentEditable="true"
                    dangerouslySetInnerHTML={{ __html: memory }}
                    onBlur={(e) => onBlur(e)}
                    onPaste={handlePaste}
                  ></div>
                </div>
              </div>
            </>
          )}
          {/* Settings */}
          {tabValue === 1 && (
            <>
              <div className={styles.container}>
                <div className={styles.title}>Settings</div>
                <div className={styles.description}>
                  Adjust the game experience to your needs!
                </div>

                <Slid
                  title="Verbosity"
                  description="Make your Game Master talk more or less!"
                  value={verbosity}
                  setValue={setVerbosity}
                  min={0}
                  max={3}
                  step={1}
                  model={model}
                />
                <Slid
                  title="Difficulty"
                  description="What will it be? Easy, Normal, Hard or Dark Souls?"
                  value={difficulty}
                  setValue={setDifficulty}
                  min={1}
                  max={4}
                  step={1}
                  model={model}
                />
                <Knob
                  title="Input Formating"
                  description="Do you want your input do be formatted?"
                  value={formate}
                  setValue={setFormate}
                />
                <div className={styles.container}>
                  <div className={styles.title}>NovelAI</div>
                  <div className={styles.description}>
                    Get your NAI access key! It's stored locally, don't worry!
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      className={
                        model === "euterpe-v2"
                          ? styles.buttonEuterpe
                          : styles.buttonCassandra
                      }
                      onClick={() => setIsOpen(true)}
                    >
                      Get Access Key
                    </button>
                  </div>
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>GooseAI</div>
                  <div className={styles.description}>
                    Save your goose key, save the world!
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      className={
                        model === "euterpe-v2"
                          ? styles.buttonEuterpe
                          : styles.buttonCassandra
                      }
                      onClick={() => setGooseOpen(true)}
                    >
                      Save your goose key
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Advanced */}
          {tabValue === 2 && (
            <>
              <div className={styles.container}>
                <div className={styles.title}>Advanced</div>
                <div className={styles.description}>
                  For the mad lads that want to go beyond the magic!
                </div>

                <ToggleButtonGroup
                  className={styles.toggleButtonGroup}
                  exclusive
                  onChange={handleModelChange}
                  // aria-aria-label="Model"
                >
                  <ToggleButton
                    className={
                      models === "NovelAI"
                        ? styles.euterpeActive
                        : styles.euterpe
                    }
                    value="NovelAI"
                    aria-label="NovelAI"
                    onClick={() => {
                      setModels("NovelAI");
                      setModel("euterpe-v2");
                    }}
                  >
                    NovelAI
                  </ToggleButton>
                  <ToggleButton
                    className={
                      models === "GooseAI"
                        ? styles.cassandraActive
                        : styles.cassandra
                    }
                    value="GooseAI"
                    aria-label="GooseAI"
                    onClick={() => {
                      setModels("GooseAI");
                      setModel("cassandra-lit-6-9b");
                    }}
                  >
                    GooseAI
                  </ToggleButton>
                </ToggleButtonGroup>
                <Select
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                  }}
                  className={styles.select}
                >
                  {models === "NovelAI"
                    ? novelaiModels.map((currentmodel) => (
                        <MenuItem
                          value={currentmodel}
                          active={currentmodel === model}
                          className={styles.selectItem}
                        >
                          {currentmodel}
                        </MenuItem>
                      ))
                    : gooseModels.map((currentmodel) => (
                        <MenuItem
                          value={currentmodel}
                          active={currentmodel === model}
                          className={styles.selectItem}
                        >
                          {currentmodel}
                        </MenuItem>
                      ))}
                </Select>
                <Slid
                  title={"Tokens"}
                  description={
                    "Increase the length of the generated responses!"
                  }
                  value={tokens}
                  setValue={setTokens}
                  min={1}
                  max={100}
                  step={1}
                  model={model}
                />

                <Slid
                  title={"Temperature"}
                  description={
                    "The higher the value, the more random the output!"
                  }
                  value={temperature}
                  setValue={setTemperature}
                  min={0.1}
                  max={3}
                  step={0.01}
                  model={model}
                />
                <div
                  className={styles.header}
                  onClick={() => setGroups(!groups)}
                >
                  Groups
                </div>
                <Groupe
                  title={"Bans"}
                  description={"Ban words from the generated responses!"}
                  groupe={bans}
                  setGroupe={setBans}
                  model={model}
                  bias={false}
                />
                <Groupe
                  title={"Biases"}
                  description={"Tell the AI what you like and don't!"}
                  groupe={biases}
                  setGroupe={setBiases}
                  model={model}
                  bias={true}
                />
                <Groupe
                  title={"Stop Sequences"}
                  description={
                    "Stop the generated responses at a specific word!"
                  }
                  groupe={stopSequences}
                  setGroupe={setStopSequences}
                  model={model}
                  bias={false}
                />
                <Slid
                  title={"Repetition Penality"}
                  description={"Higher values make the output less repetitive."}
                  value={repetitionP}
                  setValue={setRepetitionP}
                  min={1}
                  max={8}
                  step={0.01}
                  model={model}
                />
                <Slid
                  title={"Top P"}
                  description={""}
                  value={topP}
                  setValue={setTopP}
                  min={0.05}
                  max={1}
                  step={0.01}
                  model={model}
                />

                <Slid
                  title={"Top K"}
                  description={""}
                  value={topK}
                  setValue={setTopK}
                  min={1}
                  max={300}
                  step={1}
                  model={model}
                />

                <Slid
                  title={"Tail-Free Sampeling"}
                  description={""}
                  value={tfs}
                  setValue={setTfs}
                  min={0.05}
                  max={1}
                  step={0.01}
                  model={model}
                />

                <Slid
                  title={"Top A"}
                  description={""}
                  value={topA}
                  setValue={setTopA}
                  min={0.05}
                  max={1}
                  step={0.01}
                  model={model}
                />

                <Slid
                  title={"Typical P"}
                  description={""}
                  value={typicalP}
                  setValue={setTypicalP}
                  min={0.5}
                  max={1}
                  step={0.01}
                  model={model}
                />
                <Order
                  model={model}
                  setOrder={setOrderItems}
                  order={orderItems}
                  title={"Order"}
                  description={"Only works for Euterpe!"}
                />
                <Slid
                  title={"Repetition Penality Range"}
                  description={""}
                  value={repetitionPR}
                  setValue={setRepetitionPR}
                  min={0}
                  max={4096}
                  step={1}
                  model={model}
                />
                <Slid
                  title={"Slope"}
                  description={""}
                  value={repetitionPS}
                  setValue={setRepetitionPS}
                  min={0}
                  max={9.9}
                  step={0.1}
                  model={model}
                />
                <Slid
                  title={"Presence"}
                  description={""}
                  value={presenceP}
                  setValue={setPresenceP}
                  min={0}
                  max={2}
                  step={0.05}
                  model={model}
                />
                <Slid
                  title={"Frequency"}
                  description={""}
                  value={frequencyP}
                  setValue={setFrequencyP}
                  min={0}
                  max={1}
                  step={0.05}
                  model={model}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <NovelaiModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={getNovelaiAccessKey}
      />
      <GooseaiModal open={gooseOpen} setOpen={setGooseOpen} />
    </Drawer>
  );
}
