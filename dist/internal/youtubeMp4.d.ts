import { Mp4Response, Mp4Options } from '../interfaces/types';
declare class YoutubeMp4 {
    private options;
    private VideoId;
    constructor(options: Mp4Options, VideoId: string);
    static get(options: Mp4Options): Promise<YoutubeMp4>;
    start(): Promise<Mp4Response>;
    private tofile;
}
export default YoutubeMp4;
