import React, { useState, useEffect } from "react";
import { Modal, Button, List, ListItem, Chip } from "@mui/material";
import styles from "@/Styles/Map.module.css";
import { uuid } from "uuidv4";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  BiArrowToLeft,
  BiArrowFromLeft,
  BiArrowFromTop,
  BiArrowToTop,
} from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import ContentEditable from "react-contenteditable";

const Map = ({ open, setOpen, map, setMap }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [selectedLink, setSelectedLink] = useState(0);
  const [newKeyword, setNewKeyword] = useState("");
  const [newMainKeyword, setNewMainKeyword] = useState("");
  const [isLocationListOpen, setIsLocationListOpen] = useState(true);
  const orderedMap = map.sort((a, b) => a.order - b.order);
  useEffect(() => {
    if (selectedLocation) {
      const newMap = [...map];
      const index = newMap.findIndex(
        (location) => location.id === selectedLocation.id
      );
      newMap[index] = selectedLocation;
      setMap(newMap);
    }
  }, [selectedLocation]);
  const handleAddLocation = () => {
    const newLocation = {
      id: uuid(),
      name: "New Location",
      keywords: [],
      description: "",
      prompts: [],
      image: "",
      imagePrompt: "",
      links: [],
      address: Math.random().toString(36).substring(7),
      order: map.length,
    };
    setMap([...map, newLocation]);
    setSelectedLocation(newLocation);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    console.log(location);
  };

  const handleChange = (e) => {
    setSelectedLocation({
      ...selectedLocation,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditLocation = (e, field) => {
    setSelectedLocation({
      ...selectedLocation,
      [field]: e.target.value,
    });
  };
  const handleImageDelete = () => {
    setSelectedLocation({
      ...selectedLocation,
      image: "",
    });
  };
  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setSelectedLocation({
        ...selectedLocation,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleAddPrompt = () => {
    setSelectedLocation({
      ...selectedLocation,
      prompts: [...selectedLocation.prompts, ""],
    });
  };

  const handleRemovePrompt = () => {
    setSelectedLocation({
      ...selectedLocation,
      prompts: selectedLocation.prompts.filter((_, i) => i !== selectedPrompt),
    });
  };
  const handleAddLink = () => {
    setSelectedLocation({
      ...selectedLocation,
      links: [...selectedLocation.links, { address: "", keywords: [] }],
    });
  };

  const handleRemoveLink = () => {
    setSelectedLocation({
      ...selectedLocation,
      links: selectedLocation.links.filter((_, i) => i !== selectedLink),
    });
  };

  const handleAddKeyword = () => {
    const updatedLinks = [...selectedLocation.links];
    updatedLinks[selectedLink].keywords.push(newKeyword);
    setSelectedLocation({
      ...selectedLocation,
      links: updatedLinks,
    });
    setNewKeyword("");
  };
  const handleAddMainKeyword = () => {
    const keywords = [...selectedLocation.keywords];
    keywords.push(newKeyword);
    setSelectedLocation({
      ...selectedLocation,
      keywords: keywords,
    });
    setNewKeyword("");
  };
  const handleDeleteKeyword = (linkIndex, keywordIndex) => {
    const updatedLinks = [...selectedLocation.links];
    updatedLinks[linkIndex].keywords.splice(keywordIndex, 1);
    setSelectedLocation({
      ...selectedLocation,
      links: updatedLinks,
    });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.modalContent}>
        <IoClose
          className={styles.closeIcon}
          onClick={() => setOpen(false)}
          size="3rem"
        />
        <div className={styles.flexContainer}>
          {isLocationListOpen && (
            <div className={styles.locationList}>
              <List>
                {orderedMap.map((location) => (
                  <ListItem
                    button
                    onClick={() => handleSelectLocation(location)}
                    key={location.id}
                    className={styles.listItem}
                  >
                    {location.name}
                  </ListItem>
                ))}
              </List>
              <Button
                onClick={handleAddLocation}
                className={styles.addLocationButton}
              >
                Add Location
              </Button>
            </div>
          )}
          <button
            onClick={() => setIsLocationListOpen(!isLocationListOpen)}
            className={styles.toggleMenuButton}
          >
            {window.innerWidth <= 768 ? (
              isLocationListOpen ? (
                <BiArrowToTop size="3rem" className={styles.icon} />
              ) : (
                <BiArrowFromTop size="3rem" className={styles.icon} />
              )
            ) : isLocationListOpen ? (
              <BiArrowToLeft size="3rem" className={styles.icon} />
            ) : (
              <BiArrowFromLeft size="3rem" className={styles.icon} />
            )}
          </button>
        </div>

        <div item xs={6} className={styles.locationDetails}>
          {selectedLocation && (
            <div className={styles.detailsBox}>
              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Name </div>
                  <div className={styles.description}> Description</div>
                  <input
                    label="Name"
                    value={selectedLocation.name}
                    onChange={(e) => handleEditLocation(e, "name")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.container}>
                  <div className={styles.title}> Address</div>
                  <div className={styles.description}> Description</div>
                  <input
                    label="Description"
                    value={selectedLocation.address}
                    onChange={(e) => handleEditLocation(e, "address")}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Description </div>
                  <div className={styles.description}> Description</div>
                  <input
                    label="Description"
                    value={selectedLocation.description}
                    onChange={(e) => handleEditLocation(e, "description")}
                    className={styles.input}
                  />
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Order</div>
                  <div className={styles.description}> Description</div>
                  <input
                    label="Order"
                    value={selectedLocation.order}
                    onChange={(e) => handleEditLocation(e, "order")}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Keywords</div>
                  <div className={styles.description}>
                    Add or remove keywords
                  </div>
                  <div className={styles.keywords}>
                    {selectedLocation.keywords.map((keyword, i) => (
                      <Chip
                        key={i}
                        label={keyword}
                        onClick={() => {}}
                        color="info"
                        className={styles.keywordChip}
                      />
                    ))}
                  </div>
                  <input
                    value={newMainKeyword}
                    onChange={(e) => setNewMainKeyword(e.target.value)}
                    className={styles.inputLink}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMainKeyword();
                      }
                    }}
                  />
                </div>
                <div className={styles.container}>
                  <div className={styles.title}>Image Prompt</div>
                  <div className={styles.description}>Your prompt</div>
                  <input
                    value={selectedLocation.imagePrompt}
                    onChange={(e) => handleEditLocation(e, "imagePrompt")}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Prompts</div>
                  <div className={styles.description}>
                    Add or remove prompts
                  </div>
                  <div className={styles.promptControls}>
                    <div className={styles.promptDropdown}>
                      <select
                        value={selectedPrompt}
                        onChange={(e) => setSelectedPrompt(e.target.value)}
                        className={styles.input}
                      >
                        {selectedLocation.prompts.map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <FaPlus
                        onClick={handleAddPrompt}
                        className={styles.icon}
                      />
                      <FaMinus
                        onClick={handleRemovePrompt}
                        className={styles.icon}
                      />
                    </div>
                    {selectedLocation.prompts.map((prompt, i) => (
                      <ContentEditable
                        html={prompt || ""}
                        onChange={(e) =>
                          setSelectedLocation({
                            ...selectedLocation,
                            prompts: selectedLocation.prompts.map((p, j) =>
                              i === j ? e.target.value : p
                            ),
                          })
                        }
                        key={i}
                        className={styles.inputPrompt}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Links</div>
                  <div className={styles.description}>Add or remove links</div>
                  <div className={styles.linkControls}>
                    <div className={styles.linkDropdown}>
                      <select
                        value={selectedLink}
                        onChange={(e) => setSelectedLink(e.target.value)}
                        className={styles.input}
                      >
                        {selectedLocation.links.map((_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <FaPlus onClick={handleAddLink} className={styles.icon} />
                      <FaMinus
                        onClick={handleRemoveLink}
                        className={styles.icon}
                      />
                    </div>
                    {selectedLocation.links.length > 0 && (
                      <div className={styles.adress}>
                        <div className={styles.subtitle}>Address</div>

                        <input
                          value={selectedLocation.links[selectedLink].address}
                          onChange={(e) =>
                            setSelectedLocation({
                              ...selectedLocation,
                              links: selectedLocation.links.map((l, i) =>
                                i === selectedLink
                                  ? { ...l, address: e.target.value }
                                  : l
                              ),
                            })
                          }
                          className={styles.inputLink}
                        />
                        <div className={styles.subtitle}>Keywords</div>

                        {selectedLocation.links[selectedLink].keywords.map(
                          (keyword, i) => (
                            <Chip
                              key={i}
                              label={keyword}
                              color="info"
                              onClick={() =>
                                handleDeleteKeyword(selectedLink, i)
                              }
                            />
                          )
                        )}
                        <input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddKeyword();
                            }
                          }}
                          className={styles.inputKeywords}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.parts}>
                <div className={styles.container}>
                  <div className={styles.title}>Image</div>
                  <div className={styles.description}>
                    Upload or delete an image
                  </div>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className={styles.input}
                  />
                  <Button onClick={handleImageDelete}>Delete Image</Button>
                  {selectedLocation.image && (
                    <img
                      src={selectedLocation.image}
                      alt="Selected"
                      className={styles.imagePreview}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Map;
