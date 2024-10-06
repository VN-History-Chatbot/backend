import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { ProtectedGuard } from "@/shared/middlewares/protected.guard";
import { CreateEventDto } from "./dtos/create-event.dto";

@ApiTags("Events")
@Controller("events")
export class EventController {
  constructor(private readonly _service: EventService) {}

  @Get()
  async getEvents() {
    return await this._service.handleGetEvents();
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
}
