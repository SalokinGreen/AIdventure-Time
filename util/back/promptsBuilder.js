// for gpt2
import TokenizerService from "./tokenizers/gptTokenizer";
// for pile
import Tokenizer from "./tokenizers/PileTokenizer";

export default function promptsBuilder(prompts, model) {
  // shuffle prompts array
  prompts = prompts.sort(() => Math.random() - 0.5);
  // context
  let context = "";
  let tokens = 0;
  let maxTokens = 1700;
  if (model === "euterpe-v2") {
  } else {
    // go through prompts
    prompts.forEach((prompt) => {
      // if prompt is too long, skip it
      if (Tokenizer.encode(prompt + "\n").length + tokens > maxTokens) {
        return;
      } else {
        context += prompt + "\n";
        tokens += Tokenizer.encode(prompt + "\n").length;
      }
    });
  }
  // remove all the double new lines
  context = context.replace(/\n\n/g, "\n");
  // remove double spaces
  context = context.replace(/\s\s+/g, "");
  // remove spaces attached to new lines
  context = context.replace(/\n\s+/g, "\n");

  // return context
  return context;
}
