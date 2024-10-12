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

@Global()
@Module({
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
  ],
})
export class RepositoryModule {}
