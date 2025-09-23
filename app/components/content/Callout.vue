<script setup>
import { computed } from 'vue'
import IconIdea from '~/components/icons/IconIdea.vue'
import IconAttention from '~/components/icons/IconAttention.vue'
import IconStar from '~/components/icons/IconStar.vue'
import IconInfo from '~/components/icons/IconInfo.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info', // Default to a simple info box
  },
})

const calloutConfig = computed(() => {
  switch (props.type) {
    case 'idea':
      return { icon: IconIdea, class: 'callout-idea' };
    case 'attention':
      return { icon: IconAttention, class: 'callout-attention' };
    case 'star':
      return { icon: IconStar, class: 'callout-star' };
    default: // 'info' or any other value
      return { icon: IconInfo, class: 'callout-info' };
  }
})
</script>

<template>
  <div class="callout" :class="calloutConfig.class">
    <div class="callout-icon">
      <component :is="calloutConfig.icon" />
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin: 1.5rem 0;
  border-left-width: 4px;
  border-radius: 6px;

  &.callout-info {
    border-color: var(--callout-info-border);
    background-color: var(--callout-info-bg);
    & .callout-icon {
      color: var(--callout-info-icon);
    }
  }

  &.callout-idea {
    border-color: var(--callout-idea-border);
    background-color: var(--callout-idea-bg);
    & .callout-icon {
      color: var(--callout-idea-icon);
    }
  }

  &.callout-attention {
    border-color: var(--callout-attention-border);
    background-color: var(--callout-attention-bg);
    & .callout-icon {
      color: var(--callout-attention-icon);
    }
  }

  &.callout-star {
    border-color: var(--callout-star-border);
    background-color: var(--callout-star-bg);
    & .callout-icon {
      color: var(--callout-star-icon);
    }
  }

  & .callout-icon {
    flex-shrink: 0;
    margin-top: 0.125rem; /* Align icon nicely with text */
  }

  & .callout-content {
    & > :first-child {
      margin-top: 0;
    }
    & > :last-child {
      margin-bottom: 0;
    }
  }
}
</style>
