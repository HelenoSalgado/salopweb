<script setup lang="ts">
import { reactive, ref, shallowRef, onMounted } from 'vue';

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Podcast'
    },
    artist: {
        type: String,
        default: 'Heleno Salgado'
    },
    album: {
        type: String,
        default: 'Podcast do Blog - NotebookLM'
    },
    artwork: {
        type: String,
        default: '/images/default-podcast.webp'
    }
});

// --- Estado Reativo ---

const audioElement = shallowRef<HTMLAudioElement | null>(null);
const progressBar = shallowRef<HTMLDivElement | null>(null);

const playerState = reactive({
    isPlaying: false,
    isDragging: false,
    isSeeking: false,
    playAfterSeek: false,
    currentTime: 0,
    duration: 0,
    progressPercent: 0,
});

const tooltipState = reactive({
    show: false,
    time: 0,
    position: 0,
});

// Feedback visual para saltos consecutivos
const forwardAccumulator = ref(0);
const rewindAccumulator = ref(0);
let forwardResetTimer: NodeJS.Timeout | null = null;
let rewindResetTimer: NodeJS.Timeout | null = null;

// --- Funções de Verificação de Estado ---

const isReadyToSeek = () => {
    if (!audioElement.value || !progressBar.value) return false;
    if (audioElement.value.readyState === 0) return false;
    const { duration } = playerState;
    if (!duration || isNaN(duration) || duration <= 0) return false;
    return true;
};

// --- Manipuladores de Eventos do Player ---

const onPlay = () => {
    playerState.isPlaying = true;
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
    }
};

const onPause = () => {
    playerState.isPlaying = false;
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
    }
};

const onEnded = () => {
    playerState.isPlaying = false;
    playerState.progressPercent = 0;
    playerState.currentTime = 0;
};

const onTimeUpdate = () => {
    if (!audioElement.value || playerState.isDragging || playerState.isSeeking) return;
    
    playerState.currentTime = audioElement.value.currentTime;
    if (isReadyToSeek()) {
        playerState.progressPercent = (playerState.currentTime / playerState.duration) * 100;
    }
};

const onLoadedMetadata = () => {
    if (!audioElement.value) return;
    playerState.duration = audioElement.value.duration;
};

const onSeeking = () => {
    playerState.isSeeking = true;
};

const onSeeked = () => {
    playerState.isSeeking = false;
    if (playerState.playAfterSeek) {
        playerState.playAfterSeek = false;
        if (audioElement.value?.paused) {
            audioElement.value.play();
        }
    }
};

// --- Controles de Interação do Usuário ---

const togglePlayPause = () => {
    if (!audioElement.value) return;

    if (audioElement.value.paused) {
        if (playerState.isSeeking) {
            playerState.playAfterSeek = true;
        } else {
            audioElement.value.play();
        }
    } else {
        playerState.playAfterSeek = false;
        audioElement.value.pause();
    }
};

const rewind = () => {
    if (!isReadyToSeek() || !audioElement.value) return;
    audioElement.value.currentTime = Math.max(playerState.currentTime - 10, 0);

    rewindAccumulator.value += 10;
    if (rewindResetTimer) clearTimeout(rewindResetTimer);
    rewindResetTimer = setTimeout(() => {
        rewindAccumulator.value = 0;
    }, 1500);
};

const forward = () => {
    if (!isReadyToSeek() || !audioElement.value) return;
    audioElement.value.currentTime = Math.min(playerState.currentTime + 10, playerState.duration);

    forwardAccumulator.value += 10;
    if (forwardResetTimer) clearTimeout(forwardResetTimer);
    forwardResetTimer = setTimeout(() => {
        forwardAccumulator.value = 0;
    }, 1500);
};

// --- Lógica da Barra de Progresso ---

const updateSeekPosition = (clientX: number) => {
    if (!isReadyToSeek() || !audioElement.value || !progressBar.value) return;
    
    const rect = progressBar.value.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * playerState.duration;

    playerState.progressPercent = percent * 100;
    playerState.currentTime = newTime;
    audioElement.value.currentTime = newTime;
};

const onProgressMouseDown = (event: MouseEvent) => {
    if (!isReadyToSeek()) return;
    
    event.preventDefault();
    playerState.isDragging = true;
    updateSeekPosition(event.clientX);
    
    const onMouseMove = (e: MouseEvent) => updateSeekPosition(e.clientX);
    
    const onMouseUp = () => {
        playerState.isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

const handleTouchStart = (event: TouchEvent) => {
    if (!isReadyToSeek()) return;
    playerState.isDragging = true;
    updateSeekPosition(event.touches[0].clientX);
};

const handleTouchMove = (event: TouchEvent) => {
    if (!playerState.isDragging) return;
    updateSeekPosition(event.touches[0].clientX);
};

const handleTouchEnd = () => {
    playerState.isDragging = false;
};

// --- Funções Utilitárias ---

const formatSkipTime = (seconds: number): string => {
    const displaySeconds = seconds > 0 ? seconds : 10;
    if (displaySeconds < 60) return `${displaySeconds}s`;
    const minutes = displaySeconds / 60;
    return Number.isInteger(minutes) ? `${minutes}min` : `${minutes.toFixed(1)}min`;
};

const onProgressHover = (event: MouseEvent) => {
    if (!isReadyToSeek() || !progressBar.value) return;
    
    const rect = progressBar.value.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, hoverX / rect.width));
    
    tooltipState.time = percent * playerState.duration;
    tooltipState.position = percent * 100;
    tooltipState.show = true;
};

const hideTimeTooltip = () => {
    tooltipState.show = false;
};

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// --- Ciclo de Vida e Media Session ---

const setupMediaSession = (audio: HTMLAudioElement) => {
    if (!('mediaSession' in navigator)) return;

    const updateMetadata = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: props.title,
            artist: props.artist,
            album: props.album,
            artwork: [
                { src: props.artwork, sizes: '96x96', type: 'image/webp' },
                { src: props.artwork, sizes: '128x128', type: 'image/webp' },
                { src: props.artwork, sizes: '192x192', type: 'image/webp' },
                { src: props.artwork, sizes: '256x256', type: 'image/webp' },
                { src: props.artwork, sizes: '384x384', type: 'image/webp' },
                { src: props.artwork, sizes: '512x512', type: 'image/webp' }
            ]
        });
    };

    const updatePositionState = () => {
        if (navigator.mediaSession.setPositionState && !isNaN(audio.duration) && audio.duration > 0) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: audio.duration,
                    playbackRate: audio.playbackRate,
                    position: audio.currentTime
                });
            } catch (error) {
                console.warn('MediaSession: Erro ao atualizar positionState:', error);
            }
        }
    };

    navigator.mediaSession.setActionHandler('play', () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    navigator.mediaSession.setActionHandler('seekbackward', (d) => { audio.currentTime = Math.max(audio.currentTime - (d.seekOffset || 10), 0); });
    navigator.mediaSession.setActionHandler('seekforward', (d) => { audio.currentTime = Math.min(audio.currentTime + (d.seekOffset || 10), audio.duration || 0); });
    navigator.mediaSession.setActionHandler('seekto', (d) => { if (d.seekTime != null) audio.currentTime = d.seekTime; });

    updateMetadata();
    audio.addEventListener('loadedmetadata', () => {
        updateMetadata();
        updatePositionState();
    });
    audio.addEventListener('timeupdate', updatePositionState);
};

onMounted(() => {
    if (audioElement.value) {
        setupMediaSession(audioElement.value);
    }
});
</script>
<template>
    <div class="audio-player-wrapper">
        <NuxtImg 
            :src="artwork"
            class="background-artwork" 
            :alt="title"
            loading="lazy"
        />
        <div class="background-overlay"></div>
        
        <div class="player-content">
            <audio 
                ref="audioElement"
                :src="src"
                preload="metadata"
                @timeupdate="onTimeUpdate" 
                @loadedmetadata="onLoadedMetadata"
                @play="onPlay"
                @pause="onPause"
                @ended="onEnded"
                @seeking="onSeeking"
                @seeked="onSeeked"
            >
                Seu navegador não suporta o elemento de áudio.
            </audio>
            
            <div class="custom-controls">
                <button 
                    title="Retroceder 10 segundos"
                    aria-label="Retroceder 10 segundos"
                    class="control-button rewind-button" 
                    @click="rewind"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    <span class="skip-label">{{ formatSkipTime(rewindAccumulator) }}</span>
                </button>

                <button 
                    :title="playerState.isPlaying ? 'Pausar' : 'Reproduzir'"
                    :aria-label="playerState.isPlaying ? 'Pausar' : 'Reproduzir'"
                    class="control-button play-pause-button"
                    @click="togglePlayPause"
                >
                    <svg v-if="!playerState.isPlaying" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                </button>

                <button 
                    title="Avançar 10 segundos"
                    aria-label="Avançar 10 segundos"
                    class="control-button forward-button"
                    @click="forward"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                    </svg>
                    <span class="skip-label">{{ formatSkipTime(forwardAccumulator) }}</span>
                </button>
            </div>

            <div 
                class="progress-container" 
                @mousemove="onProgressHover"
                @mouseleave="hideTimeTooltip"
            >
                <!-- Tooltip de tempo no hover -->
                <div 
                    v-if="tooltipState.show" 
                    class="time-tooltip"
                    :style="{ left: tooltipState.position + '%' }"
                >
                    {{ formatTime(tooltipState.time) }}
                </div>
                
                <div 
                    class="progress-bar" 
                    ref="progressBar"
                    @mousedown="onProgressMouseDown"
                    @touchstart.passive="handleTouchStart"
                    @touchmove.passive="handleTouchMove"
                    @touchend="handleTouchEnd"
                >
                    <div class="progress-filled" :style="{ width: playerState.progressPercent + '%' }"></div>
                </div>
            </div>

            <div class="time-display">
                <span class="current-time">{{ formatTime(playerState.currentTime) }}</span>
                <span class="duration">{{ formatTime(playerState.duration) }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.audio-player-wrapper {
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-height: 300px;
    padding-top: 1.5rem;
}

/* Background com NuxtImg */
.background-artwork {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(1.2);
    filter: opacity(.5);
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.751) 0%,
        rgba(0, 0, 0, 0.742) 50%,
        rgba(0, 0, 0, 0.815) 100%
    );
    z-index: 2;
}

.player-content {
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 3;
    padding: 1.5rem;
}

audio {
    display: none;
}

/* Controles Personalizados */
.custom-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 2.5rem;
    margin-bottom: 1.5rem;
}

.control-button {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.control-button:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.control-button:active {
    transform: scale(0.95);
}

.skip-label {
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 0.65rem;
    font-weight: bolder;
    background: rgba(255, 255, 255, 0.95);
    color: #000;
    padding: 2px 5px;
    border-radius: 8px;
    line-height: 1;
}

.play-pause-button {
    background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.play-pause-button:hover {
    background: linear-gradient(135deg, var(--color-primary) 0%, #8a5ab8 100%);
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.12);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.rewind-button svg,
.forward-button svg {
    width: 15px;
    height: 15px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.play-pause-button svg {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

/* Container da Barra de Progresso */
.progress-container {
    position: relative;
    margin-bottom: 0.75rem;
}

/* Barra de Progresso */
.progress-bar {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    cursor: pointer;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    touch-action: none;
    user-select: none;
}

.progress-filled {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary) 0%, #764ba2 100%);
    border-radius: 25px;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
    position: relative;
    pointer-events: none;
}

.progress-filled::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.2s;
}

.progress-bar:hover .progress-filled::after {
    opacity: 1;
}

/* Tooltip de tempo no hover */
.time-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    transform: translateX(-50%);
    background: var(--color-background);
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.time-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-background);
}

.progress-bar:hover {
    height: 10px;
}

/* Display de Tempo */
.time-display {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
    user-select: none;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.current-time,
.duration {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
}

/* Responsividade */
@media (max-width: 480px) {

    .rewind-button svg,
    .forward-button svg {
        width: 20px;
        height: 20px;
    }

    .play-pause-button svg {
        width: 28px;
        height: 28px;
    }

    .control-button {
        padding: 0.6rem;
    }

    .play-pause-button {
        padding: 1rem;
    }

    .skip-label {
        font-size: 0.6rem;
        padding: 1px 4px;
    }
}
</style>
