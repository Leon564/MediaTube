import {
  Mp3Response,
  Mp4Response,
  Mp3Options,
  Mp4Options,
} from "../interfaces/types";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import YoutubeMp4 from "./youtubeMp4";
import YoutubeMp3 from "./youtubeMp3";

interface DownloadOptions extends Mp3Options, Mp4Options {
  type?: "mp3" | "mp4";  
}

class youtube {
  constructor(private options: DownloadOptions) {
    ffmpeg.setFfmpegPath(options.ffmpegPath || ffmpegPath);
    if(!options.type) throw new Error("No download type provided, define {type: 'mp3' | 'mp4'}");
  }

  async download(    
    callback?: (response: Mp3Response | Mp4Response) => void
  ): Promise<Mp3Response | Mp4Response> {
    if (this.options.type === "mp3") {
      const ytToMp3 = await YoutubeMp3.get({
        cover: true,
        ...this.options,
        query: this.options.query,
        limit: this.options.limit,
      } as Mp3Options);
      const response = await ytToMp3.start();
      callback && callback(response);
      return response;
    } else if (this.options.type === "mp4") {
      const ytToMp4 = await YoutubeMp4.get({
        ...this.options,
        query: this.options.query,
        limit: this.options.limit,
      } as Mp4Options);
      const response = await ytToMp4.start();
      callback && callback(response);
      return response;
    } else {
      throw new Error("Invalid download type");
    }
  }
}

export default youtube;