import { Module } from "@nestjs/common";

import { modules } from "./modules";
import { JwtModule } from "./core/jwt/jwt.service";
import { CacheModule } from "./infrastructure/cache/cache.service";
import { GoogleStrategy } from "./core/oauth/google.strategy";

@Module({
  imports: [...modules, JwtModule, CacheModule],
  providers: [GoogleStrategy],
})
export class AppModule {}
