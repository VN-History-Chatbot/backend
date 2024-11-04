import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Max,
  Min,
  IsBoolean,
} from "class-validator";
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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Max(20)
  @Min(0)
  searchLimit?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  searchVector?: boolean;
}
