import { Module } from "@nestjs/common";

import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [PlaceController],
  imports: [RepositoryModule],
  providers: [PlaceService],
})
export class PlaceModule {}
