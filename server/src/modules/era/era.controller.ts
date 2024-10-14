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
import { CreateEraDto } from "./dtos/create-era.dto";
import { FilterEraDto, toFilterModel } from "./dtos/filter-era.dto";
import { UpdateEraDto } from "./dtos/update-era.dto";
import { EraService } from "./era.service";

@ApiTags("Eras")
@Controller("api/v1/eras")
export class EraController {
  constructor(private readonly _service: EraService) {}

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
  @ApiFilterQuery("filter", FilterEraDto)
  async getEras(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterEraDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
  ) {
    return await this._service.handleGetEras(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
    );
  }

  @Get(":id")
  async getEraById(@Param("id") id: string) {
    return await this._service.handleGetEraById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createEra(@Body() data: CreateEraDto) {
    return await this._service.handleCreateEra(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateEra(@Param("id") id: string, @Body() data: UpdateEraDto) {
    return await this._service.handleUpdateEra(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteEra(@Param("id") id: string) {
    return await this._service.handleDeleteEra(id);
  }
}
