import { enumValuesToString, isEnumValue } from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma, TopicStatus } from "@prisma/client";
import { IsOptional } from "class-validator";

export class UpdateTopicDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  thumbnail: string;

  @ApiProperty()
  @IsOptional()
  status: DataStatus;

  @ApiProperty()
  @IsOptional()
  metadata: string;

  @ApiProperty()
  @IsOptional()
  eraIds: string[];

  @ApiProperty()
  @IsOptional()
  eventIds: string[];
}

export function toUpdateModel(
  dto: UpdateTopicDto,
  createdBy: string,
): Prisma.TopicUpdateInput {
  if (dto?.status && !isEnumValue(TopicStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(TopicStatus)}`,
    );
  }

  return {
    name: dto.name,
    description: dto.description,
    thumbnail: dto.thumbnail,
    status: dto.status,
    metadata: dto?.metadata,
    updatedUser: {
      connect: {
        id: createdBy,
      },
    },
    updatedAt: new Date(),
    eras:
      dto.eraIds && dto.eraIds.length > 0
        ? {
            connect: dto.eraIds.map((id) => ({ id })),
          }
        : undefined,
    events:
      dto.eventIds && dto.eventIds.length > 0
        ? {
            set: dto.eventIds.map((id) => ({ id })),
          }
        : {
            set: [],
          },
  } as Prisma.TopicUpdateInput;
}
