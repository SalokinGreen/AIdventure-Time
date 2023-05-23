import checkForKeys from "../checkForKeys";

function skillCheck(
  input,
  stats,
  difficulty,
  inventory,
  health,
  DC,
  item,
  ability
) {
  // return false if no input
  if (!input || input === "") {
    return false;
  }

  let disadvantage = false;
  let advantage = false;
  let roll = Math.floor(Math.random() * 20) + 1;

  // Add disadvantage to the roll based on health.
  if (
    (difficulty === 1 && health < 25) ||
    (difficulty === 2 && health < 50) ||
    (difficulty === 3 && health < 75) ||
    (difficulty === 4 && health < 90)
  ) {
    disadvantage = true;
  }

  // if item, give advantage
  if (item) {
    advantage = true;
  }

  // if disadvantage is true, roll again and take the lowest
  if (disadvantage && !advantage) {
    const roll2 = Math.floor(Math.random() * 20) + 1;
    if (roll2 < roll) {
      roll = roll2;
    }
  } else if (advantage && !disadvantage) {
    // if advantage is true, roll again and take the highest
    const roll2 = Math.floor(Math.random() * 20) + 1;
    if (roll2 > roll) {
      roll = roll2;
    }
  }

  // // set DC based on difficulty
  // const DC = dcs[difficulty] || 10;

  // sort stats by priority. 0 is the lowest priority
  stats.sort((a, b) => b.priority - a.priority);

  // Find the first stat that matches input keywords
  const stat = stats.find((x) => checkForKeys(input, x.keywords));

  // if no stat found, return false
  if (!stat) {
    return false;
  } else {
    // console.log("stat found:", stat);
  }

  // if stat found, add level to roll
  // check if level string
  if (typeof stat.level === "string") {
    // if level is string, turn it into a number
    roll += parseInt(stat.level);
  } else {
    roll += stat.level;
  }
  // For each co, check if the name is in stats, if so, add level to roll
  if (stat.co) {
    stat.co.forEach((x) => {
      const foundStat = stats.find((y) => checkForKeys(y.name, [x]));
      if (foundStat) {
        // check if level string
        if (typeof foundStat.level === "string") {
          // if level is string, turn it into a number
          roll += parseInt(foundStat.level);
        } else {
          roll += foundStat.level;
        }
      }
    });
  }
  // if ability, add ability modifier to roll
  if (ability) {
    // check if ability is string
    if (typeof ability.bonus === "string") {
      // if ability is string, turn it into a number
      ability.bonus = parseInt(ability.bonus);
    } else {
      roll += ability.bonus;
    }
  }
  // Determine outcome
  const outcome = roll >= DC ? stat.outcomes.success : stat.outcomes.failure;
  // deactive item if skill check failed
  if (roll < DC) {
    item = false;
  }
  // return the result
  return {
    roll: roll,
    DC: DC,
    result: roll >= DC,
    outcome,
    skill: stat.name,
    item,
  };
}

export default skillCheck;
