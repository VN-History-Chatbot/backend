import { Injectable } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { History } from "../schemas/history.schema";

@Injectable()
export class HistoryRepository {
  constructor(
    private dbCtx: DbService,
    @InjectModel(History.name) private readonly historyModel: Model<History>,
  ) {}

  getCollection() {}

  async addData(data: History[]) {
    const result = await this.historyModel.insertMany(data);

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
}
