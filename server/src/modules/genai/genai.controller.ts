import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GenAIService } from "./genai.service";
import { ProtectedGuard } from "@/shared/middlewares/protected.guard";
import { InsertDataReq } from "./dtos/import-data.dto";
import { SearchDataReq } from "./dtos/search-data.dto";

@ApiTags("GenAI")
@Controller("api/v1/genai")
export class GenAIController {
  constructor(private readonly _service: GenAIService) {}

  @Get("/insert")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async insertData(@Query() query: InsertDataReq) {
    return await this._service.handleAddEvents(query);
  }

  @Post("/search")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async searchData(@Body() body: SearchDataReq) {
    return await this._service.handleSearchData(body);
  }
}
