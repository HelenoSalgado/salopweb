<template>
  <NuxtLink :to="post._path" class="blog-post-card">
    <div class="blog-post-card-image-wrapper">
      <NuxtImg
        :src="post.image || '/images/default-post.png'"
        :alt="post.title"
        width="300"
        height="200"
        fit="cover"
        loading="lazy"
      />
    </div>
    <div class="blog-post-card-content">
      <h3>{{ post.title }}</h3>
      <p>{{ post.description }}</p>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.blog-post-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.blog-post-card-image-wrapper {
  width: 100%;
  height: 200px; /* Fixed height for images */
  overflow: hidden;
}

.blog-post-card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-post-card-content {
  padding: 1rem;
}

.blog-post-card-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  line-height: 1.4;
}

.blog-post-card-content p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #666;
}

/* Dark Mode */
.dark .blog-post-card {
  border-color: #333;
  background-color: #1e1e1e;
}

.dark .blog-post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .blog-post-card-content h3 {
  color: #e0e0e0;
}

.dark .blog-post-card-content p {
  color: #aaa;
}
</style>
