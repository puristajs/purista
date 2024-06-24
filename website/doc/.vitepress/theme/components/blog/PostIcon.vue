<script setup lang="ts">
import type { Post } from '../../composables/posts.data.js'

const props = defineProps<{
	post: Post
}>()

const category: string = props.post.data.category ? props.post.data.category : 'Article'
</script>

<template>
    <div>
        <div v-if="category === 'Article'" class="i-heroicons-outline-book-open mr-2" />
        <div v-if="category === 'Tutorial'" class="i-heroicons-outline-academic-cap mr-2" />
        <div v-if="category === 'Document'" class="i-heroicons-outline-document mr-2" />
        <span>{{ category }}</span>
    </div>
</template>

<style scoped>
</style>
