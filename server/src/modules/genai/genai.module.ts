import { Module } from "@nestjs/common";

import { GenAIController } from "./genai.controller";
import { GenAIService } from "./genai.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [GenAIController],
  imports: [RepositoryModule],
  providers: [GenAIService],
})
export class GenAIModule {}
