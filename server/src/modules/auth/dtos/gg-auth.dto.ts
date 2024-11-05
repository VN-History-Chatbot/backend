import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GgAuthReqDto {
  @ApiProperty()
  @IsOptional()
  redirect?: string;
}

export class FirebaseAuthReqDto {
  @ApiProperty()
  token: string;
}
