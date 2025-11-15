<script setup lang="ts">

const email = ref('')

const { data, error, pending, execute } = await useFetch('/api/newsletter/subscribe', {
  method: 'POST',
  body: { email: email.value },
  lazy: true,
  immediate: false
})


</script>

<template>
  <div class="newsletter-form-container">
    <p>Receba as últimas postagens e atualizações diretamente no seu e-mail.</p>
    <form @submit.prevent="execute()">
      <input v-model="email" type="email" placeholder="email@exemplo.com" :disabled="pending">
      <button type="submit" :disabled="pending">
        <span v-if="!pending">Inscrever</span>
        <span v-else class="loader" />
      </button>
    </form>
    <div v-if="data" class="message success">
      {{ data }}
    </div>
    <div v-if="error?.message" class="message error">
      {{ error.data.message }}
    </div>
  </div>
</template>

<style scoped>
.newsletter-form-container {
  max-width: 400px;
  text-align: left;
}

form {
  display: flex;
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  transition: all 0.2s ease;
  overflow: hidden;

  & :focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
  }

  & input {
    flex-grow: 1;
    padding: .7rem 0.75rem;
    border: none;
    background-color: transparent;
    color: var(--color-text-primary);
    outline: none;
    font-size: 1rem;

    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.7;
    }
  }

  & button {
    padding: 0 1rem;
    border: none;
    border-radius: 0;
    background-color: var(--color-primary-button-bg);
    color: var(--color-text-primary);
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);

      & :disabled {
        background-color: var(--color-border);
        cursor: not-allowed;
      }
    }
  }
}

.message {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}

.message.success {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
}

.message.error {
  background-color: var(--callout-attention-bg);
  color: var(--callout-attention-icon);
}

/* Loader animation for the button */
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
