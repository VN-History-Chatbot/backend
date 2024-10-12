import { ApiProperty } from "@nestjs/swagger";
import { DataStatus, Prisma } from "@prisma/client";
import { IsDateString, IsOptional } from "class-validator";

export class CreateFigureDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  biography: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsDateString()
  deathDate: Date;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  status: DataStatus;

  @ApiProperty()
  @IsOptional()
  metadata: string;
}

export function toModel(
  dto: CreateFigureDto,
  createdBy: string,
): Prisma.FigureCreateInput {
  return {
    name: dto.name,
    biography: dto.biography,
    birthDate: dto?.birthDate ? new Date(dto?.birthDate) : undefined,
    deathDate: dto?.deathDate ? new Date(dto?.deathDate) : undefined,
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
  } as Prisma.FigureCreateInput;
}
