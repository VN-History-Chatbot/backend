import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { DataStatus, Prisma } from "@prisma/client";
import { DbService } from "../database/db.service";

@Injectable()
export class ArtifactRepository {
  constructor(private dbCtx: DbService) {}

  async findArtifacts(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.ArtifactUpdateInput,
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
      include: {
        eras: true,
        events: true,
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
