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
import { GenerateQuizReq } from "./dtos/gen-quiz.dto";
import { ArtifactRepository } from "@/infrastructure/repository/artifact.repository";
import { FigureRepository } from "@/infrastructure/repository/figure.repository";
import { PlaceRepository } from "@/infrastructure/repository/place.repository";
import { TopicRepository } from "@/infrastructure/repository/topic.repository";
import { EventRepository } from "@/infrastructure/repository/event.repository";
import { HistoryRepository } from "@/infrastructure/repository/history.repository";

@Injectable()
export class ConversationService {
  constructor(
    @Inject(REQUEST) private readonly httpReq: Request,
    private readonly _logger: LoggerService,
    private readonly _cache: CacheService,
    private readonly _repo: ConversationRepository,
    private readonly _topicRepo: TopicRepository,
    private readonly _artifactRepo: ArtifactRepository,
    private readonly _figureRepo: FigureRepository,
    private readonly _placeRepo: PlaceRepository,
    private readonly _eventRepo: EventRepository,
    private readonly _geminiService: GeminiService,
    private readonly _historyRepo: HistoryRepository,
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

    // search
    const embeddedPromptResp = await this._geminiService.embedText(
      data.message,
    );

    const vectorResult = await this._historyRepo.vectorSearchData(
      embeddedPromptResp.values,
      5,
    );

    const metadata = {
      isBot: true,
    };

    if (vectorResult.length > 0) {
      for (const item of vectorResult) {
        const [type, id] = item.target.split("-");
        if (metadata[type]) {
          metadata[type].push(id);
        } else {
          metadata[type] = [id];
        }
      }
    }

    // combine metadata

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
        metadata: JSON.stringify(metadata),
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

  async handleGenerateQuiz(data: GenerateQuizReq) {
    this._logger.log("[GenerateQuiz]");

    const LIMIT = 20;

    let basedContent = ``;

    if (data.topic) {
      const topic = await this._topicRepo.findTopicById({ id: data.topic });
      if (!topic) {
        return ApiResp.NotFound("Topic not found");
      }

      basedContent += `Chủ đề về ${topic.name}. ${topic.description}. `;
    }

    if (data.artifact) {
      const artifact = await this._artifactRepo.findArtifactById({
        id: data.artifact,
      });
      if (!artifact) {
        return ApiResp.NotFound("Artifact not found");
      }

      basedContent += `Vật phẩm ${artifact.name}. ${artifact.description}. `;
    }

    if (data.figure) {
      const figure = await this._figureRepo.findFigureById({ id: data.figure });
      if (!figure) {
        return ApiResp.NotFound("Figure not found");
      }

      basedContent += `Nhân vật ${figure.name}. ${figure.biography}. `;
    }

    if (data.place) {
      const place = await this._placeRepo.findPlaceById({
        id: data.place,
      });
      if (!place) {
        return ApiResp.NotFound("Place not found");
      }

      basedContent += `Địa điểm ${place.name}. ${place.description}. `;
    }

    if (data.event) {
      const event = await this._eventRepo.findEventById({
        id: data.event,
      });
      if (!event) {
        return ApiResp.NotFound("Event not found");
      }

      basedContent += `Sự kiện ${event.name}. ${event.content.slice(500)}. `;
    }

    const prompt = `Tạo cho tôi ${data.limit ? data.limit : LIMIT} câu hỏi về lịch sử Việt Nam. ${basedContent ? `Dựa trên các thông tin sau: ${basedContent}` : ""}
      Using this JSON schema:
      Quiz = {'question': string, 'options': [string], 'answers': [string]}
      Return: Array<Quiz>
    `;

    this._logger.log(`[GenerateQuiz] prompt: ${prompt}`);

    const promptResp = await this._geminiService.generateText(prompt);

    this._logger.log(
      `[Chat] Generated response: ${JSON.stringify(promptResp.response.candidates)}`,
    );

    const message = promptResp.response.text();

    // get message between ``` and ```
    let jsonData = message.split("```")[1];
    // remove json prefix
    if (jsonData.startsWith("json\n")) {
      jsonData = jsonData.substring(5);
    }

    // parse json data
    const resp = JSON.parse(jsonData);

    return ApiResp.Ok({
      data: resp,
    });
  }
}
