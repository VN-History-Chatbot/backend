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
import { CreateEventDto } from "./dtos/create-event.dto";
import { FilterEventDto, toFilterModel } from "./dtos/filter-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { EventService } from "./event.service";

@ApiTags("Events")
@Controller("api/v1/events")
export class EventController {
  constructor(private readonly _service: EventService) {}

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
  @ApiFilterQuery("filter", FilterEventDto)
  @ApiQuery({
    name: "ids",
    required: false,
  })
  async getEvents(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterEventDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
    @Query("ids") ids: string[],
  ) {
    return await this._service.handleGetEvents(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
      ids,
    );
  }

  @Get(":id")
  async getEventById(@Param("id") id: string) {
    return await this._service.handleGetEventById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createEvent(@Body() data: CreateEventDto) {
    return await this._service.handleCreateEvent(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateEvent(@Param("id") id: string, @Body() data: UpdateEventDto) {
    return await this._service.handleUpdateEvent(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteEvent(@Param("id") id: string) {
    return await this._service.handleDeleteEvent(id);
  }
}
