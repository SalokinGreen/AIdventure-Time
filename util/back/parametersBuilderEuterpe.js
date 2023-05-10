import TokenizerService from "./tokenizers/gptTokenizer";
const defaultBans = [
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
];
const defaultBias = [
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
];
export default function parametersBuilderEuterpe(params) {
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
  const parameters = {
    order: order,
    bad_words_ids: [...bans, ...defaultBans],
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
    logit_bias_exp: [...bias, ...defaultBias],
    stop_sequences: [...stop],
    use_string: true,
    use_cache: false,
    return_full_text: false,
  };
  return parameters;
}
