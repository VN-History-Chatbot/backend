import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";
import { EventRepository } from "./event.repository";
import { FigureRepository } from "./figure.repository";
import { PlaceRepository } from "./place.repository";
import { ArtifactRepository } from "./artifact.repository";
import { EraRepository } from "./era.repository";

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
  ],
  exports: [
    UserRepository,
    RoleRepository,
    EventRepository,
    FigureRepository,
    PlaceRepository,
    ArtifactRepository,
    EraRepository,
  ],
})
export class RepositoryModule {}
