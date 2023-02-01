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
const scrape_yt_1 = __importDefault(require("scrape-yt"));
class YoutubeScrap {
    search(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchLimit, query = '' } = options;
            const scraping = yield scrape_yt_1.default.search(query, {
                type: 'video',
                limit: searchLimit || 10
            });
            return scraping;
        });
    }
    getVideoInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, searchLimit, durationLimit = 600, filename, path } = options;
            const scraping = yield scrape_yt_1.default.search(query, {
                type: 'video',
                limit: searchLimit || 10
            });
            const video = scraping.filter(vid => vid.duration < durationLimit)[0];
            if (path && !filename)
                options.filename = video.title;
            if (!video)
                throw new Error('No video found');
            return video;
        });
    }
}
exports.default = new YoutubeScrap();
