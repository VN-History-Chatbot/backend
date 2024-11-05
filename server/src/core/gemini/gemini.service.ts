import { Global, Injectable, Module } from "@nestjs/common";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GEMINI_API_KEY, HF_TOKEN } from "@/shared/constants/env.const";

import { HfInference } from "@huggingface/inference";

@Injectable()
export class GeminiService {
  _model: GenerativeModel;
  _embedModel: GenerativeModel;
  _hf: HfInference;

  constructor() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    this._model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Tôi là 1 chuyên gia về Lịch sử Việt Nam, hãy hỏi tôi về lịch sử Việt Nam nhé!",
    });

    this._embedModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    this._hf = new HfInference(HF_TOKEN);
  }

  async generateText(prompt: string) {
    const response = await this._model.generateContent(prompt);

    return response;
  }

  async embedText(text: string) {
    const response = await this._embedModel.embedContent(text.slice(0, 999));

    return response.embedding;
  }

  async hfEmbedding(text: string) {
    const embeddings = await this._hf.featureExtraction({
      model: "dangvantuan/vietnamese-embedding",
      inputs: text,
    });

    return embeddings;
  }

  async hfGenerateText(prompt: string) {
    const response = await this._hf.textGeneration({
      model: "vinai/phobert-base-v2",
      inputs: prompt,
    });

    return response;
  }
}

@Global()
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
