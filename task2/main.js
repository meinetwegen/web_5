const playlistData = {
    album: "912 Album",
    artist: "Singer#1",
    cover: "images/cover.jpg",
    tracks: [
        { id: 1, title: "Track 1", artist: "Singer#1", file: "audio/audio1.mp3" },
        { id: 2, title: "Track 2", artist: "Singer#1", file: "audio/audio2.mp3" },
        { id: 3, title: "Track 3", artist: "Singer#1", file: "audio/audio3.mp3" },
        { id: 4, title: "Track 4", artist: "Singer#1", file: "audio/audio4.mp3" },
        { id: 5, title: "Track 5", artist: "Singer#1", file: "audio/audio5.mp3" }
    ]
};

let currentTrackIndex = -1;
let totalSeconds = 0;
let loadedTracksCount = 0;
let isUserSeeking = false;

const audioPlayer = document.getElementById('audioPlayer');
const playlistContainer = document.getElementById('playlist');
const totalDurationEl = document.getElementById('totalDuration');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const vinylRecord = document.getElementById('vinylRecord');

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function initPlaylist() {
    playlistContainer.innerHTML = '';

    playlistData.tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'track-item d-flex align-items-center justify-content-between mb-1';
        item.dataset.index = index;

        item.innerHTML = `
            <div class="d-flex align-items-center gap-3 overflow-hidden me-2 flex-grow-1" onclick="playTrack(${index})">
                <i class="bi bi-play-fill fs-5 play-icon" id="icon-${index}"></i>
                <div class="text-truncate">
                    <div class="fw-bold text-truncate small">${track.title}</div>
                    <div class="text-white-50 extra-small" style="font-size: 0.75rem;">${track.artist}</div>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="small text-white-50 me-2" id="duration-${index}">--:--</span>
                <button class="track-icon-btn" onclick="openInfoModal(${index}, event)">
                    <i class="bi bi-info-circle"></i>
                </button>
            </div>
        `;

        playlistContainer.appendChild(item);
        loadTrackDuration(track, index);
    });
}

function loadTrackDuration(track, index) {
    const audio = new Audio();
    audio.src = track.file;

    audio.addEventListener('loadedmetadata', () => {
        track.duration = audio.duration;
        totalSeconds += audio.duration;
        loadedTracksCount++;

        document.getElementById(`duration-${index}`).textContent = formatTime(audio.duration);

        if (loadedTracksCount === playlistData.tracks.length) {
            totalDurationEl.textContent = formatTime(totalSeconds);
        }
    });

    audio.addEventListener('error', () => {
        loadedTracksCount++;
        document.getElementById(`duration-${index}`).textContent = "N/A";
        if (loadedTracksCount === playlistData.tracks.length) {
            totalDurationEl.textContent = formatTime(totalSeconds);
        }
    });
}

function playTrack(index) {
    if (currentTrackIndex === index) {
        togglePlayPause();
        return;
    }

    currentTrackIndex = index;
    const track = playlistData.tracks[index];
    audioPlayer.src = track.file;
    audioPlayer.play();

    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;

    updateActiveTrackUI(index);
    updatePlayStateUI(true);
}

function togglePlayPause() {
    if (currentTrackIndex === -1) {
        playTrack(0);
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayStateUI(true);
    } else {
        audioPlayer.pause();
        updatePlayStateUI(false);
    }
}

function updatePlayStateUI(isPlaying) {
    if (isPlaying) {
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill fs-3"></i>';
        vinylRecord.classList.add('vinyl-rotating');
    } else {
        playPauseBtn.innerHTML = '<i class="bi bi-play-fill fs-3"></i>';
        vinylRecord.classList.remove('vinyl-rotating');
    }
    updatePlayIcons(currentTrackIndex, isPlaying);
}

function updateActiveTrackUI(activeIndex) {
    document.querySelectorAll('.track-item').forEach((item, idx) => {
        if (idx === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updatePlayIcons(activeIndex, isPlaying) {
    playlistData.tracks.forEach((_, idx) => {
        const icon = document.getElementById(`icon-${idx}`);
        if (icon) {
            if (idx === activeIndex) {
                icon.className = isPlaying ? 'bi bi-pause-fill fs-5 text-info' : 'bi bi-play-fill fs-5 text-info';
            } else {
                icon.className = 'bi bi-play-fill fs-5';
            }
        }
    });
}

playPauseBtn.addEventListener('click', togglePlayPause);

prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    } else {
        playTrack(playlistData.tracks.length - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentTrackIndex + 1 < playlistData.tracks.length) {
        playTrack(currentTrackIndex + 1);
    } else {
        playTrack(0);
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (!isUserSeeking && audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressSlider.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationTimeEl.textContent = formatTime(audioPlayer.duration);
    }
});

progressSlider.addEventListener('input', () => {
    isUserSeeking = true;
    if (audioPlayer.duration) {
        const seekTime = (progressSlider.value / 100) * audioPlayer.duration;
        currentTimeEl.textContent = formatTime(seekTime);
    }
});

progressSlider.addEventListener('change', () => {
    if (audioPlayer.duration) {
        const seekTime = (progressSlider.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
    isUserSeeking = false;
});

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

audioPlayer.addEventListener('ended', () => {
    if (currentTrackIndex + 1 < playlistData.tracks.length) {
        playTrack(currentTrackIndex + 1);
    } else {
        updatePlayStateUI(false);
    }
});

function openInfoModal(index, event) {
    event.stopPropagation();
    const track = playlistData.tracks[index];

    document.getElementById('modalTitle').textContent = track.title;
    document.getElementById('modalArtist').textContent = track.artist;
    document.getElementById('modalCover').src = playlistData.cover;
    document.getElementById('modalDuration').textContent = `Duration: ${formatTime(track.duration || 0)}`;

    const modalEl = document.getElementById('trackModal');
    const trackModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    trackModal.show();
}

initPlaylist();