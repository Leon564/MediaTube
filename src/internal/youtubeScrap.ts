import { Mp3Options, Mp4Options } from '../interfaces/types'
import scrape, { Video } from 'scrape-yt'

class YoutubeScrap {
  async search (options: Mp3Options | Mp4Options): Promise<Video[] | undefined> {
    const { searchLimit, query = '' } = options
    const scraping = await scrape.search(query, {
      type: 'video',
      limit: searchLimit || 10
    })
    return scraping
  }

  async getVideoInfo (options: Mp3Options | Mp4Options): Promise<Video> {
    const { query, searchLimit, durationLimit = 600, filename, path } = options
    const scraping = await scrape.search(query!, {
      type: 'video',
      limit: searchLimit || 10
    })
    const video = scraping.filter(vid => vid.duration! < durationLimit)[0]
    if (path && !filename) options.filename = video.title
    if (!video) throw new Error('No video found')
    return video
  }
}

export default new YoutubeScrap()
