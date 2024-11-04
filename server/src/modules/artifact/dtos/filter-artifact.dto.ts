import {
  enumValuesToString,
  isEnumValue,
  removeUndefinedFields,
} from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";

export class FilterArtifactDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  locationFound: string;

  @ApiProperty({ required: false })
  thumbnail: string;

  @ApiProperty({ required: false })
  status: DataStatus;

  @ApiProperty({ required: false })
  eraId: string;

  @ApiProperty({ required: false })
  eventId: string;
}

export function toFilterModel(
  dto: FilterArtifactDto,
): Prisma.ArtifactUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  const model = {
    name: dto?.name,
    description: dto?.description,
    locationFound: dto?.locationFound,
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

  return removeUndefinedFields(model) as Prisma.ArtifactUpdateInput;
}
