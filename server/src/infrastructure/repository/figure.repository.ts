import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";
import { isArray } from "lodash";

@Injectable()
export class FigureRepository {
  constructor(private dbCtx: DbService) {}

  async findFigures(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.FigureUpdateInput,
    sortBy: string = "updatedAt",
    sortOrder: SortOrder = SortOrder.DESC,
    ids?: string[],
  ) {
    const skip = (page - 1) * pageSize;

    // Transform filter object into Prisma where clause
    const where = filterObjectToPrismaWhere(filter);
    if (ids && ids.length > 0) {
      if (isArray(ids)) {
        where["id"] = {
          in: ids,
        };
      } else {
        where["id"] = ids;
      }
    }

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
      data: figures,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findFigureById(id: Prisma.FigureWhereUniqueInput) {
    return this.dbCtx.figure.findFirst({
      where: id,
      include: {
        eras: true,
        events: true,
      },
    });
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
    return this.dbCtx.figure.update({
      where: id,
      data: { status: DataStatus.DELETED },
    });
  }
}
