import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";

@Injectable()
export class FigureRepository {
  constructor(private dbCtx: DbService) {}

  async findFigures(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.FigureUpdateInput,
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
    } satisfies Prisma.FigureFindManyArgs;

    const [figures, total] = await this.dbCtx.$transaction([
      this.dbCtx.figure.findMany(query),
      this.dbCtx.figure.count({ where: query.where }),
    ]);

    return {
      figures: figures,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findFigureById(id: Prisma.FigureWhereUniqueInput) {
    return this.dbCtx.figure.findFirst({ where: id });
  }

  async createFigure(data: Prisma.FigureCreateInput) {
    return this.dbCtx.figure.create({ data });
  }

  async updateFigureById(
    id: Prisma.FigureWhereUniqueInput,
    data: Prisma.FigureUpdateInput,
  ) {
    return this.dbCtx.figure.update({ where: id, data });
  }

  async deleteFigureById(id: Prisma.FigureWhereUniqueInput) {
    return this.dbCtx.figure.delete({ where: id });
  }
}
