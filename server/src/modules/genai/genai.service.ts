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
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

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
  ) {
    this._logger.setContext("GenAIServices");
  }

  async handleAddEvents() {
    const events = await this._eventRepo.findEvents(1, 100, null);

    const historyEvents: History[] = [];

    for (let i = 0; i < events.data.length; i++) {
      const e = events.data[i];
      const content = e.name + e.content;
      const embeded = await this._geminiService.embedText(content);

      historyEvents.push({
        content: content,
        embedding: embeded.values,
        target: `event_${e.id}`,
      } as History);
    }

    const result = await this._repo.addData(historyEvents);

    return result;
  }
}
