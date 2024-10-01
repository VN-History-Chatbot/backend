import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DbService } from "src/infrastructure/database/db.service";

@Injectable()
export class RoleRepository {
  constructor(private dbCtx: DbService) {}

  async findRoleById(id: Prisma.RoleWhereUniqueInput) {
    return this.dbCtx.role.findUnique({ where: id });
  }

  async getListRoles() {
    return this.dbCtx.role.findMany();
  }

  async createRole(data: Prisma.RoleCreateInput) {
    return this.dbCtx.role.create({ data });
  }

  async updateRole(
    id: Prisma.RoleWhereUniqueInput,
    data: Prisma.RoleUpdateInput,
  ) {
    return this.dbCtx.role.update({ where: id, data });
  }

  async getRoleByName(name: string) {
    return this.dbCtx.role.findFirst({ where: { name } });
  }

  async getRoleById(id: string) {
    return this.dbCtx.role.findFirst({ where: { id } });
  }
}
