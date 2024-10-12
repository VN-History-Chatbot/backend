import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { FigureRepository } from "@/infrastructure/repository/figure.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DataStatus, Prisma } from "@prisma/client";
import { get } from "lodash";
import { CreateFigureDto, toModel } from "./dtos/create-figure.dto";
import { toUpdateModel, UpdateFigureDto } from "./dtos/update-figure.dto";

@Injectable()
export class FigureService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _figureRepo: FigureRepository,
  ) {
    this._logger.setContext("FigureServices");
  }

  async handleGetFigures(
    page: number,
    pageSize: number,
    filter: Prisma.FigureUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
  ) {
    this._logger.log("[GetFigures]");

    const data = await this._figureRepo.findFigures(
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

  async handleGetFigureById(id: string) {
    this._logger.log("[GetFigureById]");

    const figure = await this._figureRepo.findFigureById({ id });

    return ApiResp.Ok({ figure });
  }

  async handleCreateFigure(data: CreateFigureDto) {
    this._logger.log("[CreateFigure]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreateFigure] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = DataStatus.DRAFT;

    const figure = await this._figureRepo.createFigure(model);

    return ApiResp.Ok({
      figure,
    });
  }

  async handleUpdateFigure(id: string, data: UpdateFigureDto) {
    this._logger.log("[UpdateFigure]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdateFigure] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const figure = await this._figureRepo.updateFigureById({ id }, model);

    return ApiResp.Ok({
      figure,
    });
  }

  async handleDeleteFigure(id: string) {
    this._logger.log("[DeleteFigure]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeleteFigure] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const figure = await this._figureRepo.deleteFigureById({ id });

    return ApiResp.Ok({
      figure,
    });
  }
}
