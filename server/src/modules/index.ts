import { PingModule } from "./ping/ping.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./event/event.module";
import { FigureModule } from "./figure/figure.module";
import { PlaceModule } from "./place/place.module";
import { ArtifactModule } from "./artifact/artifact.module";
import { EraModule } from "./era/era.module";
import { TopicModule } from "./topic/topic.module";
import { ConversationModule } from "./conversation/conversation.module";

export const modules = [
  PingModule,
  EventModule,
  FigureModule,
  PlaceModule,
  ArtifactModule,
  EraModule,
  TopicModule,
  UserModule,
  AuthModule,
  ConversationModule,
];
