import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
export class ConversationCreate {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty()
  @IsOptional()
  metadata?: string;
}
