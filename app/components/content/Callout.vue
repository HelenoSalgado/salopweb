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
}

.callout-icon {
  flex-shrink: 0;
  margin-top: 0.125rem; /* Align icon nicely with text */
}

.callout-content > :first-child {
  margin-top: 0;
}

.callout-content > :last-child {
  margin-bottom: 0;
}

/* Info / Default */
.callout-info {
  border-color: #3b82f6; /* blue-500 */
  background-color: rgba(59, 130, 246, 0.05);
}
.dark .callout-info {
  background-color: rgba(59, 130, 246, 0.1);
}
.callout-info .callout-icon {
  color: #3b82f6;
}

/* Idea */
.callout-idea {
  border-color: #f59e0b; /* amber-500 */
  background-color: rgba(245, 158, 11, 0.05);
}
.dark .callout-idea {
  background-color: rgba(245, 158, 11, 0.1);
}
.callout-idea .callout-icon {
  color: #f59e0b;
}

/* Attention */
.callout-attention {
  border-color: #ef4444; /* red-500 */
  background-color: rgba(239, 68, 68, 0.05);
}
.dark .callout-attention {
  background-color: rgba(239, 68, 68, 0.1);
}
.callout-attention .callout-icon {
  color: #ef4444;
}

/* Star */
.callout-star {
  border-color: #8b5cf6; /* violet-500 */
  background-color: rgba(139, 92, 246, 0.05);
}
.dark .callout-star {
  background-color: rgba(139, 92, 246, 0.1);
}
.callout-star .callout-icon {
  color: #8b5cf6;
}
</style>
