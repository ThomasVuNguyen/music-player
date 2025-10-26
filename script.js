// Music Player State
let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;
let songs = [];
const audio = new Audio();

// DOM Elements
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const muteBtn = document.getElementById('mute-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const volumeOn = document.querySelector('.volume-on');
const volumeOff = document.querySelector('.volume-off');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const playlistEl = document.getElementById('playlist');
const playlistContainer = document.getElementById('playlist-container');
const musicPlayer = document.querySelector('.music-player');

// Initialize
async function init() {
    // Load songs from music folder
    await loadSongs();

    // Set initial volume
    audio.volume = 0.7;

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    muteBtn.addEventListener('click', toggleMute);
    progressBar.addEventListener('click', seek);

    // Audio Events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Show playlist if songs exist
    if (songs.length > 0) {
        playlistContainer.classList.add('show');
    }
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load songs from music folder via API
async function loadSongs() {
    try {
        // Fetch songs from the server API
        const response = await fetch('/api/songs');

        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }

        const data = await response.json();

        if (data.songs && data.songs.length > 0) {
            // Shuffle songs randomly
            songs = shuffleArray(data.songs);

            console.log(`🎵 Loaded ${songs.length} songs (shuffled randomly)`);

            // Render playlist
            renderPlaylist();

            // Load first song (random due to shuffle)
            loadSong(0);

            // Show playlist
            playlistContainer.classList.add('show');

            return;
        }

        // No songs found
        throw new Error('No songs found');

    } catch (error) {
        console.error('Error loading songs:', error);

        // Show empty playlist message
        playlistEl.innerHTML = `
            <div class="playlist-empty">
                <p>No songs found in the music folder.</p>
                <p style="margin-top: 12px; font-size: 13px;">
                    Add your music files (.mp3, .wav, .ogg, .m4a) to the <strong>music/</strong> folder<br>
                    and refresh the page.
                </p>
                <p style="margin-top: 12px; font-size: 12px; color: #6b7280;">
                    Tip: Name your files as "Artist - Title.mp3" for automatic parsing.
                </p>
            </div>
        `;

        // Set default display
        songTitle.textContent = 'The Moment';
        songArtist.textContent = 'Tame Impala';

        // Disable controls
        playBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = songs.map((song, index) => `
        <div class="playlist-item ${index === currentSongIndex ? 'active' : ''}" data-index="${index}">
            <div class="playlist-item-number">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
            </div>
        </div>
    `).join('');

    // Add click listeners to playlist items
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            loadSong(index);
            play();
        });
    });
}

// Load song
function loadSong(index) {
    if (songs.length === 0) return;

    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audio.src = song.file;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist || 'Unknown Artist';

    // Update active playlist item
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === currentSongIndex);
    });

    // Reset progress
    progress.style.width = '0%';
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Play
function play() {
    if (songs.length === 0) return;

    audio.play();
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    musicPlayer.classList.add('playing');
}

// Pause
function pause() {
    audio.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    musicPlayer.classList.remove('playing');
}

// Play previous song
function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) play();
}

// Play next song
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;

    // If we've looped back to the start, reshuffle for continuous random play
    if (currentSongIndex === 0 && songs.length > 1) {
        songs = shuffleArray(songs);
        renderPlaylist();
        console.log('🔀 Playlist reshuffled for continuous play');
    }

    loadSong(currentSongIndex);
    if (isPlaying) play();
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;

    if (isMuted) {
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
    } else {
        volumeOn.style.display = 'block';
        volumeOff.style.display = 'none';
    }
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audio;

    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
}

// Seek
function seek(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// Keyboard shortcuts
function handleKeyboard(e) {
    if (songs.length === 0) return;

    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            playPrevious();
            break;
        case 'ArrowRight':
            e.preventDefault();
            playNext();
            break;
        case 'KeyM':
            e.preventDefault();
            toggleMute();
            break;
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
