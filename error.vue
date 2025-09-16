<template>
  <TheHeader/>
  <div class="page-error">
    <h1>Error {{ error?.status }}</h1>
    <p>{{ error?.message }}</p>
    <button @click="handleError">Home</button>
  </div>
  <TheFooter class="page-error-footer"/>
</template>
<script setup lang="ts">
import { clearError, useHead } from 'nuxt/app';

//import './assets/css/error.css';
const { error } = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});
const handleError = () => clearError({ redirect: "/" });

useHead({
  style: [
    {
      innerHTML: `.page-error {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: auto;
      max-width: 1000px;
      height: 100vh;
      text-align: center;
    }
    .page-error button {
    max-width: 200px;
    font-size: 1rem;
    padding: .2rem 1rem;
    cursor: pointer;
    }`,
    },
  ],
});
</script>
