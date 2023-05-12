import ytmp3, { IVideoTask } from 'youtube-mp3-downloader'
import { tmpdir } from 'os'
import { checkAndAddMP3, randomId } from '../tools/utils'
import { rmSync, readFileSync, createWriteStream } from 'fs'
import { Mp3Response, Mp3Options } from '../interfaces/types'
import youtubeScrap from './youtubeScrap'

class YoutubeMp3 {
  constructor (private options: Mp3Options) {}

  static async get (options: Mp3Options) {
    return new YoutubeMp3(options)
  }

  async start (): Promise<Mp3Response> {
    if (!this.options.query)
      throw new Error('No query provided (can also be a url)')

    const {
      AudioQuality: quality = 'highestaudio',
      path,
      filename
    } = this.options
    const video = await youtubeScrap.getVideoInfo(this.options)
    this.options.filename = checkAndAddMP3(filename)
    let outputFile = filename || `${video.title}.mp3`
    if (!path) outputFile = `${randomId()}.mp3`
    const downloadOptions = {
      outputPath: path || tmpdir(),
      youtubeVideoQuality: quality,
      queueParallelism: 1,
      progressTimeout: 2000,
      allowWebm: false
    }

    return new Promise((resolve, reject) => {
      const YD = new ytmp3(downloadOptions)
      YD.on('error', (error: any) => {
        return reject({ error })
      })
      YD.on('finished', (err: any, data: any) => {
        if (err) reject(err)
        const { videoId, file } = data
        const fileBuffer = readFileSync(file)
        if (!path) rmSync(file)

        return resolve({
          fileBuffer,
          videoId,
          path: path ? file : undefined,
          title: video.title
        })
      })
      YD.on('progress', (progress: IVideoTask) => {
        this.options.progress && this.options.progress(progress)
        if (progress.progress.percentage > 100) {
          return reject({ error: 'Download failed' })
        }
      })
      YD.download(video.id, outputFile)
    })
  }

  YoutubeMp3Downloader (): ytmp3 {
    const {
      AudioQuality: quality = 'highestaudio',
      path
    } = this.options

    return new ytmp3({
      outputPath: path || './', // Output file location (default: the home directory)
      youtubeVideoQuality: quality, // Desired video quality (default: highestaudio)
      queueParallelism: 1, // Download parallelism (default: 1)
      progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
      allowWebm: false
    })
  }
}

export default YoutubeMp3
