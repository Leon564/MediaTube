import { Client, MusicClient, MusicSongCompact } from 'youtubei'
import {
  MusicSearchParams,
  MusicSearchResult,
  VideoSearchResult
} from '../interfaces/types'

class YoutubeScrap {
  async searchMusic ({
    query,
    durationLimit
  }: MusicSearchParams): Promise<MusicSearchResult | null> {
    try {
      const music = new MusicClient()
      const data: any = await music.search(query) //filtrar duration < 10min
      const results = data.find((obj: any) => obj.title === 'Songs') as any
      const song = results.items.filter(
        (song: any) => song.duration < durationLimit
      )[0] as MusicSongCompact
      //console.log(song)
      const _thumbnail = song.thumbnails[song.thumbnails.length - 1].url
      const thumbnail = this.changeImageResolution(_thumbnail, 500, 500)
      return {
        title: song.title,
        artist: song.artists[0].name,
        thumbnail: thumbnail,
        id: song.id,
        album: song.album.title,
        url: `music.youtube.com/watch?v=${song.id}`
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  private changeImageResolution (
    url: string,
    width: number,
    height: number
  ): string {
    const regex = /(=w)\d+(-h)\d+/
    return url.replace(regex, `$1${width}$2${height}`)
  }

  async searchVideo (query: string): Promise<VideoSearchResult | null> {
    try {
      const youtube = new Client()
      const resutl: any = await youtube.findOne(query)
      return {
        title: resutl.title,
        url: `https://youtu.be/${resutl.id}`,
        thumbnail: resutl.thumbnails[resutl.thumbnails.length - 1]
          .url as string,
        id: resutl.id as string,
        duration: resutl.duration as string,
        channel: resutl.channel.name as string,
        description: resutl.description as string,
        uploaded: resutl.uploadedAt as string,
        views: resutl.viewCount as string
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export default new YoutubeScrap()
