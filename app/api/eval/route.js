import { NextResponse } from "next/server";
import evalContextBuilder from "@/util/back/evalContextBuilder";
import promptsBuilder from "@/util/back/promptsBuilder";
import axios from "axios";
export async function POST(request) {
  const req = await request.json();
  if (req.model === "euterpe-v2") {
  } else {
    const story = evalContextBuilder(req.story, req.model);
    const prefix = promptsBuilder(req.extra.prompts, req.model);
    const prompt = prefix + story + req.extra.input;
    console.log("prompt: ", prompt);
    const response = await axios
      .post(
        "https://api.goose.ai/v1/engines/cassandra-lit-e2-6-7b/completions",
        {
          prompt: prompt,
          max_tokens: 25,
          top_k: 5,
          temperature: 0.25,
          stop: "***",
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
