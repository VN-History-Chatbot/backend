import { PingModule } from "./ping/ping.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./event/event.module";
import { FigureModule } from "./figure/figure.module";
import { PlaceModule } from "./place/place.module";

export const modules = [
  PingModule,
  EventModule,
  FigureModule,
  PlaceModule,
  UserModule,
  AuthModule,
];
