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
import { CreateFigureDto } from "./dtos/create-figure.dto";
import { FilterFigureDto, toFilterModel } from "./dtos/filter-figure.dto";
import { UpdateFigureDto } from "./dtos/update-figure.dto";
import { FigureService } from "./figure.service";

@ApiTags("Figures")
@Controller("api/v1/figures")
export class FigureController {
  constructor(private readonly _service: FigureService) {}

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
  @ApiFilterQuery("filter", FilterFigureDto)
  async getFigures(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterFigureDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
  ) {
    return await this._service.handleGetFigures(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
    );
  }

  @Get(":id")
  async getFigureById(@Param("id") id: string) {
    return await this._service.handleGetFigureById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createFigure(@Body() data: CreateFigureDto) {
    return await this._service.handleCreateFigure(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateFigure(@Param("id") id: string, @Body() data: UpdateFigureDto) {
    return await this._service.handleUpdateFigure(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteFigure(@Param("id") id: string) {
    return await this._service.handleDeleteFigure(id);
  }
}
