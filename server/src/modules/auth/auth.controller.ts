import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Request,
  Body,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { GoogleOAuthGuard } from "@/core/oauth/google.guard";
import { GetRefreshTokenDto } from "./dtos/refresh-token.dto";

@ApiTags("Auth")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Get("admin-token")
  async generateAdminToken() {
    return await this._service.handleGenerateAdminToken();
  }

  @Post("login-google")
  async loginGoogle() {
    return await this._service.handleGoogleAuth();
  }

  @Get("verify-token")
  async verifyToken(@Query("token") token: string) {
    return await this._service.handleVerifyLocalToken(token);
  }

  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    return await this._service.handleGoogleLogin(req);
  }

  @Post("refresh-token")
  async refreshToken(@Body() token: GetRefreshTokenDto) {
    return await this._service.handleRefreshToken(token);
  }

  @Post("force-logout")
  async forceLogout(@Query("userId") userId: string) {
    return await this._service.handleForceLogout(userId);
  }
}
