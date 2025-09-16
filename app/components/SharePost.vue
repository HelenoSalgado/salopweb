<template>
  <div class="share-post">
    <h4>Compartilhar:</h4>
    <div class="share-buttons">
      <a :href="twitterShareUrl" target="_blank" rel="noopener noreferrer" class="share-button twitter">
        Twitter
      </a>
      <a :href="facebookShareUrl" target="_blank" rel="noopener noreferrer" class="share-button facebook">
        Facebook
      </a>
      <a :href="linkedinShareUrl" target="_blank" rel="noopener noreferrer" class="share-button linkedin">
        LinkedIn
      </a>
      <a :href="whatsappShareUrl" target="_blank" rel="noopener noreferrer" class="share-button whatsapp">
        WhatsApp
      </a>
      <button @click="copyLink" class="share-button copy">
        Copiar Link
      </button>
    </div>
    <p v-if="copied" class="copied-message">Link copiado!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  postTitle: { type: String, required: true },
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

