import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";

@Injectable()
export class EventRepository {
  constructor(private dbCtx: DbService) {}

  async findEvents(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.EventUpdateInput,
    sortBy: string = "updatedAt",
    sortOrder: SortOrder = SortOrder.DESC,
  ) {
    const skip = (page - 1) * pageSize;

    // Transform filter object into Prisma where clause
    const where = filterObjectToPrismaWhere(filter);

    const query = {
      where,
      skip,
      take: +pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    } satisfies Prisma.EventFindManyArgs;

    const [events, total] = await this.dbCtx.$transaction([
      this.dbCtx.event.findMany(query),
      this.dbCtx.event.count({ where: query.where }),
    ]);

    return {
      data: events,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findEventById(id: Prisma.EventWhereUniqueInput) {
    return this.dbCtx.event.findFirst({ where: id });
  }

  async createEvent(data: Prisma.EventCreateInput) {
    return this.dbCtx.event.create({ data });
  }

  async updateEventById(
    id: Prisma.EventWhereUniqueInput,
    data: Prisma.EventUpdateInput,
  ) {
    return this.dbCtx.event.update({ where: id, data });
  }

  async deleteEventById(id: Prisma.EventWhereUniqueInput) {
    return this.dbCtx.event.update({
      where: id,
      data: { status: DataStatus.DELETED },
    });
  }
}
