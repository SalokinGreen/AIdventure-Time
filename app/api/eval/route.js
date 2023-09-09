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
  if (req.model === "kayra-v1" || req.model === "clio-v1") {
    // console.log(prompt);
    const response = await axios
      .post(
        "https://api.novelai.net/ai/generate",
        {
          input: prompt,
          parameters: {
            stop_sequences: [[43145], [19438], [23], [24]],
            generate_until_sentence: true,
            use_string: true,
            prefix: "special_instruct",
            temperature: 0.7,
            max_length: 40,
            min_length: 1,
            top_p: 0.1,
            repetition_penalty: 1.356,
            repetition_penalty_range: 8192,
            repetition_penalty_slope: 0.01,
            repetition_penalty_frequency: 0,
            repetition_penalty_presence: 0,
            phrase_rep_pen: "very_light",
            top_g: 0,
            bad_words_ids: [
              [3],
              [49356],
              [1431],
              [31715],
              [34387],
              [20765],
              [30702],
              [10691],
              [49333],
              [1266],
              [19438],
              [43145],
              [26523],
              [41471],
              [2936],
              [85, 85],
              [49332],
              [7286],
              [1115],
            ],
            logit_bias_exp: [
              {
                sequence: [23],
                bias: -0.08,
                ensure_sequence_finish: false,
                generate_once: false,
              },
              {
                sequence: [21],
                bias: -0.08,
                ensure_sequence_finish: false,
                generate_once: false,
              },
            ],
            num_logprobs: 10,
            order: [2, 0],
          },
          model: req.model,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${req.naiKey}`,
          },
        }
      )
      .catch((err) => {
        console.log(err);
        return NextResponse.json(err);
      });
    console.log(response.data.output);
    res = response.data.output;
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
          repetition_penalty: 0.96,
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
/*
 parameters: {
            // prefix: "special_instruct",
            temperature: 1.21,
            max_length: 40,
            min_length: 1,
            top_k: 0,
            top_p: 0.912,
            typical_p: 0.912,
            tail_free_sampling: 0.921,
            repetition_penalty: 1.21,
            repetition_penalty_range: 321,
            repetition_penalty_slope: 2.1,
            repetition_penalty_frequency: 0.00621,
            repetition_penalty_presence: 0,
            phrase_rep_pen: "very_light",
            bad_words_ids: [
              [3],
              [49356],
              [1431],
              [31715],
              [34387],
              [20765],
              [30702],
              [10691],
              [49333],
              [1266],
              [19438],
              [43145],
              [26523],
              [41471],
              [2936],
              [85, 85],
              [49332],
              [7286],
              [1115],
            ],
            generate_until_sentence: true,
            use_cache: false,
            use_string: true,
            return_full_text: false,
            prefix: "vanilla",
            logit_bias_exp: [
              {
                sequence: [23],
                bias: -0.08,
                ensure_sequence_finish: false,
                generate_once: false,
              },
              {
                sequence: [21],
                bias: -0.08,
                ensure_sequence_finish: false,
                generate_once: false,
              },
            ],
            num_logprobs: 10,
            order: [0, 5, 3, 2, 1],
          },
          */
