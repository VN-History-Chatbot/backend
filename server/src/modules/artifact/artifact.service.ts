import { Payload } from "@/core/jwt/payload";
import { LoggerService } from "@/core/log/log.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { ArtifactRepository } from "@/infrastructure/repository/artifact.repository";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import ApiResp from "@/shared/helpers/api.helper";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { DataStatus, Prisma } from "@prisma/client";
import { get } from "lodash";
import { CreateArtifactDto, toModel } from "./dtos/create-artifact.dto";
import { toUpdateModel, UpdateArtifactDto } from "./dtos/update-artifact.dto";
import { HistoryRepository } from "@/infrastructure/repository/history.repository";

@Injectable()
export class ArtifactService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _artifactRepo: ArtifactRepository,
    private readonly _historyRepo: HistoryRepository,
  ) {
    this._logger.setContext("ArtifactServices");
  }

  async handleGetArtifacts(
    page: number,
    pageSize: number,
    filter: Prisma.ArtifactUpdateInput,
    sortBy: string,
    sortOrder: SortOrder,
    ids: string[],
  ) {
    this._logger.log("[GetArtifacts]");

    const data = await this._artifactRepo.findArtifacts(
      page,
      pageSize,
      filter,
      sortBy,
      sortOrder,
      ids,
    );

    return ApiResp.Ok({
      ...data,
    });
  }

  async handleGetArtifactById(id: string) {
    this._logger.log("[GetArtifactById]");

    const artifact = await this._artifactRepo.findArtifactById({ id });

    return ApiResp.Ok({ artifact });
  }

  async handleCreateArtifact(data: CreateArtifactDto) {
    this._logger.log("[CreateArtifact]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[CreateArtifact] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toModel(data, payload.sub);

    model.status = DataStatus.DRAFT;

    const artifact = await this._artifactRepo.createArtifact(model);

    return ApiResp.Ok({
      artifact,
    });
  }

  async handleUpdateArtifact(id: string, data: UpdateArtifactDto) {
    this._logger.log("[UpdateArtifact]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[UpdateArtifact] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const model = toUpdateModel(data, payload.sub);

    const artifact = await this._artifactRepo.updateArtifactById({ id }, model);

    if (artifact.status === DataStatus.PUBLISHED) {
      this._logger.log("[UpdateArtifact] Sync data to history mongodb");
      try {
        await this._historyRepo.syncData({
          id: artifact.id,
          type: "artifact",
          content: `${artifact.name} - ${artifact.description.slice(0, 300)}`,
        });
      } catch (error) {
        this._logger.error(
          "[UpdateArtifact] Error when sync data to history",
          error,
        );
      }
    }

    return ApiResp.Ok({
      artifact,
    });
  }

  async handleDeleteArtifact(id: string) {
    this._logger.log("[DeleteArtifact]");

    // get user payload from request
    const payload = get(this.httpReq, "user") as Payload;
    if (!payload) {
      this._logger.error("[DeleteArtifact] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const artifact = await this._artifactRepo.deleteArtifactById({ id });

    return ApiResp.Ok({
      artifact,
    });
  }
}
