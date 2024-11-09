import { ApiFilterQuery } from "@/shared/decorators/api-filter-query.decorator";
import { SortOrder } from "@/shared/enums/sort-order.enum";
import { ProtectedGuard } from "@/shared/middlewares/protected.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateArtifactDto } from "./dtos/create-artifact.dto";
import { FilterArtifactDto, toFilterModel } from "./dtos/filter-artifact.dto";
import { UpdateArtifactDto } from "./dtos/update-artifact.dto";
import { ArtifactService } from "./artifact.service";

@ApiTags("Artifacts")
@Controller("api/v1/artifacts")
export class ArtifactController {
  constructor(private readonly _service: ArtifactService) {}

  @Get()
  @ApiQuery({
    name: "sortBy",
    required: false,
    example: "updatedAt",
  })
  @ApiQuery({
    name: "sortOrder",
    enum: SortOrder,
    required: false,
    example: SortOrder.DESC,
  })
  @ApiFilterQuery("filter", FilterArtifactDto)
  @ApiQuery({
    name: "ids",
    required: false,
  })
  async getArtifacts(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterArtifactDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
    @Query("ids") ids: string[],
  ) {
    return await this._service.handleGetArtifacts(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
      ids,
    );
  }

  @Get(":id")
  async getArtifactById(@Param("id") id: string) {
    return await this._service.handleGetArtifactById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createArtifact(@Body() data: CreateArtifactDto) {
    return await this._service.handleCreateArtifact(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateArtifact(
    @Param("id") id: string,
    @Body() data: UpdateArtifactDto,
  ) {
    return await this._service.handleUpdateArtifact(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteArtifact(@Param("id") id: string) {
    return await this._service.handleDeleteArtifact(id);
  }
}
