import Tokenizer from "./tokenizers/PileTokenizer";
import TokenizerService from "./tokenizers/gptTokenizer";
const modelContextSize = {
  "euterpe-v2": 2048,
  "krake-v2": 2048,
  "cassandra-lit-6-9b": 2048,
  "cassandra-lit-2-8b": 2048,
};
export default function contextBuilderPile(
  story,
  type,
  input,
  memory,
  lore,
  model,
  extra,
  max_length
) {
  //  determine tokenizer
  let tokenizer;
  if (model === "euterpe-v2") {
    tokenizer = TokenizerService;
  } else {
    tokenizer = Tokenizer;
  }
  let reversedStory;
  if (!story) {
    reversedStory = [];
  } else {
    // sort story from biggest index to smallest
    reversedStory = story.sort((a, b) => {
      return b.index - a.index;
    });
    // replace <div> with \n and </div> with "" of all lore entries
    reversedStory = reversedStory.map((s) => {
      return {
        text: s.text.replace(/<div>/g, "\n").replace(/<\/div>/g, ""),
        type: s.type,
      };
    });
  }
  // console.log("extra:", extra);
  //build context
  let context = "";
  let loreContext = "";
  let checkContext = "";
  let memoryContext = "";
  let locationContext = "";
  let inputContext = "";
  let newLocation = "";
  let failureContext = "";
  let itemContext = "";
  let abilityContext = "";
  let ATTG = "[ ";
  let profileContext = "----\nprotagonist\n";
  // how many tokens are and can be used
  let tokens = 3;
  const maxTokens = modelContextSize[model] - max_length - 25;
  // location
  let locationFound = false;
  let locationPut = false;
  const locationRange = 10;
  // add tokens for input
  if (input) {
    // replace <div> with \n and </div> with "" of all lore entries
    input = input.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    tokens += Tokenizer.encode(input).length;
    if (input === "action" || input === "talk") {
      tokens += 2;
    } else {
      tokens += 1;
    }
  }
  // add check if any there
  if (extra.check && extra.check.outcome != "") {
    checkContext = "\n" + extra.check.outcome;
    tokens += tokenizer.encode(checkContext).length;
    if (
      !extra.check.result &&
      tokenizer.encode(`\n ${extra.failMessage}`).length
    ) {
      tokens += tokenizer.encode(`\n ${extra.failMessage}`).length;
      failureContext = `\n${extra.failMessage}`;
    }
  }
  // add item if there
  if (extra.item) {
    if (extra.check && !extra.check.result) {
    } else {
      itemContext = `\n[ You use your ${extra.item.name}: ${extra.item.description} ]\n`;
      tokens += tokenizer.encode(itemContext).length;
    }
  }
  // add ability if there
  if (extra.ability) {
    if (extra.check && !extra.check.result) {
    } else {
      abilityContext = `\n[ You use ${extra.ability.name}: ${extra.ability.description} ]\n`;
      tokens += tokenizer.encode(abilityContext).length;
    }
  }
  if (extra.pick) {
    itemContext = `\n${extra.pick}`;
    tokens += tokenizer.encode(itemContext).length;
  }

  // build attg
  // author
  if (extra.attg.author && extra.attg.author !== "") {
    ATTG += `Author: ${extra.attg.author}; `;
  }
  // title
  if (extra.attg.title && extra.attg.title !== "") {
    ATTG += `Title: ${extra.attg.title}; `;
  }
  // genre
  ATTG += `Genre: ${extra.attg.genre} ]\n`;
  // add tokens
  tokens += tokenizer.encode(ATTG).length;

  // profile builder
  // name
  if (extra.profile.name && extra.profile.name !== "") {
    profileContext += `Name: ${extra.profile.name}\n`;
  }
  // race
  if (extra.profile.race && extra.profile.race !== "") {
    profileContext += `Race: ${extra.profile.race}\n`;
  }
  // occupation
  if (extra.profile.occupation && extra.profile.occupation !== "") {
    profileContext += `Occupation: ${extra.profile.occupation}\n`;
  }
  // mental
  if (extra.profile.mental && extra.profile.mental !== "") {
    profileContext += `Mental: ${extra.profile.mental}\n`;
  }
  // physical
  if (extra.profile.physical && extra.profile.physical !== "") {
    profileContext += `Physical: ${extra.profile.physical}\n`;
  }
  // appearance
  if (extra.profile.appearance && extra.profile.appearance !== "") {
    profileContext += `Appearance: ${extra.profile.appearance}\n`;
  }
  // gear
  if (extra.inventory && extra.inventory.length > 0) {
    let found = false;
    let gear = "";
    extra.inventory.forEach((i) => {
      if (i.active) {
        found = true;
        gear += `${i.name}, `;
      }
    });
    if (found) {
      gear = gear.slice(0, -2);
      profileContext += `Gear: ${gear}\n`;
    }
  }
  // abilities
  if (extra.abilities && extra.abilities.length > 0) {
    let found = false;
    let abilities = "";
    extra.abilities.forEach((a) => {
      if (a.active) {
        found = true;
        abilities += `${a.name}, `;
      }
    });
    if (found) {
      abilities = abilities.slice(0, -2);
      profileContext += `Abilities: ${abilities}\n`;
    }
  }
  // prose
  if (extra.profile.prose && extra.profile.prose !== "") {
    profileContext += `${extra.profile.prose}\n`;
  }
  // add tokens
  tokens += tokenizer.encode(profileContext).length;

  // add tokens for memory
  if (memory && memory !== "") {
    // replace <div> with \n and </div> with "" of all lore entries
    memory = memory.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    tokens +=
      tokenizer.encode(memory).length + tokenizer.encode("\n> info\n").length;
    memoryContext = "\n> info\n" + memory;
  }
  // add new location if any
  if (extra.newLocation) {
    newLocation = "\nLocation:";
    tokens += tokenizer.encode(newLocation).length;
  }
  // lore process
  if (lore) {
    // replace <div> with \n and </div> with "" of all lore entries
    lore = lore.map((l) => {
      return l.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    });

    lore.map((l) => {
      if (tokens + tokenizer.encode(l).length + 1 < maxTokens / 2) {
        loreContext += l + "\n";
        tokens += tokenizer.encode(l).length + 1;
      }
    });
  }
  // Go throught the story and add it to the context
  reversedStory.forEach((story, index) => {
    if (story.type === "action" || story.type === "talk") {
      if (tokens + tokenizer.encode("\n> " + story.text).length < maxTokens) {
        context = "\n> " + story.text + context;
        tokens += tokenizer.encode("\n> " + story.text).length;
      }
    } else {
      if (tokens + tokenizer.encode("\n" + story.text).length < maxTokens) {
        context = "\n" + story.text + context;
        tokens += tokenizer.encode("\n" + story.text).length;
        if (extra.location !== "" && index > locationRange) {
          if (story.text.includes("Location:")) {
            locationFound = true;
          } else if (!locationFound && index > locationRange) {
            if (
              tokens +
                tokenizer.encode(`\nLocation: ${extra.location}`).length <
              maxTokens
            ) {
              context = `\nLocation: ${extra.location}` + context;
              tokens += tokenizer.encode(
                `\nLocation: ${extra.location}`
              ).length;
              locationPut = true;
            }
          }
        }
      }
    }
  });

  // add location if context wasn't long enough
  if (extra.location !== "" && !locationPut && !locationFound) {
    if (
      tokens + tokenizer.encode(`\nLocation: ${extra.location}`).length <
      maxTokens
    ) {
      if (!context.includes("Location:")) {
        locationContext = `\nLocation: ${extra.location}`;
        tokens += tokenizer.encode(`\nLocation: ${extra.location}`).length;
      }
    }
  }

  // add input
  if (input) {
    if (type === "action" || type === "talk") {
      inputContext += "\n> " + input;
    } else {
      inputContext += "\n" + input;
    }
  }

  // add new line if not story
  if (type !== "story" && input) {
    context += "\n";
  }
  // put context together
  context =
    ATTG +
    memoryContext +
    profileContext +
    loreContext +
    "***\n" +
    locationContext +
    context +
    inputContext +
    checkContext +
    newLocation +
    itemContext +
    abilityContext +
    failureContext;

  if (context[0] === "\n") {
    context = context.slice(1);
  }

  // remove all the double new lines
  while (context.includes("\n\n")) {
    context = context.replace("\n\n", "\n");
  }
  // remove double spaces
  while (context.includes("  ")) {
    context = context.replace("  ", " ");
  }
  // remove space after newline
  context = context.replace(/\n /g, "\n");
  // remove space before newline
  context = context.replace(/ \n/g, "\n");
  // remove space if first character
  if (context[0] === " ") {
    context = context.slice(1);
  }
  // return context
  console.log(tokens);
  console.log(context);
  return context;
}
