import React, { useState } from "react";
import {
  SwipeableDrawer,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useTheme } from "@mui/material/styles";
import { AiFillSave } from "react-icons/ai";
import useMediaQuery from "@mui/material/useMediaQuery";

import styles from "../Styles/RightSidePanel.module.css";
import NovelaiModal from "./NovelaiModal";
import getNaiAccessToken from "@/util/front/getNaiAccessToken";
import Slid from "./Settings/Slid";
import Order from "./Settings/Order";
import Groupe from "./Settings/Groupe";
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const onBlur = (e) => {
    setMemory(e.target.innerText);
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
      setModel(newModel);
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
      onOpen={() => setOpenSetting(true)}
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
              right: 15,
              top: 15,
              background: "none",
              border: "none",
            }}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className={styles.scrollContainer}>
          <div className={styles.container}>
            <div className={styles.title}>NovelAI</div>
            <div className={styles.description}>
              Get you NAI access key! It's stored locally, don't worry!
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
            <div className={styles.title}>Saves</div>
            <div className={styles.description}>Save your story here!</div>
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
          <div className={styles.container}>
            <div className={styles.title}>Settings</div>
            <div className={styles.description}>Change the settings!</div>
            <ToggleButtonGroup
              className={styles.toggleButtonGroup}
              exclusive
              onChange={handleModelChange}
              aria-aria-label="Model"
            >
              <ToggleButton
                className={
                  model === "euterpe-v2" ? styles.euterpeActive : styles.euterpe
                }
                value="euterpe-v2"
                aria-label="euterpe"
                onClick={() => setModel("euterpe-v2")}
              >
                Euterpe
              </ToggleButton>
              <ToggleButton
                className={
                  model === "cassandra"
                    ? styles.cassandraActive
                    : styles.cassandra
                }
                value="cassandra"
                aria-label="cassandra"
                onClick={() => setModel("cassandra")}
              >
                Cassandra
              </ToggleButton>
            </ToggleButtonGroup>

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
              description={"Stop the generated responses at a specific word!"}
              groupe={stopSequences}
              setGroupe={setStopSequences}
              model={model}
              bias={false}
            />
            <Slid
              title={"Tokens"}
              description={"Increase the length of the generated responses!"}
              value={tokens}
              setValue={setTokens}
              min={1}
              max={40}
              step={1}
              model={model}
            />

            <Slid
              title={"Temperature"}
              description={"The higher the value, the more random the output!"}
              value={temperature}
              setValue={setTemperature}
              min={0.1}
              max={2.5}
              step={0.01}
              model={model}
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
              max={2048}
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
        </div>
      </div>
      <NovelaiModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={getNovelaiAccessKey}
      />
    </Drawer>
  );
}
