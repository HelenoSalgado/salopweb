<script setup lang="ts">
const email = ref('')

const { data, error, pending, execute } = useFetch('/api/newsletter/subscribe', {
  method: 'POST',
  body: { email },
  lazy: true,
  immediate: false
})
</script>

<template>
  <div class="newsletter-card">
    <div class="newsletter-header">
      <div class="newsletter-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      </div>
      <div>
        <h4 class="newsletter-title">Reflexões na sua caixa de entrada</h4>
        <p class="newsletter-description">
          Receba novos ensaios sobre teologia, filosofia clássica e computação diretamente no seu e-mail.
        </p>
      </div>
    </div>

    <form class="newsletter-form" @submit.prevent="execute()">
      <div class="input-wrapper">
        <input
          id="newsletter-email"
          v-model="email"
          type="email"
          name="email"
          placeholder="seu.email@exemplo.com"
          :disabled="pending"
          autocomplete="email"
          required
        >
      </div>
      <button type="submit" :disabled="pending" class="newsletter-submit">
        <span v-if="!pending">Inscrever-se</span>
        <span v-else class="loader" />
      </button>
    </form>

    <Transition name="fade">
      <div v-if="data" class="message success">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ data.message }}</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="error?.message" class="message error">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ error.data?.message || error.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.newsletter-card {
  max-width: 560px;
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px var(--color-shadow);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin: 1.5rem 0;
}

.newsletter-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.newsletter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-color: var(--color-background-hover);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}

.newsletter-title {
  margin: 0 0 0.4rem 0 !important;
  font-family: var(--font-serif);
  font-size: 1.35rem !important;
  font-weight: 600;
  color: var(--color-text-heading);
  letter-spacing: -0.01em;
}

.newsletter-description {
  margin: 0 !important;
  font-family: var(--font-sans) !important;
  font-size: 0.95rem !important;
  line-height: 1.5 !important;
  color: var(--color-text-secondary) !important;
}

.newsletter-form {
  display: flex;
  gap: 0.6rem;
  width: 100%;
}

.input-wrapper {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.newsletter-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
    background-color: var(--color-background-elevated);
  }
}

.newsletter-submit {
  flex-shrink: 0;
  padding: 0.75rem 1.4rem;
  border-radius: 8px;
  border: none;
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, filter 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.message.success {
  background-color: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(var(--color-primary-rgb), 0.25);
}

.message.error {
  background-color: var(--callout-attention-bg);
  color: var(--callout-attention-icon);
  border: 1px solid var(--callout-attention-border);
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-primary-button-text);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  .newsletter-card {
    padding: 1.25rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-submit {
    width: 100%;
  }
}
</style>
