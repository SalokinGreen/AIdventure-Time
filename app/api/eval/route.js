import { NextResponse } from "next/server";
import evalContextBuilder from "@/util/back/evalContextBuilder";
import promptsBuilder from "@/util/back/promptsBuilder";
import axios from "axios";
export async function POST(request) {
  const req = await request.json();
  console.log("req: ", req);
  const prefix = promptsBuilder(req.prompts, req.model);
  let prompt;
  if (req.type === "DC") {
    const story = req.story.sort((a, b) => {
      return b.index - a.index;
    });
    const lastStory = story[0];
    prompt = prefix + "***\n" + lastStory.text + "\n" + req.input; //+ lastStory.text
    // remove double newlines from prompt
    prompt = prompt.replace(/\n\n/g, "\n");
  } else {
    const story = evalContextBuilder(req.story, req.model);
    prompt = prefix + story + "\n" + req.input;
  }
  if (req.model === "euterpe-v2") {
  } else {
    console.log("prompt: ", prompt);
    const response = await axios
      .post(
        "https://api.goose.ai/v1/engines/cassandra-lit-e2-6-7b/completions",
        {
          prompt: prompt,
          max_tokens: 100,
          top_k: 6,
          temperature: 0.23,
          stop: ["***", "----"],
          // repetition_penalty: 0.69,
          // tfs: 0.9,
          // top_a: 0.2,
          // typical_p: 0.95,
          // repetition_penalty_range: 2048,
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
            authorization: `Bearer ${process.env.GOOSE_KEY}`,
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    console.log(response.data);
    return NextResponse.json({ output: response.data.choices[0].text });
  }
}
