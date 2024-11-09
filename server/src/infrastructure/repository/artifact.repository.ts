import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";
import { isArray } from "lodash";

@Injectable()
export class ArtifactRepository {
  constructor(private dbCtx: DbService) {}

  async findArtifacts(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.ArtifactUpdateInput,
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
    } satisfies Prisma.ArtifactFindManyArgs;

    const [artifacts, total] = await this.dbCtx.$transaction([
      this.dbCtx.artifact.findMany(query),
      this.dbCtx.artifact.count({ where: query.where }),
    ]);

    return {
      data: artifacts,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findArtifactById(id: Prisma.ArtifactWhereUniqueInput) {
    return this.dbCtx.artifact.findFirst({
      where: id,
      include: {
        eras: true,
        events: true,
      },
    });
  }

  async createArtifact(data: Prisma.ArtifactCreateInput) {
    return this.dbCtx.artifact.create({ data });
  }

  async updateArtifactById(
    id: Prisma.ArtifactWhereUniqueInput,
    data: Prisma.ArtifactUpdateInput,
  ) {
    return this.dbCtx.artifact.update({ where: id, data });
  }

  async deleteArtifactById(id: Prisma.ArtifactWhereUniqueInput) {
    return this.dbCtx.artifact.update({
      where: id,
      data: { status: DataStatus.DELETED },
    });
  }
}
