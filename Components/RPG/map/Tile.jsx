import React, { useState } from "react";
import Map from "./Map";
import styles from "../../../Styles/Map.module.css";
import { BiPlus } from "react-icons/bi";
import { uuid } from "uuidv4";

const Tile = ({
  tile,
  setSelectedTile,
  setEdit,
  updateTile,
  addTile,
  addSubMap,
  map,
  index,
  addTileHorizontally,
  addTileVertically,
  createNewTile,
}) => {
  const handleClick = () => {
    setSelectedTile(tile);
    setEdit(true);
  };
  const handleAddTile = (direction) => {
    const newTile = createNewTile(tile.x, tile.y);
    if (direction === "left" || direction === "right") {
      addTileHorizontally(direction);
    } else if (direction === "top" || direction === "bottom") {
      addTileVertically(direction);
    }
  };

  const hasTileAt = (x, y) => {
    return map[x] && map[x][y];
  };
  return (
    <div className={styles.tileWrapper}>
      <button className={styles.tile} onClick={handleClick}>
        {tile.name}
      </button>
      {!hasTileAt(tile.x, tile.y - 1) && (
        <BiPlus
          className={`${styles.addTileButton} ${styles.left}`}
          onClick={() => handleAddTile("left")}
        />
      )}
      {!hasTileAt(tile.x, tile.y + 1) && (
        <BiPlus
          className={`${styles.addTileButton} ${styles.right}`}
          onClick={() => handleAddTile("right")}
        />
      )}
      {!hasTileAt(tile.x - 1, tile.y) && (
        <BiPlus
          className={`${styles.addTileButton} ${styles.top}`}
          onClick={() => handleAddTile("top")}
        />
      )}
      {!hasTileAt(tile.x + 1, tile.y) && (
        <BiPlus
          className={`${styles.addTileButton} ${styles.bottom}`}
          onClick={() => handleAddTile("bottom")}
        />
      )}
    </div>
  );
};

export default Tile;
