import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreatePlaceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
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

export function toModel(
  dto: CreatePlaceDto,
  createdBy: string,
): Prisma.PlaceCreateInput {
  return {
    name: dto.name,
    description: dto.description,
    location: dto.location,
    thumbnail: dto.thumbnail,
    status: dto.status,
    metadata: dto?.metadata,
    createdUser: {
      connect: {
        id: createdBy,
      },
    },
    updatedUser: {
      connect: {
        id: createdBy,
      },
    },
    createdAt: new Date(),
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
            connect: dto.eventIds.map((id) => ({ id })),
          }
        : undefined,
  } as Prisma.PlaceCreateInput;
}
