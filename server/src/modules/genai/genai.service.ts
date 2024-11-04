import { GeminiService } from "@/core/gemini/gemini.service";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { ArtifactRepository } from "@/infrastructure/repository/artifact.repository";
import { EventRepository } from "@/infrastructure/repository/event.repository";
import { FigureRepository } from "@/infrastructure/repository/figure.repository";
import { HistoryRepository } from "@/infrastructure/repository/history.repository";
import { PlaceRepository } from "@/infrastructure/repository/place.repository";
import { TopicRepository } from "@/infrastructure/repository/topic.repository";
import { History } from "@/infrastructure/schemas/history.schema";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InsertDataReq } from "./dtos/import-data.dto";
import { SearchDataReq } from "./dtos/search-data.dto";

@Injectable()
export class GenAIService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _repo: HistoryRepository,
    private readonly _topicRepo: TopicRepository,
    private readonly _artifactRepo: ArtifactRepository,
    private readonly _figureRepo: FigureRepository,
    private readonly _placeRepo: PlaceRepository,
    private readonly _eventRepo: EventRepository,
    private readonly _geminiService: GeminiService,
    private readonly _historyRepo: HistoryRepository,
  ) {
    this._logger.setContext("GenAIServices");
  }

  async handleAddEvents(query: InsertDataReq) {
    if (query.type === "event") {
      const events = await this._eventRepo.findEvents(3, 10, null);

      const historyEvents: History[] = [
        // {
        //   content: "test",
        //   target: "test",
        //   embedding: [],
        // } as History,
      ];

      for (let i = 0; i < events.data.length; i++) {
        const e = events.data[i];
        const content = `${e.name} - ${e.brief}`;
        const embeded = await this._geminiService.hfEmbedding(content);

        historyEvents.push({
          content: content,
          embedding: embeded,
          target: `event-${e.id}`,
        } as History);
      }

      const result = await this._repo.addData(historyEvents);

      return ApiResp.Ok({
        data: result.length,
      });
    }

    return ApiResp.Ok();
  }

  async handleSearchData(data: SearchDataReq) {
    if (!data.search) {
      return ApiResp.BadRequest("Search field missing");
    }

    const embed = await this._geminiService.hfEmbedding(data.search);

    const hisData = await this._historyRepo.vectorSearchData(
      embed as number[],
      5,
    );

    return ApiResp.Ok({
      data: hisData,
      // vector: embed.values,
      // response,
    });
  }

  async handleAddDataToMongo(data: {
    type: string;
    id: string;
    content: string;
  }) {
    const embed = await this._geminiService.hfEmbedding(data.content);

    const historyData = {
      content: data.content,
      target: `${data.type}-${data.id}`,
      embedding: embed,
    } as History;

    const exist = await this._repo.getByTarget(`${data.type}-${data.id}`);

    if (exist) {
      const result = await this._repo.updateData(exist.id, historyData);

      return ApiResp.Ok({
        data: result,
      });
    }

    const result = await this._repo.addData([historyData]);

    return ApiResp.Ok({
      data: result,
    });
  }
}
