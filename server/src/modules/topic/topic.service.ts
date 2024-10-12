import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { TopicRepository } from "@/infrastructure/repository/topic.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Prisma, TopicStatus } from "@prisma/client";
import { get } from "lodash";
import { CreateTopicDto, toModel } from "./dtos/create-topic.dto";
import { toUpdateModel, UpdateTopicDto } from "./dtos/update-topic.dto";

@Injectable()
export class TopicService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _topicRepo: TopicRepository,
  ) {
    this._logger.setContext("TopicServices");
  }

  async handleGetTopics(
    page: number,
    pageSize: number,
    filter: Prisma.TopicUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this._logger.log("[GetTopics]");

    const data = await this._topicRepo.findTopics(
      page,
      pageSize,
      filter,
      sortBy,
      sortOrder,
    );

    return ApiResp.Ok({
      ...data,
    });
  }

  async handleGetTopicById(id: string) {
    this._logger.log("[GetTopicById]");

    const topic = await this._topicRepo.findTopicById({ id });

    return ApiResp.Ok({ topic });
  }

  async handleCreateTopic(data: CreateTopicDto) {
    this._logger.log("[CreateTopic]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreateTopic] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = TopicStatus.PENDING;

    const topic = await this._topicRepo.createTopic(model);

    return ApiResp.Ok({
      topic,
    });
  }

  async handleUpdateTopic(id: string, data: UpdateTopicDto) {
    this._logger.log("[UpdateTopic]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdateTopic] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const topic = await this._topicRepo.updateTopicById({ id }, model);

    return ApiResp.Ok({
      topic,
    });
  }

  async handleDeleteTopic(id: string) {
    this._logger.log("[DeleteTopic]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeleteTopic] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const topic = await this._topicRepo.deleteTopicById({ id });

    return ApiResp.Ok({
      topic,
    });
  }
}
