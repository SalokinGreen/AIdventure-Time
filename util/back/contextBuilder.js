import TokenizerService from "./tokenizers/gptTokenizer";

export default function contextBuilder(story, type, input, memory, lore) {
  // reverse story
  const reversedStory = story.reverse();
  //build context
  let context = "";
  let loreContext = "";
  let tokens = 3;
  const maxTokens = 2048;
  // add tokens for input
  if (input) {
    tokens += TokenizerService.encode(input).length;
    if (input === "action" || input === "talk") {
      tokens += 2;
    } else {
      tokens += 1;
    }
  }
  // add tokens for memory
  if (memory) {
    tokens += TokenizerService.encode(memory).length + 1;
  }
  // lore process
  if (lore) {
    lore.map((l) => {
      console.log(l);
      if (tokens + TokenizerService.encode(l).length + 1 < maxTokens / 2) {
        loreContext += l + "\n";
        tokens += TokenizerService.encode(l).length + 1;
      }
    });
  }
  // Go throught the story and add it to the context
  reversedStory.forEach((story) => {
    if (story.type === "action" || story.type === "talk") {
      if (
        tokens + TokenizerService.encode("\n> " + story.text).length <
        maxTokens
      ) {
        context = "\n> " + story.text + context;
        tokens += TokenizerService.encode("\n> " + story.text).length;
      }
    } else {
      if (
        tokens + TokenizerService.encode("\n" + story.text).length <
        maxTokens
      ) {
        context = "\n" + story.text + context;
        tokens += TokenizerService.encode("\n" + story.text).length;
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
