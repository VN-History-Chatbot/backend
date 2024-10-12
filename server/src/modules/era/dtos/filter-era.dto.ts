import {
  enumValuesToString,
  isEnumValue,
  removeUndefinedFields,
} from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class FilterEraDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  thumbnail: string;

  @ApiProperty({ required: false })
  status: DataStatus;
}

export function toFilterModel(dto: FilterEraDto): Prisma.EraUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  const model = {
    name: dto?.name,
    description: dto?.description,
    startDate: dto?.startDate ? new Date(dto?.startDate) : undefined,
    endDate: dto?.endDate ? new Date(dto?.endDate) : undefined,
    thumbnail: dto?.thumbnail,
    status: dto?.status,
  };

  return removeUndefinedFields(model) as Prisma.EraUpdateInput;
}
