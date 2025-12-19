import { model, Schema } from "mongoose";

const reqString = { type: String, required: true } as const;

const reqNumber = { type: Number, required: true } as const;

// Video
const videoSchema = new Schema({
  code: { ...reqNumber, unique: true },
  fileId: reqString,
  thumbnailFileId: { type: String, default: "" },
  caption: { type: String, default: "" },
});

export const Video = model("Video", videoSchema);

// Channel
const channelSchema = new Schema({
  username: { ...reqString, unique: true },
  channelId: { ...reqNumber, unique: true },
  isActive: { type: Boolean, default: true },
});

export const Channel = model("Channel", channelSchema);

// Admin
const adminSchema = new Schema(
  {
    telegramId: { ...reqNumber, unique: true },
    fullName: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Admin = model("Admin", adminSchema);
