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
const youtube_mp3_downloader_1 = __importDefault(require("youtube-mp3-downloader"));
const os_1 = require("os");
const utils_1 = require("../tools/utils");
const fs_1 = require("fs");
const youtubeScrap_1 = __importDefault(require("./youtubeScrap"));
class YoutubeMp3 {
    constructor(options) {
        this.options = options;
        if (!options.query)
            throw new Error('No query provided (can also be a url)');
    }
    static get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new YoutubeMp3(options);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const { AudioQuality: quality = 'highestaudio', path, filename } = this.options;
            const video = yield youtubeScrap_1.default.getVideoInfo(this.options);
            this.options.filename = (0, utils_1.checkAndAddMP3)(filename);
            let outputFile = filename || `${video.title}.mp3`;
            if (!path)
                outputFile = `${(0, utils_1.randomId)()}.mp3`;
            const downloadOptions = {
                outputPath: path || (0, os_1.tmpdir)(),
                youtubeVideoQuality: quality,
                queueParallelism: 1,
                progressTimeout: 2000,
                allowWebm: false
            };
            return new Promise((resolve, reject) => {
                const YD = new youtube_mp3_downloader_1.default(downloadOptions);
                YD.on('error', (error) => {
                    return reject({ error });
                });
                YD.on('finished', (err, data) => {
                    if (err)
                        reject(err);
                    const { videoId, file } = data;
                    const fileBuffer = (0, fs_1.readFileSync)(file);
                    if (!path)
                        (0, fs_1.rmSync)(file);
                    return resolve({ fileBuffer, videoId, path: path ? file : undefined, title: video.title });
                });
                YD.on('progress', (progress) => {
                    this.options.progress && this.options.progress(progress);
                    if (progress.progress.percentage > 100) {
                        return reject({ error: 'Download failed' });
                    }
                });
                YD.download(video.id, outputFile);
            });
        });
    }
}
exports.default = YoutubeMp3;
