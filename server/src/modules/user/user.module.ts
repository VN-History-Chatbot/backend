import { Module } from "@nestjs/common";

import { DbService } from "src/infrastructure/database/db.service";
import { UserRepository } from "src/infrastructure/repository/user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserRepository, DbService, UserService],
})
export class UserModule {}
