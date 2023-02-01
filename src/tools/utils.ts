import { randomBytes } from 'crypto'

export const randomId = () => randomBytes(16).toString('hex')

export const checkAndAddMP3 = (str: string | undefined): string | undefined => {
  if (str && !str.includes('.mp3')) {
    str += '.mp3'
  }
  return str
}

export const validateFileName = (fileName: string): string => {
  const invalidCharsRegex = /[\\/:*?"<>|]/g
  return fileName.replace(invalidCharsRegex, '')
}
