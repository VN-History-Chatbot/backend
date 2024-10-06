import { Injectable } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class EventRepository {
  constructor(private dbCtx: DbService) {}

  async findEventById(id: Prisma.EventWhereUniqueInput) {
    return this.dbCtx.event.findFirst({ where: id });
  }

  async getListEvents() {
    return this.dbCtx.event.findMany();
  }

  async createEvent(data: Prisma.EventCreateInput) {
    return this.dbCtx.event.create({ data });
  }

  async updateEvent(
    id: Prisma.EventWhereUniqueInput,
    data: Prisma.EventUpdateInput,
  ) {
    return this.dbCtx.event.update({ where: id, data });
  }
}
