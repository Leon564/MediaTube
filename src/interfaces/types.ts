import { Stream } from 'stream'
import { IVideoTask } from 'youtube-mp3-downloader'

type Options = {
  durationLimit?: number
  searchLimit?: number
  query: string
  path?: string
  filename?: string
  ffmpegPath?: string
}

export type Mp3Options = Options & {
  AudioQuality?: 'highestaudio' | 'lowestaudio'
  progress?: (progress: IVideoTask) => void
}

export type Mp4Options = Options & {
  VideoQuality?: 'highestvideo' | 'lowestvideo' 
  progress?: (progress: number) => void
}

type DataResponse = {
  videoId?: string
  title?:string
  path?: string
  error?: any
}

export type Mp3Response = DataResponse & {
  fileBuffer: Buffer
}

export type Mp4Response = DataResponse & {
  fileStream: Stream
  videoUrl: string
}
