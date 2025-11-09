<template>
    <div class="audio-player-wrapper">
        <audio controls>
            <source :src="src" type="audio/mp3">
            Seu navegador não suporta o elemento de áudio.
        </audio>
    </div>
</template>

<script setup lang="ts">
defineProps({
    src: {
        type: String,
        required: true
    }
});
</script>

<style scoped>
.audio-player-wrapper {
    margin-bottom: 1rem;
    margin-top: 1.5rem;
}

audio {
    width: 100%;
    border-radius: 5px;
    background-color: var(--color-background-hover);
    color: var(--color-text-primary);
}

/* Estilizando os controles de áudio (pode variar entre navegadores) */
audio::-webkit-media-controls-panel {
    background-color: var(--color-background-hover);
    border-radius: 5px;
}

audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-mute-button {
    background-color: var(--color-primary-button-bg);
    border-radius: 50%;
}

audio::-webkit-media-controls-timeline {
    background-color: var(--color-background);
    border-radius: 25px;
    margin-left: 10px;
    margin-right: 10px;
}
</style>
