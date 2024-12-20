import { Injectable } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { History } from "../schemas/history.schema";
import { GeminiService } from "@/core/gemini/gemini.service";

@Injectable()
export class HistoryRepository {
  constructor(
    private dbCtx: DbService,
    @InjectModel(History.name) private readonly historyModel: Model<History>,
    private readonly _geminiService: GeminiService,
  ) {}

  getCollection() {}

  async addData(data: History[]) {
    const result = await this.historyModel.insertMany(data);

    return result;
  }

  async getByTarget(target: string) {
    const result = await this.historyModel.findOne({ target });

    return result;
  }

  async vectorSearchData(vector: number[], limit: number) {
    const result = await this.historyModel.aggregate([
      {
        $vectorSearch: {
          index: "vectorsearch",
          queryVector: vector,
          path: "embedding",
          limit,
          numCandidates: 100,
        },
      },
      {
        $project: {
          content: 1,
          target: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return result;
  }

  async updateData(id: string, data: Partial<History>) {
    const result = await this.historyModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return result;
  }

  async syncData(data: {
    id: string;
    type: string;
    content: string;
    // embed: number[];
  }) {
    const embed = await this._geminiService.hfEmbedding(data.content);

    const historyData = {
      content: data.content,
      target: `${data.type}-${data.id}`,
      embedding: embed,
    } as History;

    const exist = await this.getByTarget(`${data.type}-${data.id}`);

    if (exist) {
      await this.updateData(exist.id, historyData);

      return 1;
    }

    const result = await this.addData([historyData]);

    return result.length;
  }
}
