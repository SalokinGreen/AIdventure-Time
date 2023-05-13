function skillCheck(input, stats, difficulty, equipment, heatlh) {
  // find the stat later
  const found = false;
  let disatvantage = false;
  let DC = 10;
  let roll = Math.floor(Math.random() * 20) + 1;
  // return false if no input
  if (!input || input === "") {
    return false;
  }
  // add disatvantage to the roll based on based on health.
  // Add health penality to roll
  if (difficulty === 1 && heatlh < 25) {
    disatvantage = true;
  } else if (difficulty === 2 && heatlh < 50) {
    disatvantage = true;
  } else if (difficulty === 3 && heatlh < 75) {
    disatvantage = true;
  } else if (difficulty === 1 && heatlh < 90) {
    disatvantage = true;
  }
  // if disatvantage is true, roll again and take the lowest
  if (disatvantage) {
    const roll2 = Math.floor(Math.random() * 20) + 1;
    if (roll2 < roll) {
      roll = roll2;
    }
  }
  // set DC based on difficulty
  switch (difficulty) {
    case 1:
      DC = 5;
      break;
    case 2:
      DC = 10;
      break;
    case 3:
      DC = 15;
      break;
    case 4:
      DC = 20;
      break;
  }
  // sort stats by priority; array of objects
  stats = stats.sort((a, b) => {
    return a.priority - b.priority;
  });

  // go through stats
  const stat = stats.map((x) => {
    // go through keywords and finde the first one that matches in input
    const found = x.triggers.find((y) => {
      return input.toLowerCase().includes(y.toLowerCase());
    });
    // if found, return the stat
    if (found) {
      return x;
    }
  });
  // remove undefined
  const statFiltered = stat.filter((x) => {
    return x !== undefined;
  });
  // if no stat found, return false
  if (statFiltered.length === 0) {
    return false;
  }
  // if stat found, add level to roll
  roll += statFiltered[0].level;
  // if stat found, check if ['co'] isn't empty
  if (statFiltered[0].co.length === 0) {
    return false;
  } else {
    // For each co, check if the name is in stats, if so, add level to roll
    statFiltered[0].co.forEach((x) => {
      const found = stats.find((y) => {
        return y.name.toLowerCase() === x.toLowerCase();
      });
      if (found) {
        roll += found.level;
      }
    });

    // if stat.weapon.weapon is true, check if equipment.weapon is true and equipment.weapon.type is in stat.weapon.type
    if (statFiltered[0].weapon.weapon && equipment.weapon.length > 0) {
      const found = equipment.weapon.find((x) => {
        return (
          x.type.toLowerCase() === statFiltered[0].weapon.type.toLowerCase()
        );
      });
      if (found) {
        roll += found.level;
      }
    }
    // if stat.armor.armor is true, check if equipment.armor is true and equipment.armor.type is in stat.armor.type
    if (statFiltered[0].armor.armor && equipment.armor.length > 0) {
      const found = equipment.armor.find((x) => {
        return (
          x.type.toLowerCase() === statFiltered[0].armor.type.toLowerCase()
        );
      });
      if (found) {
        roll += found.level;
      }
    }
  }
  // outcome
  let outcome = "";
  if (roll >= DC) {
    outcome = statFiltered[0].outcomes.success;
  } else {
    outcome = statFiltered[0].outcomes.failure;
  }

  // return the result
  return {
    roll: roll,
    DC: DC,
    result: roll >= DC,
    outcome,
    skill: statFiltered[0].name,
  };
}

export default skillCheck;
