export default function calculateDamage(level, difficulty) {
    let damageRange = {
        none: [0, 0],
        low: [1, 3],
        medium: [3, 7],
        high: [7, 10]
    };

    let baseDamageRange = damageRange[level];
    let minDamage = baseDamageRange[0] * difficulty;
    let maxDamage = baseDamageRange[1] * difficulty;

    // Calculate a random damage within the range
    let damage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;

    return damage;
}