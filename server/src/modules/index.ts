import { PingModule } from "./ping/ping.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./event/event.module";
import { ConversationModule } from "./conversation/conversation.module";

export const modules = [
  PingModule,
  EventModule,
  UserModule,
  AuthModule,
  ConversationModule,
];
