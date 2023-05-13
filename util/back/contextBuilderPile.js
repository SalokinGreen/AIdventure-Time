import Tokenizer from "./tokenizers/PileTokenizer";

export default function contextBuilderPile(
  story,
  type,
  input,
  memory,
  lore,
  model,
  extra
) {
  let reversedStory;
  if (!story) {
    reversedStory = [];
  } else {
    // reverse story
    reversedStory = story.reverse();
    // replace <div> with \n and </div> with "" of all lore entries
    reversedStory = reversedStory.map((s) => {
      return {
        text: s.text.replace(/<div>/g, "\n").replace(/<\/div>/g, ""),
        type: s.type,
      };
    });
  }
  console.log("extra:", extra);
  //build context
  let context = "";
  let loreContext = "";
  let checkContext = " ";
  let tokens = 3;
  const maxTokens = 2048;
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
    checkContext = "\n[" + extra.check.outcome + "]\n";
    tokens += Tokenizer.encode(checkContext).length;
  }
  // add tokens for memory
  if (memory && memory !== "") {
    // replace <div> with \n and </div> with "" of all lore entries
    memory = memory.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    tokens +=
      Tokenizer.encode(memory).length + Tokenizer.encode("\n> info\n").length;
    memory = "\n> info\n" + memory;
  }
  // lore process
  if (lore) {
    // replace <div> with \n and </div> with "" of all lore entries
    lore = lore.map((l) => {
      return l.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
    });
    lore.map((l) => {
      console.log(l);
      if (tokens + Tokenizer.encode(l).length + 1 < maxTokens / 2) {
        loreContext += l + "\n";
        tokens += Tokenizer.encode(l).length + 1;
      }
    });
  }
  // Go throught the story and add it to the context
  reversedStory.forEach((story) => {
    if (story.type === "action" || story.type === "talk") {
      if (tokens + Tokenizer.encode("\n> " + story.text).length < maxTokens) {
        context = "\n> " + story.text + context;
        tokens += Tokenizer.encode("\n> " + story.text).length;
      }
    } else {
      if (tokens + Tokenizer.encode("\n" + story.text).length < maxTokens) {
        context = "\n" + story.text + context;
        tokens += Tokenizer.encode("\n" + story.text).length;
      }
    }
  });
  // add input
  if (input) {
    if (type === "action" || type === "talk") {
      context += "\n> " + input;
    } else {
      context += "\n" + input;
    }
  }
  context = "***\n" + context;
  // remove first new line

  if (context[0] === "\n") {
    context = context.slice(1);
  }
  // add lore
  if (loreContext && loreContext !== "") {
    context = loreContext + "\n" + context;
  }
  // add memory
  if (memory || memory !== "") {
    context = memory + "\n" + context;
  }
  // add new line if not story
  if (type !== "story" && input) {
    context += "\n";
  }
  context += checkContext;

  // remove all the double new lines
  context = context.replace(/\n\n/g, "\n");
  // remove double spaces
  context = context.replace(/\s\s+/g, "");
  // remove spaces attached to new lines
  context = context.replace(/\n\s+/g, "\n");
  // return context
  console.log(tokens);
  return context;
}
