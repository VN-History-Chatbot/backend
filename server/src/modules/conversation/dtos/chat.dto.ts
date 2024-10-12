import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsOptional } from "class-validator";
export class ChatReqDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  conversationId: string;

  @ApiProperty()
  @IsOptional()
  metadata?: string;
}
