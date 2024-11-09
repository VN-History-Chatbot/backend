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
import { CreatePlaceDto } from "./dtos/create-place.dto";
import { FilterPlaceDto, toFilterModel } from "./dtos/filter-place.dto";
import { UpdatePlaceDto } from "./dtos/update-place.dto";
import { PlaceService } from "./place.service";

@ApiTags("Places")
@Controller("api/v1/places")
export class PlaceController {
  constructor(private readonly _service: PlaceService) {}

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
  @ApiFilterQuery("filter", FilterPlaceDto)
  @ApiQuery({
    name: "ids",
    required: false,
  })
  async getPlaces(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterPlaceDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
    @Query("ids") ids: string[],
  ) {
    return await this._service.handleGetPlaces(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
      ids,
    );
  }

  @Get(":id")
  async getPlaceById(@Param("id") id: string) {
    return await this._service.handleGetPlaceById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createPlace(@Body() data: CreatePlaceDto) {
    return await this._service.handleCreatePlace(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updatePlace(@Param("id") id: string, @Body() data: UpdatePlaceDto) {
    return await this._service.handleUpdatePlace(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deletePlace(@Param("id") id: string) {
    return await this._service.handleDeletePlace(id);
  }
}
