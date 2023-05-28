import { Client, MusicClient, MusicSongCompact } from 'youtubei'
import {validateURL, getURLVideoID} from "ytdl-core"
import {
  MusicSearchParams as ItemSearchParams,
  MusicSearchResult,
  VideoSearchResult
} from '../interfaces/types'

class YoutubeScrap {
  async searchMusic ({
    query,
    durationLimit
  }: ItemSearchParams): Promise<MusicSearchResult | null> {
    try {
      const music = new MusicClient()
      const data: any = await music.search(this.getVideoId(query)) //filtrar duration < 10min
      const results = data.find((obj: any) => obj.title === 'Songs') as any
      const song = await results.items.filter(
        (song: any) => song.duration <= durationLimit
      )[0] as MusicSongCompact
      const _thumbnail = song.thumbnails[song.thumbnails.length - 1].url
      const thumbnail = this.changeImageResolution(_thumbnail, 500, 500)
      console.log(song)
      return {
        title: song.title,
        artist: song.artists[0].name,
        thumbnail: thumbnail,
        id: song.id,
        album: song?.album?.title || 'Unknown',
        url: `music.youtube.com/watch?v=${song.id}`
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async searchVideo ({
    query,
    durationLimit
  }: ItemSearchParams): Promise<VideoSearchResult | null> {
    try {
      const youtube = new Client()
      const data: any = await youtube.search(this.getVideoId(query))
      //const results = data.find((obj: any) => obj.title === 'Songs') as any
      const filteredItem = data.items.filter(
        (item: any) => item.duration <= durationLimit
      )[0] as any

      //console.log(filteredItem)

      return {
        title: filteredItem.title,
        url: `https://youtu.be/${filteredItem.id}`,
        thumbnail: filteredItem.thumbnails[filteredItem.thumbnails.length - 1]
          .url as string,
        id: filteredItem.id as string,
        duration: filteredItem.duration as string,
        channel: filteredItem.channel.name as string,
        description: filteredItem.description as string,
        uploaded: filteredItem.uploadedAt as string,
        views: filteredItem.viewCount as string
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  private getVideoId (q: string): string {
    if (validateURL(q)) {
      return getURLVideoID(q)
    }
    return q
  }

  private changeImageResolution (
    url: string,
    width: number,
    height: number
  ): string {
    const regex = /(=w)\d+(-h)\d+/
    return url.replace(regex, `$1${width}$2${height}`)
  }

  async findOneVideo (query: string): Promise<VideoSearchResult | null> {
    try {
      const youtube = new Client()
      const resutl: any = await youtube.findOne(this.getVideoId(query))
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
