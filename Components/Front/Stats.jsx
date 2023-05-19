import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import styles from "../../Styles/Stats.module.css";
import StatDisplay from "./StatDisplay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Stats({ open, setOpen, stats, setStats }) {
  const settings = {
    dots: true,
    // infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [tab, setTab] = useState(0);
  const primary = stats.filter((stat) => {
    return stat.type === "primary";
  });
  const secondary = stats.filter((stat) => {
    return stat.type === "secondary";
  });
  console.log(primary, secondary);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="Stats"
      aria-describedby="Stats"
      className={styles.modal}
    >
      <Box className={styles.modalBox}>
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
                  These are the stats that are used to calculate your score.
                </p>
              </div>
              <div className={styles.statsContainer}>
                <Slider>
                  {primary.map((stat) => {
                    return (
                      <StatDisplay
                        title={stat.name}
                        description={stat.description}
                        keywords={stat.keywords}
                        level={stat.level}
                        id={stat.id}
                        setStats={setStats}
                      />
                    );
                  })}
                </Slider>
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>
                <h2>Secondary Stats</h2>
                <p>
                  These are the stats that are used to calculate your score.
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
                      index={stat.index}
                      setStats={setStats}
                    />
                  );
                })}
              </div>
            </div>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
