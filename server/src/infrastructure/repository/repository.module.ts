import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { ArtifactRepository } from "./artifact.repository";
import { EraRepository } from "./era.repository";
import { EventRepository } from "./event.repository";
import { FigureRepository } from "./figure.repository";
import { PlaceRepository } from "./place.repository";
import { RoleRepository } from "./role.repository";
import { TopicRepository } from "./topic.repository";
import { UserRepository } from "./user.repository";
import { ConversationRepository } from "./conversation.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { HistorySchema, History } from "../schemas/history.schema";
import { HistoryRepository } from "./history.repository";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  providers: [
    DbService,
    UserRepository,
    RoleRepository,
    EventRepository,
    FigureRepository,
    PlaceRepository,
    ArtifactRepository,
    EraRepository,
    TopicRepository,
    ConversationRepository,
    HistoryRepository,
  ],
  exports: [
    UserRepository,
    RoleRepository,
    EventRepository,
    FigureRepository,
    PlaceRepository,
    ArtifactRepository,
    EraRepository,
    TopicRepository,
    ConversationRepository,
    HistoryRepository,
  ],
})
export class RepositoryModule {}
