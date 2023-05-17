import checkForKeys from "../checkForKeys";

function skillCheck(input, stats, difficulty, equipment, health) {
  // return false if no input
  if (!input || input === "") {
    return false;
  }

  let disadvantage = false;
  let DC = 15;
  let roll = Math.floor(Math.random() * 20) + 1;

  // Add disadvantage to the roll based on health.
  if (
    (difficulty === 1 && health < 25) ||
    (difficulty === 2 && health < 50) ||
    (difficulty === 3 && health < 75) ||
    (difficulty === 1 && health < 90)
  ) {
    disadvantage = true;
  }

  // if disadvantage is true, roll again and take the lowest
  if (disadvantage) {
    const roll2 = Math.floor(Math.random() * 20) + 1;
    if (roll2 < roll) {
      roll = roll2;
    }
  }

  // set DC based on difficulty
  switch (difficulty) {
    case 1:
      DC = 6;
      break;
    case 2:
      DC = 11;
      break;
    case 3:
      DC = 21;
      break;
    case 4:
      DC = 26;
      break;
    default:
      DC = 15;
  }

  // sort stats by priority. 0 is the lowest priority
  stats.sort((a, b) => b.priority - a.priority);

  // if no weapon or armor, remove stats that require them
  if (!equipment.weapon || equipment.weapon.length === 0) {
    stats = stats.filter((x) => !x.weapon?.weapon);
  }
  if (!equipment.armor || equipment.armor.length === 0) {
    stats = stats.filter((x) => !x.armor?.armor);
  }
  // Find the first stat that matches input triggers
  const stat = stats.find((x) => checkForKeys(input, x.triggers));

  // if no stat found, return false
  if (!stat) {
    return false;
  }

  // if stat found, add level to roll
  roll += stat.level;

  // For each co, check if the name is in stats, if so, add level to roll
  if (stat.co) {
    stat.co.forEach((x) => {
      const foundStat = stats.find((y) => checkForKeys(y.name, [x]));
      if (foundStat) {
        roll += foundStat.level;
      }
    });
  }

  // if stat.weapon.weapon is true, check if equipment.weapon is true and equipment.weapon.type is in stat.weapon.type
  if (stat.weapon?.weapon && equipment.weapon?.length > 0) {
    const foundWeapon = equipment.weapon.find((x) =>
      checkForKeys(x.type, [stat.weapon.type])
    );
    if (foundWeapon) {
      roll += foundWeapon.level;
    }
  }

  // if stat.armor.armor is true, check if equipment.armor is true and equipment.armor.type is in stat.armor.type
  if (stat.armor?.armor && equipment.armor?.length > 0) {
    const foundArmor = equipment.armor.find((x) =>
      checkForKeys(x.type, [stat.armor.type])
    );
    if (foundArmor) {
      roll += foundArmor.level;
    }
  }

  // Determine outcome
  const outcome = roll >= DC ? stat.outcomes.success : stat.outcomes.failure;

  // return the result
  return {
    roll: roll,
    DC: DC,
    result: roll >= DC,
    outcome,
    skill: stat.name,
  };
}

export default skillCheck;
