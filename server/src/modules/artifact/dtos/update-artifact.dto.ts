import { enumValuesToString, isEnumValue } from "@/shared/helpers/obj.helper";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsOptional } from "class-validator";

export class UpdateArtifactDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  locationFound: string;

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
  dto: UpdateArtifactDto,
  createdBy: string,
): Prisma.ArtifactUpdateInput {
  if (dto?.status && !isEnumValue(DataStatus, dto?.status)) {
    throw new BadRequestException(
      `${dto?.status} is not a valid status value. Valid values are ${enumValuesToString(DataStatus)}`,
    );
  }

  return {
    name: dto.name,
    description: dto.description,
    locationFound: dto.locationFound,
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
            set: dto.eraIds.map((id) => ({ id })),
          }
        : {
            set: [],
          },
    events:
      dto.eventIds && dto.eventIds.length > 0
        ? {
            set: dto.eventIds.map((id) => ({ id })),
          }
        : {
            set: [],
          },
  } as Prisma.ArtifactUpdateInput;
}
