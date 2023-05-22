import { NextResponse } from "next/server";
import evalContextBuilder from "@/util/back/evalContextBuilder";
import promptsBuilder from "@/util/back/promptsBuilder";
import axios from "axios";
export async function POST(request) {
  const req = await request.json();
  let res;
  // console.log("req: ", req);
  const prefix = promptsBuilder(req.prompts, req.model);
  let prompt;
  if (req.type === "DC") {
    const story = req.story.sort((a, b) => {
      return b.index - a.index;
    });
    let lastStory = story[0];
    if (lastStory === undefined) {
      lastStory = { text: "" };
    }
    prompt = prefix + "***\n" + lastStory.text + "\n" + req.input; //+ lastStory.text
    // remove double newlines from prompt
    prompt = prompt.replace(/\n\n/g, "\n");
  } else if (req.type === "Lore Finder") {
    let input = req.input;
    // if first character is a space, remove it
    if (input[0] === " ") {
      input = input.slice(1);
    }
    prompt = prefix + "\n***\n" + input;
    // remove double newlines from prompt
    prompt = prompt.replace(/\n\n/g, "\n");
  } else {
    const story = evalContextBuilder(req.story, req.model);
    prompt = prefix + story + req.input;
  }
  if (req.model === "euterpe-v2") {
  } else {
    // console.log("prompt: ", prompt);
    const response = await axios
      .post(
        "https://api.goose.ai/v1/engines/cassandra-lit-6-9b/completions",
        {
          prompt: prompt,
          max_tokens: 100,
          top_k: 10,
          temperature: 0.22,
          stop: ["***", "----"],
          repetition_penalty: 1.42,
          top_p: 0.9,
          tfs: 0.901,
          top_a: 0.9,
          // typical_p: 0.95,
          repetition_penalty_range: 2048,
          repetition_penalty_slope: 0.1,
          // frequency_penalty: 0.05,
          // logit_bias: {
          //   187: 0.5,
          //   9151: 1,
          // },
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${req.gooseKey}`,
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    // console.log(response.data);
    res = response.data.choices[0].text;
  }
  return NextResponse.json({ output: res });
}
