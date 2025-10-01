<template>
  <div class="content-placeholder">
    <div class="placeholder-title"></div>
    <div class="placeholder-line"></div>
    <div class="placeholder-line"></div>
    <div class="placeholder-line short"></div>
  </div>
</template>

<style scoped>
.content-placeholder {
  max-width: 768px;
  margin: 2rem auto;
  padding: 1rem;
}

.placeholder-title {
  height: 2.5rem;
  width: 75%;
  background-color: #e0e0e0;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.placeholder-line {
  height: 1rem;
  width: 100%;
  background-color: #e0e0e0;
  margin-bottom: 1rem;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.placeholder-line.short {
  width: 50%;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
