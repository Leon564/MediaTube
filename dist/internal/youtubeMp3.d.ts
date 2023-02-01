import { Mp3Response, Mp3Options } from '../interfaces/types';
declare class YoutubeMp3 {
    private options;
    constructor(options: Mp3Options);
    static get(options: Mp3Options): Promise<YoutubeMp3>;
    start(): Promise<Mp3Response>;
}
export default YoutubeMp3;
