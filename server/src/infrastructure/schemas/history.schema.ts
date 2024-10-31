import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HistoryDocument = HydratedDocument<History>;

@Schema()
export class History {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  target: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  embedding: number[];
}

export const HistorySchema = SchemaFactory.createForClass(History);
