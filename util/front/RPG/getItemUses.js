export default function getItemUses(itemQuality, difficulty, playerLevel) {
  // Set base uses for each item quality.
  // Adjust these values to suit your game's balance and design.
  let baseUses = {
    common: 5,
    amazing: 10,
    rare: 15,
    epic: 20,
    legendary: 25,
  };

  // Calculate bonus uses based on the difficulty and player level.
  let difficultyBonus = difficulty; // Each difficulty level adds 1 use.
  let levelBonus = Math.floor(playerLevel / 10); // Every 10 levels add 1 use.

  // Calculate total uses.
  let totalUses = baseUses[itemQuality] + difficultyBonus + levelBonus;

  return totalUses;
}
