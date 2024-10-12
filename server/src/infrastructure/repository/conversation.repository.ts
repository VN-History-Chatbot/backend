import { Injectable } from "@nestjs/common";
import { DbService } from "../database/db.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ConversationRepository {
  constructor(private dbCtx: DbService) {}

  async findConversationById(id: Prisma.ConversationWhereUniqueInput) {
    return this.dbCtx.conversation.findFirst({
      where: id,
      include: {
        createdUser: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getListConversations() {
    return this.dbCtx.conversation.findMany();
  }

  async getConversationByUserId(userId: string) {
    return this.dbCtx.conversation.findMany({
      where: {
        createdBy: userId,
      },
    });
  }

  async createConversation(data: Prisma.ConversationCreateInput) {
    return this.dbCtx.conversation.create({ data });
  }

  async updateConversation(
    id: Prisma.ConversationWhereUniqueInput,
    data: Prisma.ConversationUpdateInput,
  ) {
    return this.dbCtx.conversation.update({ where: id, data });
  }

  async createNewMessage(data: Prisma.MessageCreateInput) {
    return this.dbCtx.message.create({ data });
  }

  async createManyMessages(data: Prisma.MessageCreateManyInput[]) {
    return this.dbCtx.message.createMany({
      data: data,
      skipDuplicates: true,
    });
  }

  async getMessagesByConversationId(conversationId: string) {
    return this.dbCtx.message.findMany({
      where: {
        conversationId,
      },
    });
  }
}
