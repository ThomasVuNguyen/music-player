# Zen Music Player

A beautiful, minimal, and creative music player widget with a zen aesthetic.

## Features

- Clean and minimal design with smooth animations
- Zen-inspired gradient background with floating elements
- Responsive music visualizer with pulsing circles
- Full playback controls (play, pause, previous, next)
- Progress bar with seek functionality
- Volume control
- Interactive playlist
- Keyboard shortcuts

## Setup

1. **Add your music files**
   Place your audio files in the `music/` folder
   - Supported formats: MP3, WAV, OGG, M4A, FLAC, AAC
   - Tip: Name files as "Artist - Title.mp3" for automatic artist/title parsing
   - Example: "Tame Impala - The Moment.mp3"

2. **Start the server**
   Run the Python server (requires Python 3):
   ```bash
   python server.py
   ```
   The server will automatically detect all music files and start on port 1306

3. **Open the player**
   Open your browser and visit: `http://localhost:1306`

The player will automatically:
- Detect all music files in the `music/` folder
- Shuffle them randomly
- Play continuously with reshuffling when the playlist ends

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←` - Previous song
- `→` - Next song
- `↑` - Increase volume
- `↓` - Decrease volume

## Features in Detail

**Automatic Music Detection**
- No manual configuration needed
- Just drop files in the `music/` folder and refresh
- Server automatically scans and serves your music

**Random Play**
- Songs are shuffled when you start the player
- Reshuffles automatically when playlist loops
- True random playback experience

**Smart Filename Parsing**
- Format: "Artist - Title.mp3" → Artist and Title parsed automatically
- Just "Title.mp3" → Shows as "Unknown Artist"

## Browser Compatibility

Works best in modern browsers (Chrome, Firefox, Safari, Edge)

## Design Philosophy

This player embraces zen principles:
- Minimalism: Only essential controls
- Calm colors: Soft gradients and muted tones
- Breathing space: Generous padding and whitespace
- Smooth interactions: Gentle animations and transitions
- Focus: Beautiful visualizer that responds to playback state