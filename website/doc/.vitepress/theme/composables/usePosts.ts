import { useData, useRoute } from 'vitepress'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import type { Post } from './posts.data.js'
import { data } from './posts.data.js'

export default () => {
	const { site } = useData()

	const allPosts: Ref<Post[]> = ref(data)

	const route = useRoute()

	const path = route.path

	function findCurrentIndex() {
		return allPosts.value.findIndex(p => `${p.href}` === route.path)
	}

	const currentPost = computed(() => allPosts.value[findCurrentIndex()])
	const nextPost = computed(() => allPosts.value[findCurrentIndex() - 1])
	const prevPost = computed(() => allPosts.value[findCurrentIndex() + 1])

	return { allPosts, currentPost, nextPost, prevPost, path }
}
