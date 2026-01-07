import { model, Schema } from "mongoose";

import type { IAdmin, IChannel, IVideo } from "@/helpers/interfaces";

const reqString = { type: String, required: true } as const;

const reqNumber = { type: Number, required: true } as const;

export const withTimestamps = { timestamps: true } as const;

// Video
const videoSchema = new Schema<IVideo>(
  {
    code: { ...reqNumber, unique: true },
    fileId: reqString,
    thumbnailFileId: { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  withTimestamps,
);

export const Video = model<IVideo>("Video", videoSchema);

// Channel
const channelSchema = new Schema<IChannel>(
  {
    username: { ...reqString, unique: true },
    channelId: { ...reqNumber, unique: true },
    isActive: { type: Boolean, default: true },
  },
  withTimestamps,
);

export const Channel = model<IChannel>("Channel", channelSchema);

// Admin
const adminSchema = new Schema<IAdmin>(
  {
    telegramId: { ...reqNumber, unique: true },
    fullName: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  withTimestamps,
);

export const Admin = model<IAdmin>("Admin", adminSchema);
