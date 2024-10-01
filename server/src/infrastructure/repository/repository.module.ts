import { Global, Module } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { UserRepository } from "./user.repository";
import { RoleRepository } from "./role.repository";

@Global()
@Module({
  providers: [DbService, UserRepository, RoleRepository],
  exports: [UserRepository, RoleRepository],
})
export class RepositoryModule {}
