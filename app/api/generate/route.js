import { NextResponse } from "next/server";
import axios from "axios";
import contextBuilder from "@/util/back/contextBuilder";
import contextBuilderPile from "@/util/back/contextBuilderPile";
import parametersBuilderEuterpe from "@/util/back/parametersBuilderEuterpe";
import parametersBuilderCassandra from "@/util/back/parametersBuilderCassandra";
const parameters = {
  temperature: 0.63,
  max_length: 40,
  min_length: 1,
  top_k: 0,
  top_p: 0.975,
  tail_free_sampling: 0.975,
  repetition_penalty: 1.148125,
  repetition_penalty_range: 2048,
  repetition_penalty_slope: 0.09,
  repetition_penalty_frequency: 0,
  repetition_penalty_presence: 0,
  bad_words_ids: [
    [29],
    [1875],
    [29],
    [1875],
    [29],
    [1875],
    [29],
    [1875],
    [29],
    [1875],
    [58],
    [60],
    [90],
    [92],
    [685],
    [1391],
    [1782],
    [2361],
    [3693],
    [4083],
    [4357],
    [4895],
    [5512],
    [5974],
    [7131],
    [8183],
    [8351],
    [8762],
    [8964],
    [8973],
    [9063],
    [11208],
    [11709],
    [11907],
    [11919],
    [12878],
    [12962],
    [13018],
    [13412],
    [14631],
    [14692],
    [14980],
    [15090],
    [15437],
    [16151],
    [16410],
    [16589],
    [17241],
    [17414],
    [17635],
    [17816],
    [17912],
    [18083],
    [18161],
    [18477],
    [19629],
    [19779],
    [19953],
    [20520],
    [20598],
    [20662],
    [20740],
    [21476],
    [21737],
    [22133],
    [22241],
    [22345],
    [22935],
    [23330],
    [23785],
    [23834],
    [23884],
    [25295],
    [25597],
    [25719],
    [25787],
    [25915],
    [26076],
    [26358],
    [26398],
    [26894],
    [26933],
    [27007],
    [27422],
    [28013],
    [29164],
    [29225],
    [29342],
    [29565],
    [29795],
    [30072],
    [30109],
    [30138],
    [30866],
    [31161],
    [31478],
    [32092],
    [32239],
    [32509],
    [33116],
    [33250],
    [33761],
    [34171],
    [34758],
    [34949],
    [35944],
    [36338],
    [36463],
    [36563],
    [36786],
    [36796],
    [36937],
    [37250],
    [37913],
    [37981],
    [38165],
    [38362],
    [38381],
    [38430],
    [38892],
    [39850],
    [39893],
    [41832],
    [41888],
    [42535],
    [42669],
    [42785],
    [42924],
    [43839],
    [44438],
    [44587],
    [44926],
    [45144],
    [45297],
    [46110],
    [46570],
    [46581],
    [46956],
    [47175],
    [47182],
    [47527],
    [47715],
    [48600],
    [48683],
    [48688],
    [48874],
    [48999],
    [49074],
    [49082],
    [49146],
    [49946],
    [10221],
    [4841],
    [1427],
    [2602, 834],
    [29343],
    [37405],
    [35780],
    [2602],
    [50256],
    [11037],
    [12240],
    [1279],
    [13163],
    [14610],
    [14804],
    [15913],
    [16471],
    [16791],
    [18189],
    [1875],
    [19841],
    [22039],
    [22330],
    [23785],
    [23984],
    [24293],
    [24618],
    [25970],
    [26700],
    [27],
    [28401],
    [28725],
    [29],
    [29342],
    [29847],
    [31175],
    [32406],
    [32756],
    [33409],
    [33490],
    [33717],
    [33994],
    [34516],
    [3556],
    [36475],
    [36937],
    [3784],
    [37922],
    [37981],
    [38155],
    [38214],
    [4211],
    [42496],
    [43734],
    [44167],
    [45160],
    [4613],
    [46904],
    [47934],
    [49029],
    [49778],
    [5218],
    [5320],
    [6927],
    [7359],
    [9609],
    [9959],
    [8162],
  ],
  generate_until_sentence: true,
  use_cache: false,
  use_string: true,
  return_full_text: false,
  prefix:
    "euterpe-v2:4457be15332ea6349e6009ed121d16ca657e9042d8c2006bf39cc35f5b38c4ac:2a7454505c179eae2cd00666e7655a285fe7223bd6e4c1df5702d163756abf53",
  logit_bias_exp: [
    {
      sequence: [8162],
      bias: -0.12,
      ensure_sequence_finish: false,
      generate_once: false,
    },
    {
      sequence: [46256, 224],
      bias: -0.12,
      ensure_sequence_finish: false,
      generate_once: false,
    },
  ],
  num_logprobs: 10,
  order: [2, 1, 3, 0],
};
const novelAIlist = ["krake-v2", "euterpe-v2"];
export async function POST(request) {
  let text, logprobs, verbosityValue;
  const req = await request.json();

  if (novelAIlist.includes(req.model)) {
    const input = contextBuilder(
      req.story,
      req.type,
      req.input,
      req.memory,
      req.lore,
      req.model
    );
    console.log(input);
    const params = parametersBuilderEuterpe(req.parameters);
    console.log(params);
    const response = await axios
      .post(
        "https://api.novelai.net/ai/generate",
        {
          input,
          parameters: params,
          model: req.model,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${req.key}`,
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
    console.log(response.data);
    return NextResponse.json(response.data.output);
  } else {
    const input = contextBuilderPile(
      req.story,
      req.type,
      req.input,
      req.memory,
      req.lore,
      req.model,
      req.extra,
      req.parameters.tokens
    );
    const count = input.split(">").length - 1;
    console.log(input);
    console.log("count: " + count);
    const params = parametersBuilderCassandra(req.parameters, count);
    // console.log(params);
    const response = await axios
      .post(
        `https://api.goose.ai/v1/engines/${req.model}/completions`,
        {
          prompt: input,
          max_tokens: params.max_length,
          min_tokens: 1,
          temperature: params.temperature,
          top_p: params.top_p,
          frequency_penalty: params.repetition_penalty_frequency,
          presence_penalty: params.repetition_penalty_presence,
          stop: params.stop,
          logit_bias: params.biases,
          top_a: params.top_a,
          repetition_penalty: params.repetition_penalty,
          repetition_penalty_slope: params.repetition_penalty_slope,
          repetition_penalty_range: params.repetition_penalty_range,
          typical_p: params.typical_p,
          tfs: params.tail_free_sampling,
          top_k: params.top_k,
          logprobs: 10,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${req.key}`,
          },
        }
      )
      .catch((err) => {
        console.log("ERROR:");
        console.log(err);
      });
    console.log("First Response: ", response.data.choices[0].text);
    // if response.data.choices[0].text doesn't end with punctuation, run again
    if (
      !response.data.choices[0].text.endsWith(".") ||
      !response.data.choices[0].text.endsWith("?") ||
      !response.data.choices[0].text.endsWith("!") ||
      !response.data.choices[0].text.endsWith("...") ||
      !response.data.choices[0].text.endsWith("?!") ||
      !response.data.choices[0].text.endsWith('."') ||
      !response.data.choices[0].text.endsWith('?"') ||
      !response.data.choices[0].text.endsWith('!"') ||
      !response.data.choices[0].text.endsWith('..."')
    ) {
      console.log("And again!");
      const response2 = await axios
        .post(
          `https://api.goose.ai/v1/engines/${req.model}/completions`,
          {
            prompt: input + response.data.choices[0].text,
            max_tokens: 25,
            min_tokens: 1,
            temperature: params.temperature,
            top_p: params.top_p,
            frequency_penalty: params.repetition_penalty_frequency,
            presence_penalty: params.repetition_penalty_presence,
            stop: ['."', '?"', '!"', '..."', ".", "?", "!", "..."],
            logit_bias: params.biases,
            top_a: params.top_a,
            repetition_penalty: params.repetition_penalty,
            repetition_penalty_slope: params.repetition_penalty_slope,
            repetition_penalty_range: params.repetition_penalty_range,
            typical_p: params.typical_p,
            tfs: params.tail_free_sampling,
            top_k: params.top_k,
            logprobs: 10,
          },
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              authorization: `Bearer ${req.key}`,
            },
          }
        )
        .catch((err) => {
          console.log(err);
          return NextResponse.json(err);
        });
      console.log("Second Response: ", response2.data.choices[0].text);
      text = response.data.choices[0].text + response2.data.choices[0].text;
      logprobs = response2.data.choices[0].logprobs;
    } else {
      text = response.data.choices[0].text;
      logprobs = response.data.choices[0].logprobs;
    }
    // add "Location: " to the beginning of the text if newLocation true
    if (req.extra.newLocation) {
      text = "Location:" + text;
    } else if (req.extra.check && !req.extra.check.result) {
      text = req.extra.failMessage + text;
    } else if (req.extra.pick) {
      text = req.extra.pick.description + text;
    }
    // get last logprob
    verbosityValue = logprobs.top_logprobs[logprobs.tokens.length - 1];
    // console.log(logprobs);
    // console.log(verbosityValue);

    return NextResponse.json({ text, verbosityValue, logprobs });
  }
}
