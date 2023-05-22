import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import styles from "../../Styles/Stats.module.css";
import StatDisplay from "./StatDisplay";
import { IoClose } from "react-icons/io5";
import { BiArrowFromRight, BiArrowFromLeft } from "react-icons/bi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Button } from "@mui/material";
import { uuid } from "uuidv4";

export default function Stats({
  open,
  setOpen,
  stats,
  setStats,
  XP,
  setXP,
  difficulty,
  genre,
  setGenre,
  genres,
  setGenres,
  author,
  setAuthor,
  title,
  setTitle,
  profile,
  setProfile,
}) {
  const [tab, setTab] = useState(0);
  const [sideMenu, setSideMenu] = useState(true);
  const [activeStat, setActiveStat] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [co, setCo] = useState("");
  const primary = stats.filter((stat) => {
    return stat.type === "primary";
  });
  const secondary = stats.filter((stat) => {
    return stat.type === "secondary";
  });
  // change stats based on active stat changes with ID
  useEffect(() => {
    if (activeStat) {
      setStats((prev) => {
        return prev.map((stat) => {
          if (stat.id === activeStat.id) {
            return activeStat;
          } else {
            return stat;
          }
        });
      });
    }
  }, [activeStat]);
  const handleDeleteStat = (id) => {
    setStats((prev) => {
      return prev.filter((stat) => {
        return stat.id !== id;
      });
    });
  };
  const handleAddStat = () => {
    setStats((prev) => {
      return [
        ...prev,
        {
          name: "new",
          description: "description",
          level: 0,
          keywords: [],
          type: "secondary",
          id: uuid(),
          priority: 1,
          outcomes: {
            failure: "",
            success: "",
          },
          co: [],
        },
      ];
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="Stats"
      aria-describedby="Stats"
      className={styles.modal}
    >
      <Box className={styles.modalBox}>
        <IoClose
          className={styles.closeIcon}
          onClick={() => setOpen(false)}
          size="3rem"
        />
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="info"
          textColor="primary"
          centered
          className={styles.tabs}
        >
          <Tab label="Stats" className={styles.tab} />
          <Tab label="You" className={styles.tab} />
          <Tab label="Settings" className={styles.tab} />
        </Tabs>
        {tab === 0 && (
          <Box className={styles.tabContainer}>
            <div className={styles.container}>
              <div className={styles.title}>
                <h2>Primary Stats</h2>
                <p>
                  Your primary stats support your secondary stats, but they cost
                  more XP to level up.
                </p>
              </div>
              <div className={styles.statsContainer}>
                {primary.map((stat) => {
                  return (
                    <StatDisplay
                      title={stat.name}
                      description={stat.description}
                      keywords={stat.keywords}
                      level={stat.level}
                      id={stat.id}
                      setStats={setStats}
                      XP={XP}
                      setXP={setXP}
                      type={stat.type}
                      difficulty={difficulty}
                    />
                  );
                })}
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>
                <h2>Secondary Stats</h2>
                <p>
                  Your secondary stats help you in your journey, but they cost
                  less XP to level up.
                </p>
              </div>
              <div className={styles.statsContainer}>
                {secondary.map((stat) => {
                  return (
                    <StatDisplay
                      title={stat.name}
                      description={stat.description}
                      keywords={stat.keywords}
                      level={stat.level}
                      id={stat.id}
                      setStats={setStats}
                      XP={XP}
                      type={stat.type}
                      setXP={setXP}
                      difficulty={difficulty}
                    />
                  );
                })}
              </div>
            </div>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="h6" className={styles.header} color="white">
              ATTG
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Story Title
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Author
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Genre
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        variant="filled"
                        size="small"
                        className={styles.select}
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        color="info"
                      >
                        {genres.map((onegenre) => {
                          return (
                            <MenuItem
                              value={onegenre}
                              selected={onegenre === genre}
                            >
                              {onegenre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" className={styles.header} color="white">
              Profile
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Race
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={profile.race}
                        onChange={(e) =>
                          setProfile({ ...profile, race: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Occupation
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={profile.occupation}
                        onChange={(e) =>
                          setProfile({ ...profile, occupation: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Mental
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={profile.mental}
                        onChange={(e) =>
                          setProfile({ ...profile, mental: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={styles.tableCell}>
                      <Typography
                        varian="h2"
                        className={styles.tableTitle}
                        color={"white"}
                      >
                        Appearance
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="filled"
                        size="small"
                        className={styles.textField}
                        color="info"
                        value={profile.appearance}
                        onChange={(e) =>
                          setProfile({ ...profile, appearance: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <div className={styles.settingsContainer}>
              {sideMenu ? (
                <div classname={styles.sideMenu}>
                  <div
                    className={styles.sideMenuButton}
                    onClick={() => setSideMenu(false)}
                  >
                    <Typography variant="h6">Close</Typography>
                  </div>
                  {stats.map((stat) => {
                    return (
                      <div
                        className={styles.sideMenuButton}
                        onClick={() => {
                          setActiveStat(stat);
                        }}
                      >
                        <Typography variant="h6">{stat.name}</Typography>
                      </div>
                    );
                  })}
                  <div
                    className={styles.sideMenuButton}
                    onClick={() => handleAddStat()}
                  >
                    <Typography variant="h6">Add</Typography>
                  </div>
                </div>
              ) : (
                <div
                  className={styles.openSideMenu}
                  onClick={() => setSideMenu(true)}
                >
                  <BiArrowFromLeft size={30} />
                </div>
              )}
              {activeStat && (
                <div className={styles.settings}>
                  <div className={styles.settingsHeader}>
                    <TableContainer style={{ width: "100%" }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Name
                              </Typography>
                            </TableCell>
                            <TableCell
                              colSpan={
                                activeStat.keywords.length > 0 ||
                                activeStat.co.length > 0
                                  ? 2
                                  : 1
                              }
                            >
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.name}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Description
                              </Typography>
                            </TableCell>
                            <TableCell
                              colSpan={
                                activeStat.keywords.length > 0 ||
                                activeStat.co.length > 0
                                  ? 2
                                  : 1
                              }
                            >
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.description}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Level
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.level}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    level: e.target.value,
                                  })
                                }
                                rows={4}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Type
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Select
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.type}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    type: e.target.value,
                                  })
                                }
                              >
                                <MenuItem value={"primary"}>Primary</MenuItem>
                                <MenuItem value={"secondary"}>
                                  Secondary
                                </MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Priority
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.priority}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    priority: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Co
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={co}
                                onChange={(e) => setCo(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    setActiveStat({
                                      ...activeStat,
                                      co: [...activeStat.co, co],
                                    });
                                    setCo("");
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {activeStat.co.map((co) => {
                                return (
                                  <Chip
                                    label={co}
                                    onClick={() => {
                                      setActiveStat({
                                        ...activeStat,
                                        co: activeStat.co.filter(
                                          (k) => k !== co
                                        ),
                                      });
                                    }}
                                    className={styles.keyword}
                                    color="info"
                                  />
                                );
                              })}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Failure
                              </Typography>
                            </TableCell>

                            <TableCell
                              colSpan={
                                activeStat.keywords.length > 0 ||
                                activeStat.co.length > 0
                                  ? 2
                                  : 1
                              }
                            >
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.outcomes.failure}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    outcomes: {
                                      ...activeStat.outcomes,
                                      failure: e.target.value,
                                    },
                                  })
                                }
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Success
                              </Typography>
                            </TableCell>
                            <TableCell
                              colSpan={
                                activeStat.keywords.length > 0 ||
                                activeStat.co.length > 0
                                  ? 2
                                  : 1
                              }
                            >
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={activeStat.outcomes.success}
                                onChange={(e) =>
                                  setActiveStat({
                                    ...activeStat,
                                    outcomes: {
                                      ...activeStat.outcomes,
                                      success: e.target.value,
                                    },
                                  })
                                }
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Keywords
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="filled"
                                size="small"
                                className={styles.textField}
                                color="info"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    setActiveStat({
                                      ...activeStat,
                                      keywords: [
                                        ...activeStat.keywords,
                                        keyword,
                                      ],
                                    });
                                    setKeyword("");
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {activeStat.keywords.map((keyword) => {
                                return (
                                  <Chip
                                    label={keyword}
                                    onClick={() => {
                                      setActiveStat({
                                        ...activeStat,
                                        keywords: activeStat.keywords.filter(
                                          (k) => k !== keyword
                                        ),
                                      });
                                    }}
                                    className={styles.keyword}
                                    color="info"
                                  />
                                );
                              })}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={styles.tableCell}>
                              <Typography
                                varian="h2"
                                className={styles.tableTitle}
                                color={"white"}
                              >
                                Delete
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  handleDeleteStat(activeStat.id);
                                  setActiveStat(null);
                                }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              )}
            </div>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
