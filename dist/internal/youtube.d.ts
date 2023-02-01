import { Mp3Response, Mp4Response, Mp3Options, Mp4Options } from '../interfaces/types';
declare class youtube {
    private options;
    constructor(options: Mp3Options | Mp4Options);
    static get(options: Mp3Options | Mp4Options): youtube;
    toMp4(): Promise<Mp4Response>;
    toMp3(): Promise<Mp3Response>;
}
export default youtube;
