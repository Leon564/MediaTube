import { Mp3Options, Mp4Options } from '../interfaces/types';
import { Video } from 'scrape-yt';
declare class YoutubeScrap {
    search(options: Mp3Options | Mp4Options): Promise<Video[] | undefined>;
    getVideoInfo(options: Mp3Options | Mp4Options): Promise<Video>;
}
declare const _default: YoutubeScrap;
export default _default;
