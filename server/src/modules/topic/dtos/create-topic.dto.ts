import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateTopicDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

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
}

export function toModel(
  dto: CreateTopicDto,
  createdBy: string,
): Prisma.TopicCreateInput {
  return {
    name: dto.name,
    description: dto.description,
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
  } as Prisma.TopicCreateInput;
}
