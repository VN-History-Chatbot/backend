import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";
import { EventRepository } from "./event.repository";
import { ConversationRepository } from "./conversation.repository";

@Global()
@Module({
  providers: [
    DbService,
    UserRepository,
    RoleRepository,
    EventRepository,
    ConversationRepository,
  ],
  exports: [
    UserRepository,
    RoleRepository,
    EventRepository,
    ConversationRepository,
  ],
})
export class RepositoryModule {}
