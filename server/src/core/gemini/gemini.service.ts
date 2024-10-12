import { Global, Injectable, Module } from "@nestjs/common";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/shared/constants/env.const";
@Injectable()
export class GeminiService {
  _model: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    this._model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateText(prompt: string) {
    const response = await this._model.generateContent(prompt);

    return response;
  }
}

@Global()
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
