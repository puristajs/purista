import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import './style.css'

import { ExternalLink } from './components/ExternalLink.js'
import Post from './components/blog/Post.vue'
import PostDetail from './components/blog/PostDetail.vue'
import Posts from './components/blog/Posts.vue'
// import CookieConsentVue from './cookieconsentvue.js';

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		})
	},
	enhanceApp({ app }) {
		app.component('ExternalLink', ExternalLink)
		app.component('Posts', Posts)
		app.component('Post', Post)
		app.component('PostDetail', PostDetail)
		// app.use(CookieConsentVue)
	},
} satisfies Theme
