import { enumValuesToString, isEnumValue } from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateFigureDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  biography: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  deathDate: Date;

  @ApiProperty()
  @IsOptional()
  thumbnail: string;

  @ApiProperty()
  @IsOptional()
  status: DataStatus;

  @ApiProperty()
  @IsOptional()
  metadata: string;
}

export function toUpdateModel(
  dto: UpdateFigureDto,
  createdBy: string,
): Prisma.FigureUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  return {
    name: dto.name,
    biography: dto.biography,
    birthDate: dto?.deathDate ? new Date(dto?.deathDate) : undefined,
    deathDate: dto?.deathDate ? new Date(dto?.deathDate) : undefined,
    thumbnail: dto?.thumbnail,
    status: dto.status,
    metadata: dto?.metadata,
    updatedUser: {
      connect: {
        id: createdBy,
      },
    },
    updatedAt: new Date(),
  } as Prisma.FigureUpdateInput;
}
