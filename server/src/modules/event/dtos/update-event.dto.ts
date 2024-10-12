import { enumValuesToString, isEnumValue } from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateEventDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  brief: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  status: DataStatus;

  @ApiProperty()
  @IsOptional()
  metadata: string;
}

export function toUpdateModel(
  dto: UpdateEventDto,
  createdBy: string,
): Prisma.EventUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  return {
    name: dto.name,
    brief: dto.brief,
    content: dto.content,
    location: dto.location,
    startDate: dto?.startDate ? new Date(dto?.startDate) : undefined,
    endDate: dto?.endDate ? new Date(dto?.endDate) : undefined,
    status: dto.status,
    metadata: dto?.metadata,
    updatedUser: {
      connect: {
        id: createdBy,
      },
    },
    updatedAt: new Date(),
  } as Prisma.EventUpdateInput;
}