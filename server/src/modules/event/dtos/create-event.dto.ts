import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

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
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  status: DataStatus;

  @ApiProperty()
  @IsOptional()
  metadata: string;

  @ApiProperty()
  @IsOptional()
  eraId: string;
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
    startDate: dto?.startDate ? new Date(dto?.startDate) : undefined,
    endDate: dto?.endDate ? new Date(dto?.endDate) : undefined,
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
    eras: dto.eraId
      ? {
          connect: { id: dto.eraId },
        }
      : undefined,
  } as Prisma.EventCreateInput;
}
