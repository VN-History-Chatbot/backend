import { Global, Injectable, Module } from "@nestjs/common";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/shared/constants/env.const";
@Injectable()
export class GeminiService {
  _model: GenerativeModel;
  _embedModel: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    this._model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    this._embedModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
  }

  async generateText(prompt: string) {
    const response = await this._model.generateContent(prompt);

    return response;
  }

  async embedText(text: string) {
    const response = await this._embedModel.embedContent(text.slice(0, 999));

    return response.embedding;
  }
}

@Global()
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
