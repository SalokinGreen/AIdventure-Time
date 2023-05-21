import Tokenizer from "./tokenizers/PileTokenizer";

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
  let ATTG = "[ ";
  let profileContext = "----\nprotagonist\n";
  // how many tokens are and can be used
  let tokens = 3;
  const maxTokens = 2048 - max_length - 25;
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
    tokens += Tokenizer.encode(checkContext).length;
    if (
      !extra.check.result &&
      Tokenizer.encode(`\n ${extra.failMessage}`).length
    ) {
      tokens += Tokenizer.encode(`\n ${extra.failMessage}`).length;
      failureContext = `\n${extra.failMessage}`;
    }
  }
  if (extra.pick) {
    itemContext = `\n${extra.pick}`;
    tokens += Tokenizer.encode(itemContext).length;
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
  tokens += Tokenizer.encode(ATTG).length;

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
  // add tokens
  tokens += Tokenizer.encode(profileContext).length;

  // add tokens for memory
  if (memory && memory !== "") {
    // replace <div> with \n and </div> with "" of all lore entries
    memory = memory.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    tokens +=
      Tokenizer.encode(memory).length + Tokenizer.encode("\n> info\n").length;
    memoryContext = "\n> info\n" + memory;
  }
  // add new location if any
  if (extra.newLocation) {
    newLocation = "\nLocation:";
    tokens += Tokenizer.encode(newLocation).length;
  }
  // lore process
  if (lore) {
    // replace <div> with \n and </div> with "" of all lore entries
    lore = lore.map((l) => {
      return l.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    });

    lore.map((l) => {
      if (tokens + Tokenizer.encode(l).length + 1 < maxTokens / 2) {
        loreContext += l + "\n";
        tokens += Tokenizer.encode(l).length + 1;
      }
    });
  }
  // Go throught the story and add it to the context
  reversedStory.forEach((story, index) => {
    if (story.type === "action" || story.type === "talk") {
      if (tokens + Tokenizer.encode("\n> " + story.text).length < maxTokens) {
        context = "\n> " + story.text + context;
        tokens += Tokenizer.encode("\n> " + story.text).length;
      }
    } else {
      if (tokens + Tokenizer.encode("\n" + story.text).length < maxTokens) {
        context = "\n" + story.text + context;
        tokens += Tokenizer.encode("\n" + story.text).length;
        if (extra.location !== "" && index > locationRange) {
          if (story.text.includes("Location:")) {
            locationFound = true;
          } else if (!locationFound && index > locationRange) {
            if (
              tokens +
                Tokenizer.encode(`\nLocation: ${extra.location}`).length <
              maxTokens
            ) {
              context = `\nLocation: ${extra.location}` + context;
              tokens += Tokenizer.encode(
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
      tokens + Tokenizer.encode(`\nLocation: ${extra.location}`).length <
      maxTokens
    ) {
      if (!context.includes("Location:")) {
        locationContext = `\nLocation: ${extra.location}`;
        tokens += Tokenizer.encode(`\nLocation: ${extra.location}`).length;
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
    profileContext +
    memoryContext +
    loreContext +
    "***\n" +
    locationContext +
    context +
    inputContext +
    checkContext +
    newLocation +
    itemContext +
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
  return context;
}
