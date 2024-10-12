import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";
import { EventRepository } from "./event.repository";
import { FigureRepository } from "./figure.repository";
import { PlaceRepository } from "./place.repository";
import { ArtifactRepository } from "./artifact.repository";

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
  ],
  exports: [
    UserRepository,
    RoleRepository,
    EventRepository,
    FigureRepository,
    PlaceRepository,
    ArtifactRepository,
  ],
})
export class RepositoryModule {}
