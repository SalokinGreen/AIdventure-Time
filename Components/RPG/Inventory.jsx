import React, { useState, useEffect } from "react";
import {
  Modal,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";
import { uuid } from "uuidv4";

import styles from "../../Styles/Inventory.module.css";
function Inventory({ open, setOpen, inventory, setInventory, type }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sideMenu, setSideMenu] = useState(true);
  const [keyword, setKeyword] = useState("");
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  useEffect(() => {
    if (selectedItem) {
      setInventory((prev) => {
        return prev.map((item) => {
          if (item.id === selectedItem.id) {
            return selectedItem;
          } else {
            return item;
          }
        });
      });
    }
  }, [selectedItem]);
  const handleDelete = (index) => {
    setSelectedItem({
      ...selectedItem,
      keywords: selectedItem.keywords.filter((_, i) => i !== index),
    });
  };
  const handleAddItem = () => {
    setInventory((prev) => {
      return [
        ...prev,
        {
          id: uuid(),
          name: "New",
          description: "Description",
          attributes: "",
          uses: 0,
          priority: 0,
          keywords: [],
          active: true,
          energyCost: 0,
          bonus: 0,
        },
      ];
    });
  };
  useEffect(() => {
    if (!open) {
      setSelectedItem(null);
    }
  }, [open]);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="Inventory"
      aria-describedby="Player's inventory"
      className={styles.modal}
    >
      <div className={styles.modalContent}>
        <div className={styles.inventoryList}>
          {sideMenu ? (
            <List className={styles.list}>
              <ListItem
                button
                onClick={() => setSideMenu(false)}
                className={styles.listItem}
              >
                <ListItemText primary="Close" />
              </ListItem>
              {inventory.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={styles.listItem}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
              <ListItem
                button
                onClick={() => handleAddItem()}
                className={styles.listItem}
              >
                <ListItemText primary="Add" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem
                button
                onClick={() => setSideMenu(true)}
                className={styles.listItem}
              >
                <ListItemText primary="Open" />
              </ListItem>
            </List>
          )}
        </div>
        {selectedItem && (
          <div className={styles.item}>
            <Typography variant="h5" gutterBottom color={"white"}>
              Name
            </Typography>
            <input
              type="text"
              placeholder="Item Name"
              className={styles.input}
              value={selectedItem.name}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, name: e.target.value })
              }
              required
            />
            <Typography variant="h5" gutterBottom color={"white"}>
              Description
            </Typography>
            <textarea
              type="text"
              placeholder="Description"
              className={styles.input}
              value={selectedItem.description}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  description: e.target.value,
                })
              }
              required
            />
            {type === "inventory" && (
              <Typography variant="h5" gutterBottom color={"white"}>
                Attributes
              </Typography>
            )}
            {type === "inventory" && (
              <input
                type="text"
                placeholder="Attributes"
                className={styles.input}
                value={selectedItem.attributes}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    attributes: e.target.value,
                  })
                }
              />
            )}
            {type === "inventory" && (
              <Typography variant="h5" gutterBottom color={"white"}>
                Uses
              </Typography>
            )}
            {type === "inventory" && (
              <input
                type="number"
                placeholder="Uses"
                className={styles.input}
                value={selectedItem.uses}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    uses: e.target.value,
                  })
                }
              />
            )}
            {type === "abilities" && (
              <Typography variant="h5" gutterBottom color={"white"}>
                Energy Cost
              </Typography>
            )}
            {type === "abilities" && (
              <input
                type="number"
                placeholder="Energy Cost"
                className={styles.input}
                value={selectedItem.energyCost}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    energyCost: e.target.value,
                  })
                }
              />
            )}
            {type === "abilities" && (
              <Typography variant="h5" gutterBottom color={"white"}>
                Bonus
              </Typography>
            )}
            {type === "abilities" && (
              <input
                type="number"
                placeholder="Bonus"
                className={styles.input}
                value={selectedItem.bonus}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    bonus: e.target.value,
                  })
                }
              />
            )}
            <Typography variant="h5" gutterBottom color={"white"}>
              Priority
            </Typography>
            <input
              type="number"
              placeholder="Priority"
              className={styles.input}
              value={selectedItem.priority}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  priority: e.target.value,
                })
              }
            />
            <Typography variant="h5" gutterBottom color={"white"}>
              Keywords
            </Typography>
            <div className={styles.keywords}>
              {selectedItem.keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  className={styles.chip}
                  color="info"
                  onClick={() => {
                    setSelectedItem({
                      ...selectedItem,
                      keywords: selectedItem.keywords.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Keyword"
              className={styles.input}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelectedItem({
                    ...selectedItem,
                    keywords: [...selectedItem.keywords, keyword],
                  });
                  setKeyword("");
                }
              }}
            />
            <Typography variant="h5" gutterBottom color={"white"}>
              Active
            </Typography>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedItem.active}
              value={selectedItem.active}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  active: e.target.checked,
                })
              }
            />
            <Typography variant="h5" gutterBottom color={"white"}>
              Delete
            </Typography>
            <button
              className={styles.delete}
              onClick={() => {
                setInventory((prev) => {
                  return prev.filter((item) => item.id !== selectedItem.id);
                });
                setSelectedItem(null);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default Inventory;
