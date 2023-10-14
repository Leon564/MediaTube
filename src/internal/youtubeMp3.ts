import { tmpdir } from "os";
import { checkAndAddMP3, randomId } from "../tools/utils";
import { readFileSync, unlinkSync, renameSync } from "fs";
import { Mp3Response, Mp3Options } from "../interfaces/types";
import youtubeScrap from "./youtubeScrap";
import Jimp from "jimp";
import Ffmpeg from "fluent-ffmpeg";
import readline from "readline";
import ytdl from "ytdl-core";
import sanitize from "sanitize-filename";
import validator from "validator";

class YoutubeMp3 {
  constructor(private options: Mp3Options) {
    this.options.OfficialAudio = this.options.OfficialAudio !== false;
  }

  static async get(options: Mp3Options) {
    return new YoutubeMp3(options);
  }

  async start(): Promise<Mp3Response> {
    if (!this.options.query)
      throw new Error("No query provided (can also be a url)");

    const query = validator.isURL(this.options.query)
      ? this.options.query
      : `${this.options.query}${
          this.options.OfficialAudio ? " (official audio)" : ""
        }`;

    const song = await youtubeScrap.findOneVideo({
      query,
      limit: this.options.limit || 600,
    });

    if (!song) throw new Error("No video found or is to long");

    let filename = this.options.path
      ? `${this.options.path}/${sanitize(song?.title!)}.mp3`
      : `${tmpdir}/${sanitize(song?.title!)}.mp3`;

    const video = ytdl(song?.id!, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    const chanel = (song?.channel || "Unknown")
      .replace(/vevo/i, "")
      .replace(/Official YouTube Channel/i, "");

    const file = await this.download({
      artist: chanel,
      audioBitRate: this.options.audioBitRate || "160",
      path: filename!,
      title: sanitize(song.title.replace(":", "-")),
      video: video,
      timeout: this.options.timeout || 60000,
    });

    if (this.options.cover) {
      await this.addPictureToMP3({
        mp3FilePath: file,
        outputFilePath: filename!,
        pictureFilePath: song.resizedThumbnail,
      });
    }
    if (!this.options.path) {
      const buffer = readFileSync(file);
      unlinkSync(file);
      return {
        Buffer: buffer,
        title: song.title,
        artist: chanel,
        thumbnail: song.thumbnail,
      };
    }

    return {
      file,
      title: song.title,
      artist: chanel,
      thumbnail: song.thumbnail,
    };
  }

  private async processImage(picture: string) {
    const pictureImage = await Jimp.read(picture);

    const squareSize =
      Math.min(pictureImage.getWidth(), pictureImage.getHeight()) / 1.35;
    const x = (pictureImage.getWidth() - squareSize) / 2;
    const y = (pictureImage.getHeight() - squareSize) / 2;
    pictureImage.crop(x, y, squareSize, squareSize);

    const processedPicturePath = `${tmpdir}/thumb-${randomId()}.jpg`;
    await pictureImage.writeAsync(processedPicturePath);

    return {
      processedPicturePath,
      delete: () => {
        unlinkSync(processedPicturePath);
      },
    };
  }

  private async addPictureToMP3({
    mp3FilePath,
    pictureFilePath,
    outputFilePath,
  }: {
    mp3FilePath: string;
    pictureFilePath: string;
    outputFilePath: string;
  }) {
    try {
      let thumbnail = await this.processImage(pictureFilePath);

      let newFileName = mp3FilePath + Date.now() + ".bak";
      renameSync(mp3FilePath, newFileName);
      return new Promise((resolve, reject) => {
        Ffmpeg()
          .input(newFileName)
          .input(thumbnail.processedPicturePath)
          .outputOptions(
            "-map",
            "0",
            "-map",
            "1",
            "-c",
            "copy",
            "-id3v2_version",
            "3",
            "-metadata",
            'comment="Cover (front)"'
          )
          .output(outputFilePath)
          .on("end", () => {
            //console.log('Picture added successfully!')
            // Eliminar el archivo de imagen procesada
            thumbnail.delete();
            unlinkSync(newFileName);
            resolve(mp3FilePath);
          })
          .on("error", (err) => {
            console.error("Error adding picture:", err);
            thumbnail.delete();
            renameSync(newFileName, mp3FilePath);
            reject(err);
          })
          .run();
      });
    } catch (error) {
      console.error("Error processing picture:", error);
    }
  }

  private async download({
    audioBitRate,
    path,
    title,
    artist,
    video,
    timeout = 60000,
  }: {
    audioBitRate: string;
    artist: string;
    video: any;
    path: string;
    title: string;
    timeout: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      let progressTimer: NodeJS.Timeout; // Especifica el tipo de la variable

      const resetProgressDetection = () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
        }
        progressTimer = setTimeout(() => {
          // Si no se detecta progreso, cancelar la operación
          reject("La descarga se ha cancelado debido a la falta de progreso.");
        }, timeout);
      };

      // Inicializar el temporizador de progreso
      resetProgressDetection();

      if (!artist) {
        artist = "Unknown";
        if (title.indexOf("-") > -1) {
          let temp = title.split("-");
          if (temp.length >= 2) {
            artist = temp[0].trim();
            title = temp[1].trim();
          }
        } else {
          title = title;
        }
      }

      const outputOptions = [
        "-id3v2_version",
        "4",
        "-metadata",
        `title=${title}`,
        "-metadata",
        `artist=${artist}`,
      ];

      Ffmpeg(video)
        .audioBitrate(audioBitRate)
        .outputOptions(...outputOptions)
        .toFormat("mp3")
        .audioCodec("libmp3lame")
        .save(path)
        .on("progress", (p) => {
          resetProgressDetection();
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(
            `${title} ${p.targetSize}kb downloaded, ${p.timemark}ms elapsed`
          );
        })
        .on("end", () => {
          clearTimeout(progressTimer);
          resolve(path);
        })
        .on("error", (err) => {
          clearTimeout(progressTimer);
          reject(err);
        });
    });
  }
}

export default YoutubeMp3;
