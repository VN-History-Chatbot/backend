import {
  enumValuesToString,
  isEnumValue,
  removeUndefinedFields,
} from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class FilterFigureDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  biography: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deathDate: Date;

  @ApiProperty({ required: false })
  thumbnail: string;

  @ApiProperty({ required: false })
  status: DataStatus;

  @ApiProperty({ required: false })
  eraId: string;
}

export function toFilterModel(dto: FilterFigureDto): Prisma.FigureUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  const model = {
    name: dto?.name,
    biography: dto?.biography,
    birthDate: dto?.birthDate ? new Date(dto?.birthDate) : undefined,
    deathDate: dto?.deathDate ? new Date(dto?.deathDate) : undefined,
    thumbnail: dto?.thumbnail,
    status: dto?.status,
    eras: dto?.eraId
      ? {
          some: { id: dto.eraId },
        }
      : undefined,
  };

  return removeUndefinedFields(model) as Prisma.FigureUpdateInput;
}
