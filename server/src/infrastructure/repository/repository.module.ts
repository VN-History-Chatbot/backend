import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";
import { EventRepository } from "./event.repository";

@Global()
@Module({
  providers: [DbService, UserRepository, RoleRepository, EventRepository],
  exports: [UserRepository, RoleRepository, EventRepository],
})
export class RepositoryModule {}
