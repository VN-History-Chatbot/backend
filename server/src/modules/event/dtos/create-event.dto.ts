import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsOptional } from "class-validator";

export class CreateEventDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  brief: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  startDate: number;

  @ApiProperty()
  endDate: number;

  @ApiProperty()
  @IsOptional()
  metadata: string;
}

export function toModel(
  dto: CreateEventDto,
  createdBy: string,
): Prisma.EventCreateInput {
  return {
    name: dto.name,
    brief: dto.brief,
    content: dto.content,
    location: dto.location,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    metadata: dto.metadata,
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
  } as Prisma.EventCreateInput;
}
