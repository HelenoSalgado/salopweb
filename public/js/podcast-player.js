/**
 * podcast-player.js — Standalone client-side audio player controller.
 * Handles audio playback, time formatting, progress scrubbing, and skip controls
 * for zero-hydration static pages.
 */
(() => {
  'use strict';

  const PLAY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  const PAUSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setupPlayer = (wrapper) => {
    if (wrapper._podcastPlayerInitialized) return;
    wrapper._podcastPlayerInitialized = true;

    const audio = wrapper.querySelector('audio');
    if (!audio) return;

    const playPauseBtn = wrapper.querySelector('.play-pause-button');
    const rewindBtn = wrapper.querySelector('.rewind-button');
    const forwardBtn = wrapper.querySelector('.forward-button');
    const progressBar = wrapper.querySelector('.progress-bar');
    const progressFilled = wrapper.querySelector('.progress-filled');
    const currentTimeEl = wrapper.querySelector('.current-time');
    const durationEl = wrapper.querySelector('.duration');
    const tooltipEl = wrapper.querySelector('.time-tooltip');

    let isDragging = false;

    const setPlayState = (isPlaying) => {
      if (!playPauseBtn) return;
      playPauseBtn.innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
      playPauseBtn.title = isPlaying ? 'Pausar' : 'Reproduzir';
      playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproduzir');
    };

    const updateDuration = () => {
      if (durationEl && !isNaN(audio.duration) && audio.duration > 0) {
        durationEl.textContent = formatTime(audio.duration);
      }
    };

    const updateTimeDisplay = () => {
      if (isDragging) return;
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
      if (progressFilled && !isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      }
    };

    // If duration is already available (e.g. cached metadata)
    if (audio.readyState >= 1) {
      updateDuration();
    }

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('timeupdate', updateTimeDisplay);

    audio.addEventListener('play', () => {
      // Pause any other audio on the page
      document.querySelectorAll('audio').forEach((other) => {
        if (other !== audio && !other.paused) {
          other.pause();
        }
      });
      setPlayState(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    });

    audio.addEventListener('pause', () => {
      setPlayState(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    });

    audio.addEventListener('ended', () => {
      setPlayState(false);
      if (progressFilled) progressFilled.style.width = '0%';
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
    });

    // Play / Pause click
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().catch((err) => console.warn('Falha na reprodução de áudio:', err));
        } else {
          audio.pause();
        }
      });
    }

    // Rewind 10s
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        updateTimeDisplay();
      });
    }

    // Forward 10s
    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => {
        const maxTime = audio.duration || audio.currentTime + 10;
        audio.currentTime = Math.min(maxTime, audio.currentTime + 10);
        updateTimeDisplay();
      });
    }

    // Seeking logic
    const seekToPosition = (clientX) => {
      if (!progressBar || isNaN(audio.duration) || audio.duration <= 0) return;
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetTime = percent * audio.duration;

      if (progressFilled) {
        progressFilled.style.width = `${percent * 100}%`;
      }
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(targetTime);
      }
      audio.currentTime = targetTime;
    };

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        seekToPosition(e.clientX);
      });

      // Mouse drag
      progressBar.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        seekToPosition(e.clientX);

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          seekToPosition(moveEvent.clientX);
        };

        const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      // Touch drag
      progressBar.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        isDragging = true;
        seekToPosition(touch.clientX);
      }, { passive: true });

      progressBar.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        if (!touch) return;
        seekToPosition(touch.clientX);
      }, { passive: true });

      progressBar.addEventListener('touchend', () => {
        isDragging = false;
      });

      // Tooltip hover
      if (tooltipEl) {
        progressBar.addEventListener('mousemove', (e) => {
          if (isNaN(audio.duration) || audio.duration <= 0) return;
          const rect = progressBar.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          tooltipEl.textContent = formatTime(percent * audio.duration);
          tooltipEl.style.left = `${percent * 100}%`;
          tooltipEl.style.display = 'block';
        });

        progressBar.addEventListener('mouseleave', () => {
          tooltipEl.style.display = 'none';
        });
      }
    }
  };

  const initAllPlayers = () => {
    document.querySelectorAll('.audio-player-wrapper').forEach(setupPlayer);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllPlayers);
  } else {
    initAllPlayers();
  }

  // Handle SPA transitions from nuxt-lite
  document.addEventListener('nuxt-lite:navigate', initAllPlayers);
})();
