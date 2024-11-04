import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { EraRepository } from "@/infrastructure/repository/era.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DataStatus, Prisma } from "@prisma/client";
import { get } from "lodash";
import { CreateEraDto, toModel } from "./dtos/create-era.dto";
import { toUpdateModel, UpdateEraDto } from "./dtos/update-era.dto";
import { HistoryRepository } from "@/infrastructure/repository/history.repository";

@Injectable()
export class EraService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _eraRepo: EraRepository,
    private readonly _historyRepo: HistoryRepository,
  ) {
    this._logger.setContext("EraServices");
  }

  async handleGetEras(
    page: number,
    pageSize: number,
    filter: Prisma.EraUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this._logger.log("[GetEras]");

    const data = await this._eraRepo.findEras(
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

  async handleGetEraById(id: string) {
    this._logger.log("[GetEraById]");

    const era = await this._eraRepo.findEraById({ id });

    return ApiResp.Ok({ era });
  }

  async handleCreateEra(data: CreateEraDto) {
    this._logger.log("[CreateEra]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreateEra] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = DataStatus.DRAFT;

    const era = await this._eraRepo.createEra(model);

    return ApiResp.Ok({
      era,
    });
  }

  async handleUpdateEra(id: string, data: UpdateEraDto) {
    this._logger.log("[UpdateEra]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdateEra] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const era = await this._eraRepo.updateEraById({ id }, model);

    if (era.status === DataStatus.PUBLISHED) {
      this._logger.log("[UpdateEra] Sync data to history mongodb");
      try {
        await this._historyRepo.syncData({
          id: era.id,
          type: "era",
          content: `${era.name} - ${era.description.slice(0, 300)}`,
        });
      } catch (error) {
        this._logger.error(
          "[UpdateEra] Error when sync data to history",
          error,
        );
      }
    }

    return ApiResp.Ok({
      era,
    });
  }

  async handleDeleteEra(id: string) {
    this._logger.log("[DeleteEra]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeleteEra] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const era = await this._eraRepo.deleteEraById({ id });

    return ApiResp.Ok({
      era,
    });
  }
}
