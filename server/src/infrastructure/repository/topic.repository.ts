import { SortOrder } from "@/shared/enums/sort-order.enum";
import { filterObjectToPrismaWhere } from "@/shared/helpers/prisma.helper";
import { Injectable } from "@nestjs/common";
import { Prisma, TopicStatus } from "@prisma/client";
import { DbService } from "../database/db.service";
import { isArray } from "lodash";

@Injectable()
export class TopicRepository {
  constructor(private dbCtx: DbService) {}

  async findTopics(
    page: number = 1,
    pageSize: number = 10,
    filter: Prisma.TopicUpdateInput,
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
    } satisfies Prisma.TopicFindManyArgs;

    const [topics, total] = await this.dbCtx.$transaction([
      this.dbCtx.topic.findMany(query),
      this.dbCtx.topic.count({ where: query.where }),
    ]);

    return {
      data: topics,
      currentPage: +page,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findTopicById(id: Prisma.TopicWhereUniqueInput) {
    return this.dbCtx.topic.findFirst({
      where: id,
      include: {
        eras: true,
        events: true,
      },
    });
  }

  async createTopic(data: Prisma.TopicCreateInput) {
    return this.dbCtx.topic.create({ data });
  }

  async updateTopicById(
    id: Prisma.TopicWhereUniqueInput,
    data: Prisma.TopicUpdateInput,
  ) {
    return this.dbCtx.topic.update({ where: id, data });
  }

  async deleteTopicById(id: Prisma.TopicWhereUniqueInput) {
    return this.dbCtx.topic.update({
      where: id,
      data: { status: TopicStatus.DISABLED },
    });
  }
}
