import {
  enumValuesToString,
  isEnumValue,
  removeUndefinedFields,
} from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class FilterEventDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  brief: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  location: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  status: DataStatus;

  @ApiProperty({ required: false })
  eraId: string;
}

export function toFilterModel(dto: FilterEventDto): Prisma.EventUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  const model = {
    name: dto?.name,
    brief: dto?.brief,
    content: dto?.content,
    location: dto?.location,
    startDate: dto?.startDate ? new Date(dto?.startDate) : undefined,
    endDate: dto?.endDate ? new Date(dto?.endDate) : undefined,
    status: dto?.status,
    eras: dto?.eraId
      ? {
          some: { id: dto.eraId },
        }
      : undefined,
  };

  return removeUndefinedFields(model) as Prisma.EventUpdateInput;
}
