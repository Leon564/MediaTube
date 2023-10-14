import { Stream } from "stream";

type Options = {
  limit?: number;
  searchLimit?: number;
  audioBitRate?: string;
  query?: string;
  path?: string;
  ffmpegPath?: string;
  cover?: Boolean;
  timeout?: number;
};

export type Mp3Options = Options & {
  AudioQuality?: "highestaudio" | "lowestaudio";
  OfficialAudio?: Boolean;
};

export type Mp4Options = Options & {
  VideoQuality?: "highestvideo" | "lowestvideo";
  progress?: (progress: number) => void;
};

type DataResponse = {
  videoId?: string;
  title?: string;
  thumbnail?: string;
  artist?: string;
  error?: any;
};

export type Mp3Response = DataResponse & {
  Buffer?: Buffer;
  file?: string;
};

export type Mp4Response = DataResponse & {
  fileStream: Stream;
  videoUrl: string;
  path?: string | null;
};

export type MusicSearchParams = {
  query: string;
  limit: number;
};

export type MusicSearchResult = {
  title: string;
  url: string;
  thumbnail: string;
  artist: string;
  id: string;
  album: string;
};

export type VideoSearchResult = {
  title: string;
  url: string;
  thumbnail: string;
  resizedThumbnail: string;
  id: string;
  duration: string;
  views: string;
  uploaded: string;
  description: string;
  channel: string;
};
