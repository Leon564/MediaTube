import {
  Mp3Response,
  Mp4Response,
  Mp3Options,
  Mp4Options,
  Ytmp3
} from '../interfaces/types'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import * as ffmpeg from 'fluent-ffmpeg'
import YoutubeMp4 from './youtubeMp4'
import YoutubeMp3 from './youtubeMp3'
import youtubeScrap from './youtubeScrap'
import { Video } from 'scrape-yt'

class youtube {
  constructor (private options: Mp3Options | Mp4Options) {
    ffmpeg.setFfmpegPath(options.ffmpegPath || ffmpegPath)
  }

  static get (options: Mp3Options | Mp4Options) {
    return new youtube(options)
  }

  async toMp4 (): Promise<Mp4Response> {
    const ytToMp4 = await YoutubeMp4.get(this.options as Mp4Options)
    return await ytToMp4.start()
  }

  async toMp3 (): Promise<Mp3Response> {
    const ytToMp3 = await YoutubeMp3.get(this.options as Mp3Options)
    return await ytToMp3.start()
  }

  async search (): Promise<Video> {
    return await youtubeScrap.getVideoInfo(this.options)
  }

  Mp3Downloader (): Ytmp3 {
    return new YoutubeMp3(this.options as Mp3Options).YoutubeMp3Downloader()
  }
}

export default youtube
