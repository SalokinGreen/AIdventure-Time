import TokenizerService from "./tokenizers/gptTokenizer";
const defaultBans = {
  "euterpe-v2": [
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
  "krake-v2": [
    [60],
    [62],
    [544],
    [683],
    [696],
    [880],
    [905],
    [1008],
    [1019],
    [1084],
    [1092],
    [1181],
    [1184],
    [1254],
    [1447],
    [1570],
    [1656],
    [2194],
    [2470],
    [2479],
    [2498],
    [2947],
    [3138],
    [3291],
    [3455],
    [3725],
    [3851],
    [3891],
    [3921],
    [3951],
    [4207],
    [4299],
    [4622],
    [4681],
    [5013],
    [5032],
    [5180],
    [5218],
    [5290],
    [5413],
    [5456],
    [5709],
    [5749],
    [5774],
    [6038],
    [6257],
    [6334],
    [6660],
    [6904],
    [7082],
    [7086],
    [7254],
    [7444],
    [7748],
    [8001],
    [8088],
    [8168],
    [8562],
    [8605],
    [8795],
    [8850],
    [9014],
    [9102],
    [9259],
    [9318],
    [9336],
    [9502],
    [9686],
    [9793],
    [9855],
    [9899],
    [9955],
    [10148],
    [10174],
    [10943],
    [11326],
    [11337],
    [11661],
    [12004],
    [12084],
    [12159],
    [12520],
    [12977],
    [13380],
    [13488],
    [13663],
    [13811],
    [13976],
    [14412],
    [14598],
    [14767],
    [15640],
    [15707],
    [15775],
    [15830],
    [16079],
    [16354],
    [16369],
    [16445],
    [16595],
    [16614],
    [16731],
    [16943],
    [17278],
    [17281],
    [17548],
    [17555],
    [17981],
    [18022],
    [18095],
    [18297],
    [18413],
    [18736],
    [18772],
    [18990],
    [19181],
    [20095],
    [20197],
    [20481],
    [20629],
    [20871],
    [20879],
    [20924],
    [20977],
    [21375],
    [21382],
    [21391],
    [21687],
    [21810],
    [21828],
    [21938],
    [22367],
    [22372],
    [22734],
    [23405],
    [23505],
    [23734],
    [23741],
    [23781],
    [24237],
    [24254],
    [24345],
    [24430],
    [25416],
    [25896],
    [26119],
    [26635],
    [26842],
    [26991],
    [26997],
    [27075],
    [27114],
    [27468],
    [27501],
    [27618],
    [27655],
    [27720],
    [27829],
    [28052],
    [28118],
    [28231],
    [28532],
    [28571],
    [28591],
    [28653],
    [29013],
    [29547],
    [29650],
    [29925],
    [30522],
    [30537],
    [30996],
    [31011],
    [31053],
    [31096],
    [31148],
    [31258],
    [31350],
    [31379],
    [31422],
    [31789],
    [31830],
    [32214],
    [32666],
    [32871],
    [33094],
    [33376],
    [33440],
    [33805],
    [34368],
    [34398],
    [34417],
    [34418],
    [34419],
    [34476],
    [34494],
    [34607],
    [34758],
    [34761],
    [34904],
    [34993],
    [35117],
    [35138],
    [35237],
    [35487],
    [35830],
    [35869],
    [36033],
    [36134],
    [36320],
    [36399],
    [36487],
    [36586],
    [36676],
    [36692],
    [36786],
    [37077],
    [37594],
    [37596],
    [37786],
    [37982],
    [38475],
    [38791],
    [39083],
    [39258],
    [39487],
    [39822],
    [40116],
    [40125],
    [41000],
    [41018],
    [41256],
    [41305],
    [41361],
    [41447],
    [41449],
    [41512],
    [41604],
    [42041],
    [42274],
    [42368],
    [42696],
    [42767],
    [42804],
    [42854],
    [42944],
    [42989],
    [43134],
    [43144],
    [43189],
    [43521],
    [43782],
    [44082],
    [44162],
    [44270],
    [44308],
    [44479],
    [44524],
    [44965],
    [45114],
    [45301],
    [45382],
    [45443],
    [45472],
    [45488],
    [45507],
    [45564],
    [45662],
    [46265],
    [46267],
    [46275],
    [46295],
    [46462],
    [46468],
    [46576],
    [46694],
    [47093],
    [47384],
    [47389],
    [47446],
    [47552],
    [47686],
    [47744],
    [47916],
    [48064],
    [48167],
    [48392],
    [48471],
    [48664],
    [48701],
    [49021],
    [49193],
    [49236],
    [49550],
    [49694],
    [49806],
    [49824],
    [50001],
    [50256],
    [0],
    [1],
    [29],
    [31],
    [654],
    [870],
    [1138],
    [1168],
    [2033],
    [2239],
    [2730],
    [3001],
    [3073],
    [4357],
    [4398],
    [4713],
    [4725],
    [5064],
    [5204],
    [5264],
    [5291],
    [5647],
    [6750],
    [6781],
    [8239],
    [8743],
    [8994],
    [9884],
    [9983],
    [10122],
    [11049],
    [11380],
    [11396],
    [11899],
    [12399],
    [12630],
    [13011],
    [13143],
    [13208],
    [13544],
    [14157],
    [14193],
    [14219],
    [14277],
    [14490],
    [15104],
    [16160],
    [16262],
    [16375],
    [16616],
    [17266],
    [17636],
    [17778],
    [17987],
    [18257],
    [18331],
    [18474],
    [19282],
    [19884],
    [20322],
    [20499],
    [21083],
    [21431],
    [21760],
    [21966],
    [22158],
    [22226],
    [22747],
    [23983],
    [24576],
    [24815],
    [26077],
    [26786],
    [27482],
    [27988],
    [28120],
    [28365],
    [28379],
    [28391],
    [28739],
    [28905],
    [29972],
    [30119],
    [30189],
    [30803],
    [30863],
    [30952],
    [31422],
    [31547],
    [31759],
    [31841],
    [32044],
    [32056],
    [33094],
    [34616],
    [35402],
    [36784],
    [36893],
    [37014],
    [37322],
    [37387],
    [37471],
    [37916],
    [37944],
    [38270],
    [38271],
    [38329],
    [38363],
    [38709],
    [38958],
    [39334],
    [39822],
    [40000],
    [40354],
    [40473],
    [41533],
    [42854],
    [43467],
    [43521],
    [43600],
    [43736],
    [43781],
    [43856],
    [44072],
    [44153],
    [44342],
    [44679],
    [44740],
    [45635],
    [46145],
    [46267],
    [46294],
    [46410],
    [46762],
    [46768],
    [46802],
    [46880],
    [47007],
    [47269],
    [47384],
    [47940],
    [48074],
    [48744],
    [49384],
    [49651],
    [49821],
    [49884],
  ],
};
const defaultBias = {
  "euterpe-v2": [
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
  "krake-v2": [
    {
      sequence: [9264],
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
  const parameters = {
    order: order,
    bad_words_ids: [...bans, ...defaultBans[model]],
    generate_until_sentence: true,
    max_length: params.tokens,
    min_length: 1,
    // prefix:
    //   "euterpe-v2:4457be15332ea6349e6009ed121d16ca657e9042d8c2006bf39cc35f5b38c4ac:2a7454505c179eae2cd00666e7655a285fe7223bd6e4c1df5702d163756abf53",
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
    logit_bias_exp: [...bias, ...defaultBias[model]],
    stop_sequences: [...stop],
    use_string: true,
    use_cache: false,
    return_full_text: false,
  };
  return parameters;
}
