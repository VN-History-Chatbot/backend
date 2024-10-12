import { Module } from "@nestjs/common";

import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [ConversationController],
  imports: [RepositoryModule],
  providers: [ConversationService],
})
export class ConversationModule {}
