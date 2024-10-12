import { Module } from "@nestjs/common";

import { ArtifactController } from "./artifact.controller";
import { ArtifactService } from "./artifact.service";
import { RepositoryModule } from "@/infrastructure/repository/repository.module";

@Module({
  controllers: [ArtifactController],
  imports: [RepositoryModule],
  providers: [ArtifactService],
})
export class ArtifactModule {}
