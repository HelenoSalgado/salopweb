<script setup lang="ts">
import { computed } from 'vue';

const { postTitle, postUrl } = defineProps<{
  postTitle: string,
  postUrl: string
}>();

const encodedPostTitle = computed(() => encodeURIComponent(postTitle));
const encodedPostUrl = computed(() => encodeURIComponent(postUrl));

const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodedPostTitle.value}&url=${encodedPostUrl.value}`);
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl.value}`);
const linkedinShareUrl = computed(() => `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPostUrl.value}&title=${encodedPostTitle.value}`);
const whatsappShareUrl = computed(() => `https://api.whatsapp.com/send?text=${encodedPostTitle.value}%20${encodedPostUrl.value}`);
</script>

<template>
  <div class="share-post">
    <p>Compartilhar:</p>
    <div class="share-buttons">
      <a :href="twitterShareUrl" target="_blank" rel="noopener noreferrer" class="button" title="X">
        <IconsTwitter />
      </a>
      <a :href="facebookShareUrl" target="_blank" rel="noopener noreferrer" class="button" title="Facebook">
        <IconsFacebook/>
      </a>
      <a :href="linkedinShareUrl" target="_blank" rel="noopener noreferrer" class="button" title="Linkedin">
        <IconsLinkedin/>
      </a>
      <a :href="whatsappShareUrl" target="_blank" rel="noopener noreferrer" class="button" title="Whatsapp">
        <IconsWhatsapp/>
      </a>
      <button class="button" title="Copiar Link" data-action="copy-link" :data-url="postUrl" aria-label="Copiar link do post">
        <IconsLink/>
      </button>
    </div>
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
      background-color: var(--color-background);
      color: var(--color-text-primary);

      & svg{
        width: 22px;
        height: 22px;
      }

      &:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }
  }

  & .copied-message {
    margin-top: 1rem;
    color: var(--color-primary);
    text-align: left;
  }
}
</style>
