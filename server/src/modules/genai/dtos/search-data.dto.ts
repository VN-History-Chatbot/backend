import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearchDataReq {
  @ApiProperty()
  @IsString()
  search: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit?: number;
}

export class SearchTarget {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  figure?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  event?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  place?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  era?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  artifact?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  topic?: string[];
}
