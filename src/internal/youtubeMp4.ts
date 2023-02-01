import { Mp4Response, Mp4Options } from '../interfaces/types'
import youtubeScrap from './youtubeScrap'
import ytdl from 'ytdl-core'
import { randomId, validateFileName } from '../tools/utils'
import got from 'got'
import { createWriteStream } from 'fs'

class YoutubeMp4 {
  constructor (private options: Mp4Options, private VideoId: string) {
    if (!options.query) throw new Error('No query provided (can also be a url)')
  }

  static async get (options: Mp4Options) {
    const videoInfo = await youtubeScrap.getVideoInfo(options)
    return new YoutubeMp4(options, videoInfo.id)
  }

  async start (): Promise<Mp4Response> {
    const info = await ytdl.getInfo(this.VideoId)
    const format = ytdl.chooseFormat(info.formats, {
      filter: 'audioandvideo',
      quality: this.options.VideoQuality || 'highestvideo'
    })
    if (!format) throw new Error('No video found')

    const fileStream = got.stream(format.url)
    if (this.options.path) await this.tofile(fileStream)

    return {
      videoUrl: format.url,
      fileStream,
      videoId: this.VideoId,
      title: info.videoDetails.title
    }
  }

  private async tofile (stream: any) {
    const { path, filename } = this.options
    let outputFile = filename || randomId()
    outputFile = validateFileName(outputFile)
    outputFile += '.mp4'
    const writeStream = createWriteStream(`${path}/${outputFile}`)

    return new Promise((resolve, reject) => {
      stream.pipe(writeStream)
      let totalBytes = 0
      stream.on('end', () => {
        writeStream.close()
        return resolve(true)
      })
      stream.on('error', (err: any) => {
        writeStream.close()
        return reject(err)
      })
      stream.on('data', (chunk: any) => {
        totalBytes += chunk.length
        this.options.progress && this.options.progress(totalBytes)
      })
    })
  }
}

export default YoutubeMp4
