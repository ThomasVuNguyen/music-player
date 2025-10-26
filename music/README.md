# Music Folder

Place your `.mp3` audio files in this folder.

After adding your music files, update the `songFiles` array in `script.js` to include them in your playlist.

## Example

If you add these files:
- `song1.mp3`
- `song2.mp3`
- `song3.mp3`

Update `script.js` (around line 44):

```javascript
const songFiles = [
    { file: 'music/song1.mp3', title: 'Beautiful Day', artist: 'Artist Name' },
    { file: 'music/song2.mp3', title: 'Peaceful Mind', artist: 'Artist Name' },
    { file: 'music/song3.mp3', title: 'Zen Garden', artist: 'Artist Name' },
];
```

## Supported Formats

- MP3 (recommended)
- WAV
- OGG
- M4A
