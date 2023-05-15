import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const req = await request.json();
  // random seed
  const image = await axios
    .post(
      "https://api.novelai.net/ai/generate-image",
      {
        input: `location: {{${req.location}}}, text adventure, presenting, background image`,
        model: "nai-diffusion",
        action: "generate",
        parameters: {
          width: 768,
          height: 512,
          scale: 7,
          sampler: "k_dpmpp_2m",
          steps: 28,
          n_samples: 1,
          ucPreset: 0,
          qualityToggle: false,
          sm: false,
          sm_dyn: false,
          dynamic_thresholding: false,
          controlnet_strength: 1,
          legacy: false,
          negative_prompt:
            "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, explicit, erotic, drawing, anime",
        },
      },
      {
        headers: {
          authorization: `Bearer ${req.key}`,
        },
        responseType: "arraybuffer",
      }
    )
    .catch((err) => {
      console.log(err);
    });
  return new Response(image.data, {
    status: image.status,
    statusText: image.statusText,
    headers: {
      "Content-Type": "application/zip",
    },
  });
}
