# MediaTube

[![npm version](https://img.shields.io/npm/v/mediatube.svg)](https://www.npmjs.com/package/mediatube)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Node.js library for downloading and converting YouTube videos/audio with support for MP3 and MP4, custom metadata, thumbnails, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Dependencies](#-dependencies)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🎵 **MP3 Audio Download** with automatic metadata (title, artist)
- 🎬 **MP4 Video Download** in high quality
- 🖼️ **Automatic thumbnails** with image processing
- 🔍 **Smart search** with support for URLs and text queries
- 📁 **In-memory download** or file saving
- 🍪 **Custom cookies support** to bypass restrictions
- ⚡ **Real-time progress** for downloads
- 🎛️ **Configurable audio/video quality**
- 🔧 **Integrated FFmpeg** for multimedia conversion
- 📊 **Configurable timeout** to prevent hanging downloads

## 📦 Installation

```bash
npm install mediatube
```

### System Requirements

- Node.js >= 14.x
- FFmpeg (automatically installed via `@ffmpeg-installer/ffmpeg`)

## 🚀 Basic Usage

### MP3 Audio Download

```typescript
import Youtube from 'mediatube';

// Basic MP3 download
const downloader = new Youtube({
  type: 'mp3',
  query: 'Imagine Dragons Believer',
  audioBitRate: '160',
  cover: true
});

const response = await downloader.download();
console.log('Download completed:', response.title);

// Save to specific file
const downloaderWithPath = new Youtube({
  type: 'mp3',
  query: 'https://youtu.be/7wtfhZwyrcc',
  path: './downloads',
  cover: true
});

const fileResponse = await downloaderWithPath.download();
console.log('File saved at:', fileResponse.file);
```

### MP4 Video Download

```typescript
import Youtube from 'mediatube';

const downloader = new Youtube({
  type: 'mp4',
  query: 'Awesome video tutorial',
  path: './videos',
  VideoQuality: 'highestvideo'
});

const response = await downloader.download();
console.log('Video downloaded:', response.title);
```

## 📚 API Reference

### Constructor Options

#### General Options
```typescript
type Options = {
  limit?: number;           // Duration limit in seconds (default: 600)
  searchLimit?: number;     // Search results limit
  audioBitRate?: string;    // Audio bitrate (default: "160")
  query?: string;          // Search query or YouTube URL
  path?: string;           // Path to save the file
  ffmpegPath?: string;     // Custom FFmpeg path
  cover?: Boolean;         // Add thumbnail as cover (MP3 only)
  timeout?: number;        // Timeout in ms (default: 60000)
  cookies?: ytdl.Cookie[]; // Custom cookies
};
```

#### MP3 Options
```typescript
type Mp3Options = Options & {
  AudioQuality?: "highestaudio" | "lowestaudio";  // Audio quality
  OfficialAudio?: Boolean;                        // Search for official version
};
```

#### MP4 Options
```typescript
type Mp4Options = Options & {
  VideoQuality?: "highestvideo" | "lowestvideo";  // Video quality
  progress?: (progress: number) => void;          // Progress callback
};
```

### Responses

#### Mp3Response
```typescript
type Mp3Response = {
  Buffer?: Buffer;      // File buffer (if no path specified)
  file?: string;        // Saved file path
  videoId?: string;     // YouTube video ID
  title?: string;       // Video title
  thumbnail?: string;   // Thumbnail URL
  artist?: string;      // Extracted artist
  error?: any;         // Error if any occurred
};
```

#### Mp4Response
```typescript
type Mp4Response = {
  fileStream: Stream;   // Video stream
  videoUrl: string;     // Original video URL
  path?: string | null; // Path where saved (if specified)
  videoId?: string;     // Video ID
  title?: string;       // Video title
  thumbnail?: string;   // Thumbnail URL
  artist?: string;      // Channel/artist
  error?: any;         // Error if any occurred
};
```

## 🔧 Advanced Examples

### Download with Custom Cookies

```typescript
import Youtube from 'mediatube';

const downloader = new Youtube({
  type: 'mp3',
  query: 'Restricted video URL',
  cookies: [
    { name: 'session_token', value: 'your_session_token' }
  ]
});

const response = await downloader.download();
```

### Download with Progress Callback

```typescript
import Youtube from 'mediatube';

const downloader = new Youtube({
  type: 'mp4',
  query: 'Long video',
  path: './downloads',
  progress: (percentage) => {
    console.log(`Progress: ${percentage}%`);
  }
});

const response = await downloader.download((res) => {
  console.log('Download completed:', res.title);
});
```

### In-Memory vs File Download

```typescript
// In-memory (returns Buffer)
const memoryDownloader = new Youtube({
  type: 'mp3',
  query: 'Song title'
  // Don't specify 'path'
});

const memoryResponse = await memoryDownloader.download();
console.log('Buffer size:', memoryResponse.Buffer?.length);

// To file
const fileDownloader = new Youtube({
  type: 'mp3',
  query: 'Song title',
  path: './music'
});

const fileResponse = await fileDownloader.download();
console.log('File saved at:', fileResponse.file);
```

### Search with Official Audio

```typescript
const downloader = new Youtube({
  type: 'mp3',
  query: 'Despacito',
  OfficialAudio: true,  // Will search for "Despacito (official audio)"
  cover: true
});
```

## 📋 Dependencies

### Production Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `@distube/ytdl-core` | ^4.16.12 | Core for YouTube downloading |
| `@ffmpeg-installer/ffmpeg` | ^1.1.0 | Automatic FFmpeg installer |
| `fluent-ffmpeg` | ^2.1.3 | Fluent API for FFmpeg |
| `jimp` | ^0.22.12 | Image processing |
| `progress-stream` | ^2.0.0 | Streams with progress |
| `sanitize-filename` | ^1.6.3 | Filename sanitization |
| `validator` | ^13.12.0 | URL validation |
| `youtubei` | ^1.5.4 | Unofficial YouTube API |

### Development Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `typescript` | ^5.5.4 | TypeScript compiler |
| `@types/node` | ^22.1.0 | Node.js types |
| `@types/fluent-ffmpeg` | ^2.1.25 | Types for fluent-ffmpeg |
| `ts-node` | ^10.9.2 | TypeScript runner |

## 🏗️ Project Structure

```
mediatube/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── interfaces/
│   │   └── types.ts               # TypeScript type definitions
│   ├── internal/
│   │   ├── youtube.ts             # Main Youtube class
│   │   ├── youtubeMp3.ts          # MP3 download handler
│   │   ├── youtubeMp4.ts          # MP4 download handler
│   │   ├── youtubeScrap.ts        # Scraping and search
│   │   └── libs/                  # Internal libraries (empty)
│   └── tools/
│       └── utils.ts               # General utilities
├── dist/                          # Compiled code
├── package.json                   # Package configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

### Module Descriptions

#### `src/index.ts`
Main entry point that exports the `Youtube` class and all types.

#### `src/interfaces/types.ts`
Contains all TypeScript type definitions:
- `Mp3Options`, `Mp4Options`: Configuration options
- `Mp3Response`, `Mp4Response`: Response types
- `VideoSearchResult`, `MusicSearchResult`: Search results

#### `src/internal/youtube.ts`
Main class that orchestrates downloads:
- Automatically configures FFmpeg
- Delegates to `YoutubeMp3` or `YoutubeMp4` based on type
- Handles response callbacks

#### `src/internal/youtubeMp3.ts`
Specifically handles audio downloads:
- Downloads audio streams using `ytdl-core`
- Converts to MP3 using FFmpeg
- Adds metadata (title, artist)
- Processes and adds thumbnails as cover art
- Support for in-memory or file download

#### `src/internal/youtubeMp4.ts`
Specifically handles video downloads:
- Downloads video streams with audio
- Support for different qualities
- Optional progress callback

#### `src/internal/youtubeScrap.ts`
Handles search and scraping:
- Search by text or URL
- YouTube URL validation
- Video metadata extraction
- Thumbnail resizing

#### `src/tools/utils.ts`
General utilities:
- Random ID generation
- Filename validation and sanitization
- Extension verification

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Local Development

```bash
# Clone the repository
git clone https://github.com/Leon564/mediatube.git
cd mediatube

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev
```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🐛 Report Issues

If you find any bugs or have suggestions, please [open an issue](https://github.com/Leon564/mediatube/issues) on GitHub.

## ⭐ Acknowledgments

- [ytdl-core](https://github.com/fent/node-ytdl-core) for the base download functionality
- [FFmpeg](https://ffmpeg.org/) for multimedia conversion capabilities
- [youtubei](https://github.com/LuanRT/YouTube.js) for the search API

---

**Developed with ❤️ by [Leon564](https://github.com/Leon564)**
