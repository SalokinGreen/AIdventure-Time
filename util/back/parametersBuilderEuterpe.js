import TokenizerService from "./tokenizers/gptTokenizer";
const defaultBans = {
  "clio-v1": [
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
    [23],
    [49522],
    [3695],
    [16967],
    [8353],
    [24],
  ],
  "kayra-v1": [
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

    [12799],
  ],
};
const defaultBias = {
  "clio-v1": null,
  "kayra-v1": [
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
};
export default function parametersBuilderEuterpe(params, model) {
  let bans = [];
  let bias = [];
  let stop = [];
  let order = params.order.map((x) => {
    if (x.active) {
      return x.value;
    }
  });
  order = order.filter((x) => x !== undefined);

  if (Array.isArray(params.bans) && params.bans.length !== 0) {
    bans = params.bans.reduce((acc, x) => {
      const encodedWords = x.words.map((y) => TokenizerService.encode(y));
      return [...acc, ...encodedWords];
    }, []);
  }

  if (Array.isArray(params.biases) && params.biases.length !== 0) {
    bias = params.biases.reduce((acc, x) => {
      const value = x.value;
      const encodedWords = x.words.map((y) => ({
        sequence: TokenizerService.encode(y),
        bias: value,
        ensure_sequence_finish: false,
        generate_once: false,
      }));
      return [...acc, ...encodedWords];
    }, []);
  }
  // stopSequences
  if (
    Array.isArray(params.stopSequences) &&
    params.stopSequences.length !== 0
  ) {
    stop = params.stopSequences.reduce((acc, x) => {
      const encodedWords = x.words.map((y) => TokenizerService.encode(y));
      return [...acc, ...encodedWords];
    }, []);
  }
  console.log(bias);
  const temperature =
    params.temperature > 0 && params.temperature <= 1
      ? params.temperature
      : 0.5;
  const top_k = params.topK >= 0 && params.topK <= 100 ? params.topK : 0;
  const top_p = params.topP >= 0 && params.topP <= 1 ? params.topP : 0.975;
  const tail_free_sampling =
    params.tfs >= 0 && params.tfs <= 1 ? params.tfs : 0.975;
  const repetition_penalty_range =
    params.repetitionPR >= 0 && params.repetitionPR <= 2048
      ? params.repetitionPR
      : 2048;
  const repetition_penalty_slope =
    params.repetitionPS >= 0 && params.repetitionPS <= 1
      ? params.repetitionPS
      : 0.09;
  const repetition_penalty_frequency =
    params.frequencyP >= 0 && params.frequencyP <= 1 ? params.frequencyP : 0;
  const repetition_penalty_presence =
    params.presenceP >= 0 && params.presenceP <= 1 ? params.presenceP : 0;
  const top_a = 0.05 && params.topA <= 1 ? params.topA : 1;
  const typical_p =
    params.typicalP >= 0.05 && params.typicalP <= 1 ? params.typicalP : 1;
  const repetition_penalty =
    params.repetitionP >= 1 && params.repetitionP <= 8
      ? (0.525 * (params.repetitionP - 1)) / 7 + 1
      : 1.148125;
  const cfg_scale =
    params.cfg_scale > 0 && params.cfg_scale <= 3 ? params.cfg_scale : 0;
  const phrase_rep_pen = params.phrase_rep_pen;
  const top_g = params.top_g;
  const mirostat_tau = params.mirostat_tau;
  const mirostat_lr = params.mirostat_lr;
  const parameters = {
    order: order,
    bad_words_ids: [...bans, ...defaultBans[model], [49405], [23], [24]],
    generate_until_sentence: true,
    max_length: params.tokens,
    min_length: 1,
    prefix: "theme_textadventure",

    temperature,
    top_k,
    top_p,
    tail_free_sampling,
    repetition_penalty_range,
    repetition_penalty_slope,
    repetition_penalty_frequency,
    repetition_penalty_presence,
    top_a,
    typical_p,
    repetition_penalty,
    logit_bias_exp: [
      ...bias,
      ...defaultBias[model],
      // {
      //   sequence: [85],
      //   bias: -params.verbosity,
      //   ensure_sequence_finish: false,
      //   generate_once: false,
      // },
    ],
    stop_sequences: [...stop, [49405], [5718]],
    use_string: true,
    use_cache: false,
    return_full_text: false,
    cfg_scale,
    phrase_rep_pen,
    // top_g,
    mirostat_tau,
    mirostat_lr,
    repetition_penalty_whitelist: [
      49256, 49264, 49231, 49230, 49287, 85, 49255, 49399, 49262, 336, 333, 432,
      363, 468, 492, 745, 401, 426, 623, 794, 1096, 2919, 2072, 7379, 1259,
      2110, 620, 526, 487, 16562, 603, 805, 761, 2681, 942, 8917, 653, 3513,
      506, 5301, 562, 5010, 614, 10942, 539, 2976, 462, 5189, 567, 2032, 123,
      124, 125, 126, 127, 128, 129, 130, 131, 132, 588, 803, 1040, 49209, 4, 5,
      6, 7, 8, 9, 10, 11, 12,
    ],
  };
  return parameters;
}
