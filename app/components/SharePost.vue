<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  postTitle: { type: String, required: true, default: '' },
  postUrl: { type: String, required: true },
});

const copied = ref(false);

const encodedPostTitle = computed(() => encodeURIComponent(props.postTitle));
const encodedPostUrl = computed(() => encodeURIComponent(props.postUrl));

const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodedPostTitle.value}&url=${encodedPostUrl.value}`);
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl.value}`);
const linkedinShareUrl = computed(() => `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPostUrl.value}&title=${encodedPostTitle.value}`);
const whatsappShareUrl = computed(() => `https://api.whatsapp.com/send?text=${encodedPostTitle.value}%20${encodedPostUrl.value}`);

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.postUrl);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Falha ao copiar o link: ', err);
    alert('Não foi possível copiar o link. Por favor, copie manualmente: ' + props.postUrl);
  }
};
</script>

<template>
  <div class="share-post">
    <p>Compartilhar:</p>
    <div class="share-buttons">
      <a :href="twitterShareUrl" target="_blank" rel="noopener noreferrer" class="button twitter">
        Twitter
      </a>
      <a :href="facebookShareUrl" target="_blank" rel="noopener noreferrer" class="button facebook">
        Facebook
      </a>
      <a :href="linkedinShareUrl" target="_blank" rel="noopener noreferrer" class="button linkedin">
        LinkedIn
      </a>
      <a :href="whatsappShareUrl" target="_blank" rel="noopener noreferrer" class="button whatsapp">
        WhatsApp
      </a>
      <button @click="copyLink" class="button copy">
        Copiar Link
      </button>
    </div>
    <p v-if="copied" class="copied-message">Link copiado!</p>
  </div>
</template>

<style scoped>
.share-post {
  margin: 2rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: left;

  & .share-buttons {
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
    flex-wrap: wrap;

    & .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      text-decoration: none;
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      cursor: pointer;
      border: 1px solid var(--color-border);
      /* Borda para estilo "lite" */

      /* Cores padrão do blog para os botões */
      background-color: var(--color-background);
      color: var(--color-text-primary);

      &:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        /* Destacar a borda no hover */
        color: var(--color-primary);
      }
    }
  }

  & .button.copy {
    background-color: var(--color-primary-button-bg);
    color: var(--color-primary-button-text);
    border-color: var(--color-primary-button-border);

    &:hover {
      background-color: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      color: var(--color-primary-button-text);
    }
  }

  & .copied-message {
    margin-top: 1rem;
    color: var(--color-primary);
    text-align: left;
  }
}
</style>

