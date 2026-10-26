<template>
  <div id="reading-progress-bar" class="reading-progress-bar" />
</template>

<style>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--color-primary);
  z-index: 9999;
  transform-origin: left;
  transform: scaleX(0);
  will-change: transform;
  transition: transform 0.1s linear;
}
</style>
