import {
  Mp4Response,
  Mp4Options,
  VideoSearchResult,
} from "../interfaces/types";
import youtubeScrap from "./youtubeScrap";
import ytdl from "ytdl-core";
import { validateFileName } from "../tools/utils";
import { createWriteStream } from "fs";

class YoutubeMp4 {
  constructor(
    private options: Mp4Options,
    private VideoInfo: VideoSearchResult | null
  ) {
    if (!options.query)
      throw new Error("No query provided (can also be a url)");
  }

  static async get(options: Mp4Options) {
    const video = await youtubeScrap.findOneVideo({
      query: options.query!,
      limit: options.searchLimit || 600,
    });
    if (!video) throw new Error("No video found or is to long");
    return new YoutubeMp4(options, video);
  }

  async start(): Promise<Mp4Response> {
    const video = ytdl(this.VideoInfo?.id!, {
      quality: "highest",
      filter: "audioandvideo",
    });

    let path = "";
    
    if (this.options.path) {
      path = `${this.options.path}/${validateFileName(
        this.VideoInfo?.title!
      )}.mp4`;

      await this.toFile(video, path);
    }

    return {
      fileStream: video,
      videoUrl: this.VideoInfo?.url!,
      title: this.VideoInfo?.title!,
      thumbnail: this.VideoInfo?.thumbnail!,
      path: path === '' ? null : path
    };
  }

  private async toFile(stream: any, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => resolve(path))
        .on("error", (err: any) => reject(err));
    });
  }
}

export default YoutubeMp4;
