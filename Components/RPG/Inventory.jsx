import React, { useState, useEffect } from "react";
import {
  Modal,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";
import styles from "../../Styles/Inventory.module.css";
function Inventory({ open, setOpen, inventory, setInventory }) {
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
                <ListItemText primary="Close Inventory" />
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
            </List>
          ) : (
            <List>
              <ListItem
                button
                onClick={() => setSideMenu(true)}
                className={styles.listItem}
              >
                <ListItemText primary="Open Inventory" />
              </ListItem>
            </List>
          )}
        </div>
        {selectedItem && (
          <div className={styles.item}>
            <Typography variant="h5" gutterBottom>
              Item Name
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
            <Typography variant="h5" gutterBottom>
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
            <Typography variant="h5" gutterBottom>
              Attributes
            </Typography>
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
            <Typography variant="h5" gutterBottom>
              Uses
            </Typography>
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
            <Typography variant="h5" gutterBottom>
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
            <Typography variant="h5" gutterBottom>
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
          </div>
        )}
      </div>
    </Modal>
  );
}

export default Inventory;
