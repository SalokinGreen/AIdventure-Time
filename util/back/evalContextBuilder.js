// for gpt2
import TokenizerService from "./tokenizers/gptTokenizer";
// for pile
import Tokenizer from "./tokenizers/PileTokenizer";
export default function evalContextBuilder(story, model) {
  // context
  let context = "";
  let tokens = 0;
  const maxTokens = 300;

  if (model === "euterpe-v2") {
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
  } else {
    // get story
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
          index: s.index,
        };
      });
    }

    let limit = false;
    reversedStory.forEach((story) => {
      if (limit) {
        return;
      }
      if (story.type === "action" || story.type === "talk") {
        if (tokens + Tokenizer.encode("\n> " + story.text).length < maxTokens) {
          context = "\n> " + story.text + context;
          tokens += Tokenizer.encode("\n> " + story.text).length;
        } else {
          limit = true;
        }
      } else {
        if (tokens + Tokenizer.encode("\n" + story.text).length < maxTokens) {
          context = "\n" + story.text + context;
          tokens += Tokenizer.encode("\n" + story.text).length;
        } else {
          limit = true;
        }
      }
    });
  }
  // add asterix
  context = "***\n" + context;
  // remove all the double new lines
  context = context.replace(/\n\n/g, "\n");
  // remove double spaces
  context = context.replace(/\s\s+/g, "");
  // remove spaces attached to new lines
  context = context.replace(/\n\s+/g, "\n");
  //   console.log("context: " + context);
  return context;
}
