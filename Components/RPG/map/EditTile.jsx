import React, { useState, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import styles from "../../../Styles/Map.module.css";
import { uuid } from "uuidv4";

const EditTile = ({
  tile,
  setEdit,
  updateTile,
  removeTile,
  addSubMap,
  selectedSubMap,
  setSelectedSubMap,
}) => {
  const [editTile, setEditTile] = useState(tile);

  useEffect(() => {
    setEditTile(tile);
  }, [tile]);

  const handleChange = (event) => {
    setNewTile({
      ...newTile,
      [event.target.name]: event.target.value,
    });
  };
  const handleRemove = () => {
    removeTile(tile);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditTile({ ...editTile, [name]: value });
  };
  const handleAddSubMap = () => {
    const subMap = {
      id: uuid(),
      name: "New Submap",
      keywords: [],
      map: [
        [
          {
            id: uuid(),
            name: "New Tile",
            keywords: [],
            x: 0,
            y: 0,
            subMap: [
              [
                {
                  id: uuid(),
                  name: "New Tile",
                  type: "tile",
                  x: 0,
                  y: 0,
                  subMap: [],
                },
              ],
            ],
          },
        ],
      ],
    };
    addSubMap(tile.x, tile.y, subMap);
    console.log(tile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTile(editTile);
    setEdit(false);
  };
  const handleSelectSubMap = (subMap) => {
    setSelectedSubMap(subMap);
    updateTile(editTile);
    setEdit(false);
  };
  return (
    <div className={styles.editTileContainer}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editTile.name}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={editTile.description}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="keywords">Keywords:</label>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={editTile.image}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="color">Color:</label>
        <input
          type="text"
          id="color"
          name="color"
          value={editTile.color}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.subMapList}>
        <h3>SubMaps:</h3>
        {editTile.subMap.map((subMap) => (
          <div key={subMap.id} onClick={() => handleSelectSubMap(subMap)}>
            {subMap.name}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddSubMap}
        className={styles.saveButton}
      >
        Add Submap
      </button>
      <button onClick={handleSubmit} className={styles.saveButton}>
        <BiCheck /> Save
      </button>
    </div>
  );
};

export default EditTile;
