<script setup lang="ts">
import { useData } from 'vitepress'
import type { Post } from '../../composables/posts.data.js'

const props = defineProps<{
	post: Post
}>()
const { site } = useData()
const getImgUrl = (title: string, description: string) =>
	`https://ogpreview-ten.vercel.app/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
</script>

<template>
  <a :href="`${post.href}`" style="display: block" :title="`${post.title}`">
    <div>
      <div style="display: flex; flex-direction: row">
        <h2 style="flex-grow: 2">{{ post.title }}</h2>
        <small style="text-align: right">{{ post.date.string }}</small>
      </div>
      <img
        :src="`${post.data.image || getImgUrl(post.data.title, post.data.description)}`"
        :alt="`${post.title}`"
        style="margin-bottom: 24px"
      />
      <p v-html="post.excerpt" />
      <div class="more">Read more</div>
    </div>
  </a>
</template>

<style scoped>
h2 {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
}

.more {
  display: block;
  margin-top: 24px;
  text-align: right;
}
</style>
