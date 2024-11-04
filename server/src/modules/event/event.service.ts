import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { EventRepository } from "@/infrastructure/repository/event.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DataStatus, Prisma } from "@prisma/client";
import { get } from "lodash";
import { CreateEventDto, toModel } from "./dtos/create-event.dto";
import { toUpdateModel, UpdateEventDto } from "./dtos/update-event.dto";
import { HistoryRepository } from "@/infrastructure/repository/history.repository";

@Injectable()
export class EventService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _eventRepo: EventRepository,
    private readonly _historyRepo: HistoryRepository,
  ) {
    this._logger.setContext("EventServices");
  }

  async handleGetEvents(
    page: number,
    pageSize: number,
    filter: Prisma.EventUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this._logger.log("[GetEvents]");

    const data = await this._eventRepo.findEvents(
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

  async handleGetEventById(id: string) {
    this._logger.log("[GetEventById]");

    const event = await this._eventRepo.findEventById({ id });

    return ApiResp.Ok({ event });
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

  async handleUpdateEvent(id: string, data: UpdateEventDto) {
    this._logger.log("[UpdateEvent]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdateEvent] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const event = await this._eventRepo.updateEventById({ id }, model);

    if (event.status === DataStatus.PUBLISHED) {
      this._logger.log("[UpdateEvent] Sync data to history mongodb");
      try {
        await this._historyRepo.syncData({
          id: event.id,
          type: "event",
          content: `${event.name} - ${event.brief}`,
        });
      } catch (error) {
        this._logger.error(
          "[UpdateEvent] Error when sync data to history",
          error,
        );
      }
    }

    return ApiResp.Ok({
      event,
    });
  }

  async handleDeleteEvent(id: string) {
    this._logger.log("[DeleteEvent]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeleteEvent] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const event = await this._eventRepo.deleteEventById({ id });

    return ApiResp.Ok({
      event,
    });
  }
}
