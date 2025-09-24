<script setup lang="ts">
const { currentPage, totalPages, baseUrl } = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <nav class="pagination-container" aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <NuxtLink
          :to="`${baseUrl}?page=${currentPage - 1}`"
          class="page-link"
          aria-label="Previous"
          :tabindex="currentPage === 1 ? -1 : 0"
        >
        <span class="sr-only">&laquo; Previous</span>
        </NuxtLink>
      </li>

      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <NuxtLink :to="`${baseUrl}?page=${page}`" class="page-link">{{
          page
        }}</NuxtLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <NuxtLink
          :to="`${baseUrl}?page=${currentPage + 1}`"
          class="page-link"
          aria-label="Next"
          :tabindex="currentPage === totalPages ? -1 : 0"
        >
          <span class="sr-only">Next &raquo;</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;

  & .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    & .page-item {
      margin: 0 0.25rem;

      & .page-link {
        display: block;
        padding: 0.5rem 0.75rem;
        line-height: 1.25;
        color: var(--color-primary);
        text-decoration: none;
        transition: color 0.2s ease, background-color 0.2s ease;
        border-radius: 0.25rem;
        background-color: transparent;

        &:hover {
          color: var(--color-primary-hover);
          background-color: var(--color-background-hover);
        }
      }
      &.active .page-link {
        color: var(--color-text-primary);
        background-color: var(--color-background);
        filter: brightness(95%);
      }

      &.disabled .page-link {
        color: var(--color-text-secondary);
        pointer-events: none;
        opacity: 0.6;
      }
    }
  }
}
</style>