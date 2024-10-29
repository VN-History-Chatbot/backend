import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max } from "class-validator";

export class GenerateQuizReq {
  @ApiProperty()
  @IsOptional()
  topic?: string;

  @ApiProperty()
  @IsOptional()
  event?: string;

  @ApiProperty()
  @IsOptional()
  artifact?: string;

  @ApiProperty()
  @IsOptional()
  figure?: string;

  @ApiProperty()
  @IsOptional()
  place?: string;

  @ApiProperty()
  @IsOptional()
  @Max(20)
  limit?: number;
}

export type GenerateQuizRes = {
  question: string;
  options: string[];
  answers: string[];
};
