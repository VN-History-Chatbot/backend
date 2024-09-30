import { JwtService } from "@/core/jwt/jwt.service";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { UserRepository } from "@/infrastructure/repository/user.repository";
import {
  GOOGLE_LOGIN_URL,
  JWT_AT_EXPIRED,
  JWT_RT_EXPIRED,
} from "@/shared/constants/env.const";
import ApiResp from "@/shared/helpers/api.helper";
import { randomString } from "@/shared/helpers/str.helper";
import { Injectable } from "@nestjs/common";

import { get } from "lodash";

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _cache: CacheService,
    private readonly _userRep: UserRepository,
  ) {}

  async generateAdminToken() {
    const expAt = 60 * 60 * 24 * 60; // 60 days

    const token = await this._jwt.generateAccessToken(
      "admin",
      "admin",
      expAt,
      true,
    );

    await this._cache.set("admin-token", token, expAt);

    return ApiResp.Ok({ token });
  }

  async googleAuth() {
    const localToken = await this._jwt.generateLocalToken();

    const url = `${GOOGLE_LOGIN_URL}?token=${localToken}`;

    return ApiResp.Ok({
      localToken,
      url: url,
    });
  }

  async googleLogin(req: any) {
    const user = req.user;
    const localToken = req.query.state;

    if (!localToken) {
      return ApiResp.Unauthorized("Invalid state");
    }

    await this._cache.set(`local-token:${localToken}`, user, 60 * 60 * 30);

    return ApiResp.Ok(undefined, "Login success you can close this tab now");
  }

  async verifyLocalToken(token: string) {
    const user = await this._cache.get(`local-token:${token}`);

    if (!user) {
      return ApiResp.Unauthorized("Invalid token");
    }

    const email = get(user, "email");
    const name = get(user, "firstName");
    const picture = get(user, "picture");

    const u = await this._userRep.getUserByEmail(email);

    if (!u) {
      const created = await this._userRep.createUser({
        email: email,
        fullName: name,
        avatar: picture,
        isActive: true,
        lastAccess: new Date(),
        Role: {
          connect: {
            id: "999",
          },
        },
      });

      if (!created) {
        {
          return ApiResp.InternalServerError("Failed to create user");
        }
      }

      u.id = created.id;
    }
    const rtk = await this._jwt.generateRefreshToken();
    const sessionId = randomString(32);
    const atk = await this._jwt.generateAccessToken(
      u.id,
      sessionId,
      JWT_AT_EXPIRED * 60,
      false,
    );

    await this._cache.set(
      `refresh-token:${sessionId}`,
      rtk,
      JWT_RT_EXPIRED * 60,
    );

    const now = new Date().getTime();
    const atExpAt = now + JWT_AT_EXPIRED * 60 * 1000;
    const rtExpAt = now + JWT_RT_EXPIRED * 60 * 1000;
    return ApiResp.Ok({
      accessToken: atk,
      refreshToken: rtk,
      accessTokenExpiredAt: atExpAt,
      refreshTokenExpiredAt: rtExpAt,
    });
  }
}
