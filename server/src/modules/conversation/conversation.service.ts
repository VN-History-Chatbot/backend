import { GeminiService } from "@/core/gemini/gemini.service";
import { Payload } from "@/core/jwt/payload";
import { get } from "lodash";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { LoggerService } from "@/core/log/log.service";
import { Injectable, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ConversationRepository } from "@/infrastructure/repository/conversation.repository";
import { ConversationCreate } from "./dtos/create.dto";
import ApiResp from "@/shared/helpers/api.helper";
import { ChatReqDto } from "./dtos/chat.dto";
import { BOT_USER_ID } from "@/shared/constants/user.const";

@Injectable()
export class ConversationService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _repo: ConversationRepository,
    private readonly _geminiService: GeminiService,
  ) {
    this._logger.setContext("ConversationServices");
  }

  async handleGetUserConversations() {
    // Get user payload from request
    const payload = get(this.httpReq, "user") as Payload;

    if (!payload) {
      this._logger.error("[GetProfile] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const conversations = await this._repo.getConversationByUserId(payload.sub);

    return ApiResp.Ok({
      conversations,
    });
  }

  async handleGetConversationById(id: string) {
    this._logger.log("[GetConversationById]");

    const conversation = await this._repo.findConversationById({ id });

    if (!conversation) {
      return ApiResp.NotFound("Conversation not found");
    }

    return ApiResp.Ok(conversation);
  }

  async handleCreateConversation(data: ConversationCreate) {
    this._logger.log("[CreateConversation]");

    const payload = get(this.httpReq, "user") as Payload;

    if (!payload) {
      this._logger.error("[CreateConversation] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const conversation = await this._repo.createConversation({
      name: data.name || "New Chat",
      thumbnail: data.thumbnail || "",
      createdUser: {
        connect: {
          id: payload.sub,
        },
      },
      updatedUser: {
        connect: {
          id: payload.sub,
        },
      },
    });

    return ApiResp.Ok({
      conversation,
    });
  }

  async handleChat(data: ChatReqDto) {
    this._logger.log("[Chat]");

    const payload = get(this.httpReq, "user") as Payload;

    if (!payload) {
      this._logger.error("[Chat] Payload is empty");

      return ApiResp.Unauthorized();
    }

    const conversation = await this._repo.findConversationById({
      id: data.conversationId,
    });

    if (!conversation) {
      return ApiResp.NotFound("Conversation not found");
    }

    const promptResp = await this._geminiService.generateText(data.message);

    this._logger.log(
      `[Chat] Generated response: ${JSON.stringify(promptResp.response.candidates)}`,
    );

    const message = promptResp.response.text();

    const result = await this._repo.createManyMessages([
      {
        content: data.message,
        conversationId: data.conversationId,
        metadata: data.metadata,
        createdBy: payload.sub,
        updatedBy: payload.sub,
      },
      {
        content: message,
        conversationId: data.conversationId,
        metadata: `{ "isBot": "true" }`,
        createdBy: BOT_USER_ID,
        updatedBy: BOT_USER_ID,
      },
    ]);

    return ApiResp.Ok({
      message,
      result,
    });
  }

  async handleGetConversationMessages(conversationId: string) {
    this._logger.log("[GetConversationMessages]");

    const messages =
      await this._repo.getMessagesByConversationId(conversationId);

    return ApiResp.Ok({
      messages,
    });
  }
}
