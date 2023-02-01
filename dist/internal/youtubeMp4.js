"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtubeScrap_1 = __importDefault(require("./youtubeScrap"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const utils_1 = require("../tools/utils");
const got_1 = __importDefault(require("got"));
const fs_1 = require("fs");
class YoutubeMp4 {
    constructor(options, VideoId) {
        this.options = options;
        this.VideoId = VideoId;
        if (!options.query)
            throw new Error('No query provided (can also be a url)');
    }
    static get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoInfo = yield youtubeScrap_1.default.getVideoInfo(options);
            return new YoutubeMp4(options, videoInfo.id);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield ytdl_core_1.default.getInfo(this.VideoId);
            const format = ytdl_core_1.default.chooseFormat(info.formats, {
                filter: 'audioandvideo',
                quality: this.options.VideoQuality || 'highestvideo'
            });
            if (!format)
                throw new Error('No video found');
            const fileStream = got_1.default.stream(format.url);
            if (this.options.path)
                yield this.tofile(fileStream);
            return {
                videoUrl: format.url,
                fileStream,
                videoId: this.VideoId,
                title: info.videoDetails.title
            };
        });
    }
    tofile(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, filename } = this.options;
            let outputFile = filename || (0, utils_1.randomId)();
            outputFile = (0, utils_1.validateFileName)(outputFile);
            outputFile += '.mp4';
            const writeStream = (0, fs_1.createWriteStream)(`${path}/${outputFile}`);
            return new Promise((resolve, reject) => {
                stream.pipe(writeStream);
                let totalBytes = 0;
                stream.on('end', () => {
                    writeStream.close();
                    return resolve(true);
                });
                stream.on('error', (err) => {
                    writeStream.close();
                    return reject(err);
                });
                stream.on('data', (chunk) => {
                    totalBytes += chunk.length;
                    this.options.progress && this.options.progress(totalBytes);
                });
            });
        });
    }
}
exports.default = YoutubeMp4;
