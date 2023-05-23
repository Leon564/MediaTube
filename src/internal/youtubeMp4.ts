import { Mp4Response, Mp4Options, VideoSearchResult } from '../interfaces/types'
import youtubeScrap from './youtubeScrap'
import ytdl from 'ytdl-core'
import { randomId, validateFileName } from '../tools/utils'
import { createWriteStream } from 'fs'
import got from 'got'
class YoutubeMp4 {
  constructor (
    private options: Mp4Options,
    private VideoInfo: VideoSearchResult | null
  ) {
    if (!options.query) throw new Error('No query provided (can also be a url)')
  }

  static async get (options: Mp4Options) {
    const video = await youtubeScrap.searchVideo(options.query!)
    if (!video) throw new Error('No video found')
    return new YoutubeMp4(options, video)
  }

  async start (): Promise<Mp4Response> {
    const video = ytdl(this.VideoInfo?.id!, {
      quality: 'highest',
      filter: 'audioandvideo'
    })

    let path = ''

    if (this.options.filename) {
      path = await this.toFile(video, validateFileName(this.options.filename))
    }

    return {
      fileStream: video,
      videoUrl: this.VideoInfo?.url!,
      title: this.VideoInfo?.title!,
      thumbnail: this.VideoInfo?.thumbnail!,
      path: path === '' ? null : path
    }
  }

  private async toFile (stream: any, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      stream
        .pipe(createWriteStream(path))
        .on('finish', () => resolve(path))
        .on('error', (err: any) => reject(err))
    })
  }
}

export default YoutubeMp4
