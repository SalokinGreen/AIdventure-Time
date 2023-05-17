import Tokenizer from "./tokenizers/PileTokenizer";
const defaultBans = ["58", "685", "29", "1875", "14749"];
const defaultBias = [];
function adjustLogprob(verbosity, logprob) {
  const adjustment = -verbosity * 0.1;
  const bias = 1.15;
  const adjustedLogprob = -Math.exp(logprob) * 1 + adjustment + bias;

  return adjustedLogprob;
}

export default function parametersBuilderCassandra(params, count) {
  let bans = {};
  let bias = {};
  let stop = [];
  if (params.verbosity === 1) {
    bias = {
      198: 0.1 - count * 0.01,
    };
  } else if (params.verbosity === 2) {
    bias = {
      198: -1.5 - count * 0.01,
    };
  } else if (params.verbosity === 3) {
    bias = {
      198: -2.5 - count * 0.01,
    };
  } else {
    bias = {
      198: 0 - count * 0.01,
    };
  }
  // bans

  // add default bans
  if (Array.isArray(defaultBans) && defaultBans.length !== 0) {
    defaultBans.forEach((x) => {
      bias[x] = -100;
    });
  }
  // add bans
  if (Array.isArray(params.bans) && params.bans.length !== 0) {
    params.bans.forEach((x) => {
      x.words.forEach((word) => {
        const encodedWordArray = Tokenizer.encode(word);
        encodedWordArray.forEach((int) => {
          bias[int] = -100;
        });
      });
    });
  }
  console.log(bans);
  // biases
  if (Array.isArray(params.biases) && params.biases.length !== 0) {
    params.biases.forEach((x) => {
      const value = x.value;
      x.words.forEach((word) => {
        const encodedWordArray = Tokenizer.encode(word);
        encodedWordArray.forEach((int) => {
          bias[int] = value;
        });
      });
    });
  }
  console.log(bias);

  // stopSequences
  if (
    Array.isArray(params.stopSequences) &&
    params.stopSequences.length !== 0
  ) {
    params.stopSequences.forEach((x) => {
      x.words.forEach((word) => {
        stop.push(word);
      });
    });
  }
  console.log(stop);
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
  const parameters = {
    generate_until_sentence: true,
    max_length: params.tokens,
    min_length: 1,
    prefix:
      "euterpe-v2:4457be15332ea6349e6009ed121d16ca657e9042d8c2006bf39cc35f5b38c4ac:2a7454505c179eae2cd00666e7655a285fe7223bd6e4c1df5702d163756abf53",
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
    biases: bias,
    stop: stop,
    use_string: true,
    use_cache: false,
    return_full_text: false,
  };
  return parameters;
}
