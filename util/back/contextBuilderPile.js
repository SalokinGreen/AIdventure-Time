import Tokenizer from "./tokenizers/PileTokenizer";

export default function contextBuilderPile(story, type, input, memory, lore) {
  // reverse story
  const reversedStory = story.reverse();
  //build context
  let context = "";
  let loreContext = "";
  let tokens = 3;
  const maxTokens = 4096;
  // add tokens for input
  if (input) {
    tokens += Tokenizer.encode(input).length;
    if (input === "action" || input === "talk") {
      tokens += 2;
    } else {
      tokens += 1;
    }
  }
  // add tokens for memory
  if (memory) {
    tokens += Tokenizer.encode(memory).length + 1;
  }
  // lore process
  if (lore) {
    lore.map((l) => {
      console.log(l);
      if (tokens + Tokenizer.encode(l).length + 1 < maxTokens) {
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
