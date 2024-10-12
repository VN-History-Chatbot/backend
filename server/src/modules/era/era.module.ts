import { Module } from "@nestjs/common";

import { EraController } from "./era.controller";
import { EraService } from "./era.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [EraController],
  imports: [RepositoryModule],
  providers: [EraService],
})
export class EraModule {}
