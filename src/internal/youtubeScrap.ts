import { Client, MusicClient, MusicSongCompact } from "youtubei";
import ytdl, { validateURL, getURLVideoID } from "ytdl-core";
import {
  MusicSearchParams as ItemSearchParams,
  MusicSearchResult,
  VideoSearchResult,
} from "../interfaces/types";
import { writeFileSync } from "fs";

export interface Options {
  query: string;
  limit?: number;
}

class YoutubeScrap { 
  private getVideoId(q: string): string {
    if (validateURL(q)) {
      return getURLVideoID(q);
    }
    return q;
  }

  private changeImageResolution(
    url: string,
    width: number,
    height: number
  ): string {
    const regex = /(=w)\d+(-h)\d+/;
    return url.replace(regex, `$1${width}$2${height}`);
  }

  async findOneVideo({
    limit,
    query,
  }: {
    limit: number;
    query: string;
  }): Promise<VideoSearchResult | null> {
    try {
      const youtube = new Client();
      const result: any =
        this.getVideoId(query) !== query
          ? await youtube.getVideo(this.getVideoId(query))
          : await youtube.findOne(this.getVideoId(query), {
              type: "video",
            });

      if (result.duration > limit) return null;

      const thumbnail = result?.thumbnails[result.thumbnails.length - 1].url;

      return {
        title: result.title,
        url: `https://youtu.be/${result.id}`,
        thumbnail: thumbnail as string,
        resizedThumbnail: this.changeImageResolution(
          thumbnail,
          500,
          500
        ) as string,
        id: result.id as string,
        duration: result.duration as string,
        channel: result.channel.name as string,
        description: result.description as string,
        uploaded: result.uploadedAt as string,
        views: result.viewCount as string,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new YoutubeScrap();
