export default function itemLevelGenerator(
  currentScore,
  playerLevel,
  difficulty,
  bonus = false
) {
  // Base odds for each item quality.

  let odds = {
    common: 50,
    amazing: 30,
    rare: 15,
    epic: 4,
    legendary: 1,
  };

  // If the bonus is true, increase the odds of getting a better item.
  if (bonus) {
    odds = {
      common: 20,
      amazing: 30,
      rare: 25,
      epic: 20,
      legendary: 5,
    };
  }

  // Increase the odds based on the player's level and current score.
  let levelFactor = playerLevel / 100;
  let scoreFactor = currentScore / 1000; // Assuming the score can go up to tens of thousands, adjust it to 10000 if needed.
  let difficultyFactor = difficulty / 4; // Normalize the difficulty (1-4 scale) to a 0-1 scale.

  odds = {
    common: odds.common - difficultyFactor * (levelFactor + scoreFactor),
    amazing: odds.amazing + (levelFactor + scoreFactor),
    rare: odds.rare + 2 * difficultyFactor * (levelFactor + scoreFactor),
    epic: odds.epic + 3 * difficultyFactor * (levelFactor + scoreFactor),
    legendary:
      odds.legendary + 4 * difficultyFactor * (levelFactor + scoreFactor),
  };

  // Generate a random number between 0 and the total of the odds.
  let totalOdds =
    odds.common + odds.amazing + odds.rare + odds.epic + odds.legendary;
  let roll = Math.random() * totalOdds;

  // Determine the item quality based on the roll.
  if (roll < odds.common) {
    return "common";
  } else if (roll < odds.common + odds.amazing) {
    return "amazing";
  } else if (roll < odds.common + odds.amazing + odds.rare) {
    return "rare";
  } else if (roll < odds.common + odds.amazing + odds.rare + odds.epic) {
    return "epic";
  } else {
    return "legendary";
  }
}
