import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

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
