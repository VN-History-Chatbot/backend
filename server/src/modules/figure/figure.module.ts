import { Module } from "@nestjs/common";

import { FigureController } from "./figure.controller";
import { FigureService } from "./figure.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [FigureController],
  imports: [RepositoryModule],
  providers: [FigureService],
})
export class FigureModule {}
