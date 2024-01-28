<script setup lang="ts">
import { useData } from 'vitepress'
import usePosts from '../../composables/usePosts.js'

const { site } = useData()

const { currentPost: post, path, prevPost, nextPost } = usePosts()
</script>

<template>
    <div class="container">
        <h1>{{ post.title }}</h1>
        <img v-if="post.data.image" :src="`${post.data.image}`" :alt="`${post.title}`" style="margin-top:24px">
        <div style="margin-top:24px">
            <slot />
        </div>
    </div>
</template>

<style scoped>
</style>
