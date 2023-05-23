import { Stream } from 'stream'


type Options = {
  durationLimit?: number
  searchLimit?: number
  audioBitRate?:string
  query?: string
  filename?: string
  ffmpegPath?: string
  cover? : Boolean
}


export type Mp3Options = Options & {
  AudioQuality?: 'highestaudio' | 'lowestaudio'
}

export type Mp4Options = Options & {
  VideoQuality?: 'highestvideo' | 'lowestvideo' 
  progress?: (progress: number) => void
}

type DataResponse = {
  videoId?: string
  title?:string
  thumbnail?: string
  artist?: string
  path?: string | null
  error?: any
}

export type Mp3Response = DataResponse & {
  file: Buffer | string
}

export type Mp4Response = DataResponse & {
  fileStream: Stream
  videoUrl: string
}

export type MusicSearchParams = {
  query: string
  durationLimit: number
}

export type MusicSearchResult = {
  title: string
  url: string
  thumbnail: string
  artist: string
  id: string
  album: string
}

export type VideoSearchResult = {
  title: string
  url: string
  thumbnail: string
  id: string
  duration: string
  views: string
  uploaded: string
  description: string
  channel:string
}