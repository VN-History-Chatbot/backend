import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { PlaceRepository } from "@/infrastructure/repository/place.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DataStatus, Prisma } from "@prisma/client";
import { get } from "lodash";
import { CreatePlaceDto, toModel } from "./dtos/create-place.dto";
import { toUpdateModel, UpdatePlaceDto } from "./dtos/update-place.dto";

@Injectable()
export class PlaceService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _placeRepo: PlaceRepository,
  ) {
    this._logger.setContext("PlaceServices");
  }

  async handleGetPlaces(
    page: number,
    pageSize: number,
    filter: Prisma.PlaceUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this._logger.log("[GetPlaces]");

    const data = await this._placeRepo.findPlaces(
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

  async handleGetPlaceById(id: string) {
    this._logger.log("[GetPlaceById]");

    const place = await this._placeRepo.findPlaceById({ id });

    return ApiResp.Ok({ place });
  }

  async handleCreatePlace(data: CreatePlaceDto) {
    this._logger.log("[CreatePlace]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreatePlace] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = DataStatus.DRAFT;

    const place = await this._placeRepo.createPlace(model);

    return ApiResp.Ok({
      place,
    });
  }

  async handleUpdatePlace(id: string, data: UpdatePlaceDto) {
    this._logger.log("[UpdatePlace]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdatePlace] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const place = await this._placeRepo.updatePlaceById({ id }, model);

    return ApiResp.Ok({
      place,
    });
  }

  async handleDeletePlace(id: string) {
    this._logger.log("[DeletePlace]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeletePlace] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const place = await this._placeRepo.deletePlaceById({ id });

    return ApiResp.Ok({
      place,
    });
  }
}
