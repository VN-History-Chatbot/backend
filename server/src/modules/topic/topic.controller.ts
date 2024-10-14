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
import { CreateTopicDto } from "./dtos/create-topic.dto";
import { FilterTopicDto, toFilterModel } from "./dtos/filter-topic.dto";
import { UpdateTopicDto } from "./dtos/update-topic.dto";
import { TopicService } from "./topic.service";

@ApiTags("Topics")
@Controller("api/v1/topics")
export class TopicController {
  constructor(private readonly _service: TopicService) {}

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
  @ApiFilterQuery("filter", FilterTopicDto)
  async getTopics(
    @Query("page") page: number,
    @Query("pageSize") pageSize: number,
    @Query("filter") filter: FilterTopicDto,
    @Query("sortBy") sortBy: string,
    @Query("sortOrder") sortOrder: SortOrder,
  ) {
    return await this._service.handleGetTopics(
      page,
      pageSize,
      toFilterModel(filter),
      sortBy,
      sortOrder,
    );
  }

  @Get(":id")
  async getTopicById(@Param("id") id: string) {
    return await this._service.handleGetTopicById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createTopic(@Body() data: CreateTopicDto) {
    return await this._service.handleCreateTopic(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateTopic(@Param("id") id: string, @Body() data: UpdateTopicDto) {
    return await this._service.handleUpdateTopic(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteTopic(@Param("id") id: string) {
    return await this._service.handleDeleteTopic(id);
  }
}
