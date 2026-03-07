import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createMermaidRenderer } from 'vitepress-mermaid-renderer'
// https://vitepress.dev/guide/custom-theme
import { h, nextTick, watch } from 'vue'
import './style.css'

import Post from './components/blog/Post.vue'
import PostDetail from './components/blog/PostDetail.vue'
import Posts from './components/blog/Posts.vue'
import { ExternalLink } from './components/ExternalLink.js'

export default {
	extends: DefaultTheme,
	Layout: () => {
		const { isDark } = useData()

		const initMermaid = () => {
			createMermaidRenderer({
				theme: isDark.value ? 'dark' : 'forest',
			})
		}

		nextTick(() => initMermaid())

		watch(
			() => isDark.value,
			() => {
				initMermaid()
			},
		)

		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		})
	},
	enhanceApp({ app }) {
		app.component('ExternalLink', ExternalLink)
		app.component('Posts', Posts)
		app.component('Post', Post)
		app.component('PostDetail', PostDetail)
	},
} satisfies Theme
