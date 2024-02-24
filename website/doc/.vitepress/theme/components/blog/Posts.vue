<script setup lang="ts">
import usePosts from '../../composables/usePosts.js'

const { allPosts: posts } = usePosts()
</script>

<template>
  <div class="items">
    <template v-for="post of posts">
      <Post :post="post" class="item" />
    </template>
  </div>
</template>

<style scoped>
.items {
  display: grid;
  gap: 1rem;
  margin: 0 auto;
  max-width: 1152px;
}

.item {
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition:
    border-color 0.25s,
    background-color 0.25s;
  padding: 24px;
  text-decoration: none;
}

@media (min-width: 600px) {
  .items {
    grid-template-columns: repeat(2, 1fr);
  }
}

.item:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
