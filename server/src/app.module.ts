import { Module } from "@nestjs/common";

import { modules } from "./modules";
import { JwtModule } from "./core/jwt/jwt.service";
import { CacheModule } from "./infrastructure/cache/cache.service";
import { GoogleStrategy } from "./core/oauth/google.strategy";
import { LoggerModule } from "./core/log/log.service";
import { GeminiModule } from "./core/gemini/gemini.service";

@Module({
  imports: [...modules, JwtModule, CacheModule, LoggerModule, GeminiModule],
  providers: [GoogleStrategy],
})
export class AppModule {}
