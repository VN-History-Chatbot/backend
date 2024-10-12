import { Module } from "@nestjs/common";

import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [TopicController],
  imports: [RepositoryModule],
  providers: [TopicService],
})
export class TopicModule {}
