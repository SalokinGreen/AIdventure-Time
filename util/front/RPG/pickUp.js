import checkForKeys from "../checkForKeys";
const prompts = [
  `***
> You walk into the armory.
A long room with rows of shelves holding everything from weapons to armor to potions. It's not as big as the one at the academy, but it's still pretty big. There are four other people here besides you and the shopkeeper. The shopkeeper is standing behind his counter, talking to two women who look like they're trying on different clothes. You see them looking through many different things, so you head over to another rack of stuff that holds some basic leather armor and a few shields.
> You grab a shield.
----
Name: Simple Shield
Choices: weapon, protection, healing, other
Type: armor`,
  `***
> You sneak into the dungeon.
You sneak past the skeletons and zombies at the entrance, and enter the dungeon. The place is enormous; it must span several levels. The first floor looks pretty normal, with some stairs leading down to deeper parts of the dungeon. A sign in front of an opening says "First Floor".
> You look for treasures.
You hear a noise coming from upstairs, and then something drops onto the ground. As you approach the stairwell, you realize it was a skull. There are three more up there now too. Then you notice each skeleton has a treasure chest next to it.
> You kill the skeletons.
You grab your sword out of your pack and go after the skeletons. They're easy enough to deal with once you get close enough. You swing your sword at them and take care of all of them taking no damage yourself. You notice that one sword has a golden shine and an emerald-like gemstone set into its hilt, while another has a blue gem in its hilt. The third is plain black metal.
> Pick up the sword.
----
Name: Dwarven Sword
Choices: weapon, protection, healing, other
Type: weapon`,
  `***
You sneaked into the king's bedroom. He had no guards posted outside, so you were able to just walk right in. You stand there silently in his bedroom, staring at him sleeping peacefully on his bed. His face is peaceful, but he doesn't look very well rested.
> You put the sleeping potion into his mouth.
You put the vial containing the sleep potion under his nose and tip it towards his lips until he drinks it. After a moment you see him stir slightly, then fall back asleep again.
> You grab the king's crown.
----
Name: Royal Crown
Choices: weapon, protection, healing, other
Type: protection`,
  `***
You wake up in a strange room. You do not know where you are or how you got here, but it's obviously a prison cell of some sort. Your body feels sore all over and your throat is dry from lack of water.
> You look for water.
You check around the room and find a jug sitting on the table in front of the door. It contains water but also a piece of paper folded up inside. When you open it, there is a note written on it. You read it aloud: "If you drink this water and use this key I have provided you with, you will be free."
> You search for the key.
You try every key in your pocket, but none of them fit the lock on your door. The only key that fits is the one you found in the jug with the note. When you turn it, the lock pops open and you step out of your cell.
> You look around.
Your surroundings appear to be a small castle courtyard filled with trees and plants growing everywhere. To your left are two stone staircases leading upwards to what appears to be a tower. To your right are four wooden doors leading off from the courtyard. A silver bow is lying in front of you.
> You grab the bow.
----
Name: Silver Bow
Choices: weapon, protection, healing, other
Type: weapon`,
  `***
> You enter the potion shop.
The door opens up into a large circular room full of shelves holding jars and bottles and bottles of potions of all types. In the center is a counter with several chairs around it and behind it is the shopkeeper who looks up from her book as she greets you with a smile.
> You greet her.
"Welcome to my little store! What can I help you with today?" She asks cheerfully, motioning for you to come closer so she can hear you better.
> You say, "I want a potion of invisibility."
"Well," she says, "That would be a rare request indeed!" She sets down her book and walks over to a shelf full of glass bottles and pulls one down. "This potion will make you completely invisible for an hour.
> Take the potion.
----
Name: Potion of Invisibility - Rare Formulation
Choices: weapon, protection, healing, other
Type: other`,
  `***
The kitchen is a long hall with counters running down either side where servants are busy cooking meals for everyone else. There is an enormous fireplace near the end of the hallway and a long table with seats along one wall where you sit down
> You grab some food from the kitchens.
----
Name: Cooked Steak
Choices: weapon, protection, healing, other
Type: healing`,
  `***
You enter a dark room filled with tables lined against the walls with many people eating their dinner at each one. A man sits at a desk near the front of the room and when he notices you he stands up and walks towards you. He has short brown hair and an unshaven face that looks like he hasn't shaved in days. You notice an arrow lying around.
> You take the arrow from him.
----
Name: Arrow
Choices: weapon, protection, healing, other
Type: other`,
  `***
You enter the evidence room and look through a few books for anything that might be useful for getting rid of your mark or making it look like someone else did it. Then you look through some boxes on a shelf for anything that might be useful for disguising yourself or finding out who your mark is.
> You take drugs.
----
Name: Drugs
Choices: weapon, protection, healing, other
Type: other`,
];
const types = "melee weapon, ranged weapon, armor, ammunition, other";
const keys = ["pick up", "pick", "grab", "take", "get"];
export default function pickUp(input) {
  if (checkForKeys(input, keys)) {
    const newInput =
      "\n> " + input + "\n----\n" + "Choices: " + types + "\nName:";
    ("");

    return {
      prompts,
      types,
      input: newInput,
    };
  } else {
    return false;
  }
}
