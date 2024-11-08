import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";

@Injectable()
export class EraRepository {
  constructor(private dbCtx: DbService) {}

  async findEras(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.EraUpdateInput,
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
    } satisfies Prisma.EraFindManyArgs;

    const [eras, total] = await this.dbCtx.$transaction([
      this.dbCtx.era.findMany(query),
      this.dbCtx.era.count({ where: query.where }),
    ]);

    return {
      data: eras,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findEraById(id: Prisma.EraWhereUniqueInput) {
    return this.dbCtx.era.findFirst({
      where: id,
      include: {
        topics: true,
        artifacts: true,
        events: true,
        figures: true,
        places: true,
      },
    });
  }

  async createEra(data: Prisma.EraCreateInput) {
    return this.dbCtx.era.create({ data });
  }

  async updateEraById(
    id: Prisma.EraWhereUniqueInput,
    data: Prisma.EraUpdateInput,
  ) {
    return this.dbCtx.era.update({ where: id, data });
  }

  async deleteEraById(id: Prisma.EraWhereUniqueInput) {
    return this.dbCtx.era.update({
      where: id,
      data: { status: DataStatus.DELETED },
    });
  }
}
