import { Module } from "@nestjs/common";

import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [EventController],
  imports: [RepositoryModule],
  providers: [EventService],
})
export class EventModule {}
