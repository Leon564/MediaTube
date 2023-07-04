import { tmpdir } from 'os'
import { checkAndAddMP3, randomId } from '../tools/utils'
import {
  readFileSync,
  unlinkSync,
  renameSync
} from 'fs'
import {
  Mp3Response,
  Mp3Options
} from '../interfaces/types'
import youtubeScrap from './youtubeScrap'
import Jimp from 'jimp'
import Ffmpeg from 'fluent-ffmpeg'
import readline from 'readline'
import ytdl from 'ytdl-core'
import sanitize from 'sanitize-filename'

class YoutubeMp3 {
  constructor (private options: Mp3Options) {}

  static async get (options: Mp3Options) {
    return new YoutubeMp3(options)
  }

  async start (): Promise<Mp3Response> {
    if (!this.options.query)
      throw new Error('No query provided (can also be a url)')

    let song: any = null

    song = await youtubeScrap.searchMusic({
      query: this.options.query,
      durationLimit: this.options.durationLimit || 600
    })

    if (!song) {
      song = await youtubeScrap.searchVideo({
        query: this.options.query,
        durationLimit: this.options.durationLimit || 600
      })
    }
    
    let filename = this.options.filename
      ? checkAndAddMP3(this.options.filename)
      : `${tmpdir}/${sanitize(song?.title!)}.mp3`

    const video = ytdl(song?.id!, {
      quality: 'highestaudio',
      filter: 'audioonly'
    })
    const file = await this.download({
      artist: song?.artist || 'Unknown',
      audioBitRate: this.options.audioBitRate || '160',
      path: filename!,
      title: sanitize(song?.title.replace(':', '-')),
      video: video
    })

    if (this.options.cover) {
      await this.addPictureToMP3({
        mp3FilePath: file,
        outputFilePath: filename!,
        pictureFilePath: song.thumbnail
      })
    }
    if (!this.options.filename) {
      const buffer = readFileSync(file)
      unlinkSync(file)
      return {
        file: buffer,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail
      }
    }

    return {
      file,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail
    }
  }

  private async processImage (picture: string) {
    const pictureImage = await Jimp.read(picture)

    const squareSize =
      Math.min(pictureImage.getWidth(), pictureImage.getHeight()) / 1.35
    const x = (pictureImage.getWidth() - squareSize) / 2
    const y = (pictureImage.getHeight() - squareSize) / 2
    pictureImage.crop(x, y, squareSize, squareSize)

    const processedPicturePath = `${tmpdir}/thumb-${randomId()}.jpg`
    await pictureImage.writeAsync(processedPicturePath)

    return {
      processedPicturePath,
      delete: () => {
        unlinkSync(processedPicturePath)
      }
    }
  }

  private async addPictureToMP3 ({
    mp3FilePath,
    pictureFilePath,
    outputFilePath
  }: {
    mp3FilePath: string
    pictureFilePath: string
    outputFilePath: string
  }) {
    try {
      let thumbnail = await this.processImage(pictureFilePath)

      let newFileName = mp3FilePath + Date.now() + '.bak'
      renameSync(mp3FilePath, newFileName)
      return new Promise((resolve, reject) => {
        Ffmpeg()
          .input(newFileName)
          .input(thumbnail.processedPicturePath)
          .outputOptions(
            '-map',
            '0',
            '-map',
            '1',
            '-c',
            'copy',
            '-id3v2_version',
            '3',
            '-metadata',
            'comment="Cover (front)"'
          )
          .output(outputFilePath)
          .on('end', () => {
            //console.log('Picture added successfully!')
            // Eliminar el archivo de imagen procesada
            thumbnail.delete()
            unlinkSync(newFileName)
            resolve(mp3FilePath)
          })
          .on('error', err => {
            console.error('Error adding picture:', err)
            thumbnail.delete()
            renameSync(newFileName, mp3FilePath)
            reject(err)
          })
          .run()
      })
    } catch (error) {
      console.error('Error processing picture:', error)
    }
  }

  private async download ({
    audioBitRate,
    path,
    title,
    artist,
    video
  }: {
    audioBitRate: string
    artist: string
    video: any
    path: string
    title: string
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!artist) {
        artist = 'Unknown'
        if (title.indexOf('-') > -1) {
          let temp = title.split('-')
          if (temp.length >= 2) {
            artist = temp[0].trim()
            title = temp[1].trim()
          }
        } else {
          title = title
        }
      }

      const outputOptions = [
        '-id3v2_version',
        '4',
        '-metadata',
        `title=${title}`,
        '-metadata',
        `artist=${artist}`
      ]

      Ffmpeg(video)
        .audioBitrate(audioBitRate)
        .outputOptions(...outputOptions)
        .toFormat('mp3')
        .audioCodec('libmp3lame')
        .save(path)
        .on('progress', p => {
          readline.cursorTo(process.stdout, 0)
          process.stdout.write(
            `${title} ${p.targetSize}kb downloaded, ${p.timemark}ms elapsed`
          )
        })
        .on('end', () => {
          //console.log('\nDone')
          resolve(path)
        })
    })
  }
}

export default YoutubeMp3
