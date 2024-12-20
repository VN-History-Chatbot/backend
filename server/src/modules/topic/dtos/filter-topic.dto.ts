import {
  enumValuesToString,
  isEnumValue,
  removeUndefinedFields,
} from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma, TopicStatus } from "@prisma/client";

export class FilterTopicDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  thumbnail: string;

  @ApiProperty({ required: false })
  status: DataStatus;

  @ApiProperty({ required: false })
  eraId: string;

  @ApiProperty({ required: false })
  eventId: string;
}

export function toFilterModel(dto: FilterTopicDto): Prisma.TopicUpdateInput {
  if (dto?.status && !isEnumValue(TopicStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(TopicStatus)}`,
    );
  }

  const model = {
    name: dto?.name,
    description: dto?.description,
    thumbnail: dto?.thumbnail,
    status: dto?.status,
    eras: dto?.eraId
      ? {
          some: { id: dto.eraId },
        }
      : undefined,
    events: dto?.eventId
      ? {
          some: { id: dto.eventId },
        }
      : undefined,
  };

  return removeUndefinedFields(model) as Prisma.TopicUpdateInput;
}
