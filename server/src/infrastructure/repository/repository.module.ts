import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";
import { EventRepository } from "./event.repository";
import { FigureRepository } from "./figure.repository";

@Global()
@Module({
  providers: [
    DbService,
    UserRepository,
    RoleRepository,
    EventRepository,
    FigureRepository,
  ],
  exports: [UserRepository, RoleRepository, EventRepository, FigureRepository],
})
export class RepositoryModule {}
