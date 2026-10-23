const playlistData = {
    album: "505 Album",
    artist: "Various Artists",
    cover: "images/cover.jpg",
    tracks: [
        { id: 1, title: "123", artist: "ABBA", file: "audio/audio1.mp3", duration: 0, isFavorite: true },
        { id: 2, title: "324", artist: "AC/DC", file: "audio/audio2.mp3", duration: 0, isFavorite: true },
        { id: 3, title: "643", artist: "The Beatles", file: "audio/audio3.mp3", duration: 0, isFavorite: true },
        { id: 4, title: "abas", artist: "Singer#1", file: "audio/audio4.mp3", duration: 0, isFavorite: false },
        { id: 5, title: "fsaf", artist: "Singer#3", file: "audio/audio5.mp3", duration: 0, isFavorite: false },
        { id: 6, title: "gsds", artist: "kaput", file: "audio/audio6.mp3", duration: 0, isFavorite: false },
        { id: 7, title: "gsde dsre", artist: "Rome", file: "audio/audio7.mp3", duration: 0, isFavorite: false },
        { id: 8, title: "gsde dsre", artist: "Zhannel", file: "audio/audio8.mp3", duration: 0, isFavorite: false },
        { id: 9, title: "fsaf", artist: "KAIRA", file: "audio/audio9.mp3", duration: 0, isFavorite: false },
        { id: 10, title: "gsds", artist: "Ke$ha", file: "audio/audio10.mp3", duration: 0, isFavorite: false }
    ]
};

let currentTrackIndex = -1;
let searchQuery = "";
let isUserSeeking = false;
let favoriteCount = 3;

const audioPlayer = document.getElementById('audioPlayer');
const playlistContainer = document.getElementById('playlist');
const searchContainer = document.getElementById('searchContainer');
const alertContainer = document.getElementById('alertContainer');
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

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.className = 'form-control form-control-sm bg-dark text-white border-secondary';
searchInput.placeholder = 'Search tracks...';
searchContainer.appendChild(searchInput);

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function calculateTotalDuration() {
    let total = 0;
    for (let i = 0; i < playlistData.tracks.length; i++) {
        total += playlistData.tracks[i].duration || 0;
    }
    totalDurationEl.textContent = formatTime(total);
}

function render() {
    document.getElementById('albumName').textContent = playlistData.album;
    document.getElementById('albumArtist').textContent = playlistData.artist;   
    playlistContainer.textContent = '';

    const filteredTracks = playlistData.tracks.filter(track => 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredTracks.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-center text-white-50 py-3 small';
        emptyMsg.textContent = 'No tracks found';
        playlistContainer.appendChild(emptyMsg);
        return;
    }

    filteredTracks.forEach((track) => {
        const originalIndex = playlistData.tracks.indexOf(track);
        const isActive = originalIndex === currentTrackIndex;
        const isPlaying = isActive && !audioPlayer.paused;

        const item = document.createElement('div');
        item.className = `track-item d-flex align-items-center justify-content-between mb-1 ${isActive ? 'active' : ''}`;
        item.dataset.index = originalIndex;

        const leftDiv = document.createElement('div');
        leftDiv.className = 'd-flex align-items-center gap-3 overflow-hidden me-2 flex-grow-1 action-play';
        leftDiv.style.cursor = 'pointer';

        const icon = document.createElement('i');
        icon.className = isPlaying ? 'bi bi-pause-fill text-info fs-5' : 'bi bi-play-fill fs-5';

        const textDiv = document.createElement('div');
        textDiv.className = 'text-truncate';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'fw-bold text-truncate small';
        titleDiv.textContent = track.title;

        const artistDiv = document.createElement('div');
        artistDiv.className = 'text-white-50 extra-small';
        artistDiv.style.fontSize = '0.75rem';
        artistDiv.textContent = track.artist;

        textDiv.appendChild(titleDiv);
        textDiv.appendChild(artistDiv);
        leftDiv.appendChild(icon);
        leftDiv.appendChild(textDiv);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'd-flex align-items-center gap-2';

        const durSpan = document.createElement('span');
        durSpan.className = 'small text-white-50 me-2';
        durSpan.textContent = formatTime(track.duration);

        const favBtn = document.createElement('button');
        favBtn.className = 'track-icon-btn action-fav';
        const favIcon = document.createElement('i');
        favIcon.className = track.isFavorite ? 'bi bi-star-fill text-warning' : 'bi bi-star';
        favBtn.appendChild(favIcon);

        const infoBtn = document.createElement('button');
        infoBtn.className = 'track-icon-btn action-info';
        const infoIcon = document.createElement('i');
        infoIcon.className = 'bi bi-info-circle';
        infoBtn.appendChild(infoIcon);

        rightDiv.appendChild(durSpan);
        rightDiv.appendChild(favBtn);
        rightDiv.appendChild(infoBtn);

        item.appendChild(leftDiv);
        item.appendChild(rightDiv);
        playlistContainer.appendChild(item);
    });
    playPauseBtn.querySelector('i').className = !audioPlayer.paused && currentTrackIndex !== -1 ? 'bi bi-pause-fill fs-3' : 'bi bi-play-fill fs-3';
}

playlistContainer.addEventListener('click', (event) => {
    const playTarget = event.target.closest('.action-play');
    const favTarget = event.target.closest('.action-fav');
    const infoTarget = event.target.closest('.action-info');
    const trackItem = event.target.closest('.track-item');

    if (!trackItem) return;
    const index = parseInt(trackItem.dataset.index);

    if (playTarget) {
        playTrack(index);
    } else if (favTarget) {
        handleFavoriteRule(index);
    } else if (infoTarget) {
        openInfoModal(index);
    }
});

function loadAllTracksDurations() {
    playlistData.tracks.forEach((track) => {
        const audio = new Audio();
        audio.src = track.file;
        audio.addEventListener('loadedmetadata', () => {
            track.duration = audio.duration;
            calculateTotalDuration();
            render();
        });
        audio.addEventListener('error', () => {
            track.duration = 0;
            render();
        });
    });
}

function playTrack(index) {
    if (currentTrackIndex === index) {
        if (audioPlayer.paused) {
            audioPlayer.play();
            vinylRecord.classList.add('vinyl-rotating');
        } else {
            audioPlayer.pause();
            vinylRecord.classList.remove('vinyl-rotating');
        }
        render();
        return;
    }

    currentTrackIndex = index;
    const track = playlistData.tracks[index];
    audioPlayer.src = track.file;
    audioPlayer.play();

    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;
    vinylRecord.classList.add('vinyl-rotating');

    render();
}

function showAlert(message) {
    alertContainer.textContent = '';
    const alertBox = document.createElement('div');
    alertBox.className = 'alert alert-danger py-1 px-2 mb-0 small text-center';
    alertBox.textContent = message;
    alertContainer.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

function handleFavoriteRule(index) {
    const track = playlistData.tracks[index];

    if (!track.isFavorite) {
        if (favoriteCount >= 3) {
            showAlert(`Action blocked: Limit reached! Max 3 favorite tracks.`);
        } else {
            track.isFavorite = true;
            favoriteCount++;
            render();
        }
    } else {
        track.isFavorite = false;
        favoriteCount--;
        render();
    }
}

function openInfoModal(index) {
    const track = playlistData.tracks[index];

    document.getElementById('modalTitle').textContent = track.title;
    document.getElementById('modalArtist').textContent = track.artist;
    document.getElementById('modalCover').src = playlistData.cover;
    document.getElementById('modalDuration').textContent = `Duration: ${formatTime(track.duration)}`;

    const modalEl = document.getElementById('trackModal');
    const trackModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    trackModal.show();
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    render();
});

playPauseBtn.addEventListener('click', () => {
    if (currentTrackIndex === -1) {
        playTrack(0);
        return;
    }
    if (audioPlayer.paused) {
        audioPlayer.play();
        vinylRecord.classList.add('vinyl-rotating');
    } else {
        audioPlayer.pause();
        vinylRecord.classList.remove('vinyl-rotating');
    }
    render();
});

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
        vinylRecord.classList.remove('vinyl-rotating');
        render();
    }
});

loadAllTracksDurations();
render();