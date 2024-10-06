import { CacheService } from "@/infrastructure/cache/cache.service";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { LoggerService } from "@/core/log/log.service";
import { EventRepository } from "@/infrastructure/repository/event.repository";
import ApiResp from "@/shared/helpers/api.helper";
import { CreateEventDto, toModel } from "./dtos/create-event.dto";
import { Payload } from "@/core/jwt/payload";
import { get } from "lodash";
import { DataStatus } from "@prisma/client";

@Injectable()
export class EventService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _eventRepo: EventRepository,
  ) {
    this._logger.setContext("EventServices");
  }

  async handleGetEvents() {
    this._logger.log("[GetEvents]");

    const events = await this._eventRepo.getListEvents();

    return ApiResp.Ok({
      events,
    });
  }

  async handleGetEventById(id: string) {
    this._logger.log("[GetEventById]");

    const event = await this._eventRepo.findEventById({ id });

    return ApiResp.Ok(event);
  }

  async handleCreateEvent(data: CreateEventDto) {
    this._logger.log("[CreateEvent]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreateEvent] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = DataStatus.DRAFT;

    const event = await this._eventRepo.createEvent(model);

    return ApiResp.Ok({
      event,
    });
  }
}
