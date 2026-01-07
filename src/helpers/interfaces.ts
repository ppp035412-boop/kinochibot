export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin extends ITimestamps {
  isActive: boolean;
  telegramId: number;
  fullName: string;
}

export interface IVideo extends ITimestamps {
  code: number;
  caption: string;
  fileId: string;
  thumbnailFileId: string;
}

export interface IChannel extends ITimestamps {
  username: string;
  channelId: number;
  isActive: boolean;
}
