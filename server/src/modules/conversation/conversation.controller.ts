import { ChatReqDto } from "./dtos/chat.dto";
import { ProtectedGuard } from "@/shared/middlewares/protected.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";

import { ConversationService } from "./conversation.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ConversationCreate } from "./dtos/create.dto";
import { GenerateQuizReq } from "./dtos/gen-quiz.dto";

@ApiTags("Conversations")
@Controller("api/v1/conversations")
export class ConversationController {
  constructor(private readonly _service: ConversationService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async getConversations() {
    return await this._service.handleGetUserConversations();
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async getConversationById(@Param("id") id: string) {
    return await this._service.handleGetConversationById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createConversation(@Body() data: ConversationCreate) {
    return await this._service.handleCreateConversation(data);
  }

  @Post("chat")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async createMessage(@Body() data: ChatReqDto) {
    return await this._service.handleChat(data);
  }

  @Get("chat/:conversationId")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async getMessages(@Param("conversationId") conversationId: string) {
    return await this._service.handleGetConversationMessages(conversationId);
  }

  @Post("generate-quiz")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async generateQuiz(@Body() data: GenerateQuizReq) {
    return await this._service.handleGenerateQuiz(data);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async updateConversation(
    @Param("id") id: string,
    @Body() data: ConversationCreate,
  ) {
    return await this._service.handleUpdateConversation(id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(ProtectedGuard)
  async deleteConversation(@Param("id") id: string) {
    return await this._service.handleDeleteConversation(id);
  }
}
