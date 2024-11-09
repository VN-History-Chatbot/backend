import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";
import { isArray } from "util";

@Injectable()
export class PlaceRepository {
  constructor(private dbCtx: DbService) {}

  async findPlaces(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.PlaceUpdateInput,
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
    } satisfies Prisma.PlaceFindManyArgs;

    const [places, total] = await this.dbCtx.$transaction([
      this.dbCtx.place.findMany(query),
      this.dbCtx.place.count({ where: query.where }),
    ]);

    return {
      data: places,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findPlaceById(id: Prisma.PlaceWhereUniqueInput) {
    return this.dbCtx.place.findFirst({
      where: id,
      include: {
        eras: true,
        events: true,
      },
    });
  }

  async createPlace(data: Prisma.PlaceCreateInput) {
    return this.dbCtx.place.create({ data });
  }

  async updatePlaceById(
    id: Prisma.PlaceWhereUniqueInput,
    data: Prisma.PlaceUpdateInput,
  ) {
    return this.dbCtx.place.update({ where: id, data });
  }

  async deletePlaceById(id: Prisma.PlaceWhereUniqueInput) {
    return this.dbCtx.place.update({
      where: id,
      data: { status: DataStatus.DELETED },
    });
  }
}
