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
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
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
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

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