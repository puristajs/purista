import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { Feed } from 'feed'
import { type HeadConfig, type SiteConfig, createContentLoader, defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

const hostname: string = 'https://purista.dev'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	outDir: '../../docs',
	lang: 'en-US',
	head: [
		['link', { rel: 'stylesheet', type: 'text/css', media: 'all', href: '/cookieconsent.css' }],
		['script', { src: '/cookieconsent2.js' }],
		['script', { src: '/cookieconsent-init2.js' }],
	],
	title: 'PURISTA',
	//appearance: false,
	description:
		'The typescript/javascript framework for building nodejs backend services and api in modern, modular and scalable way',
	sitemap: {
		hostname: 'https://purista.dev',
	},
	transformHead: ({ pageData, page }) => {
		const head: HeadConfig[] = []

		head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title ?? 'PURISTA' }])
		head.push(['meta', { property: 'og:url', content: new URL(page.replace('.md', '.html'), hostname).toString() }])
		head.push([
			'meta',
			{
				property: 'og:description',
				content:
					pageData.frontmatter.description ??
					'The typescript/javascript framework for building nodejs backend services and api in modern, modular and scalable way',
			},
		])
		head.push(['meta', { property: 'og:type', content: 'website' }])
		head.push(['meta', { property: 'twitter:card', content: 'summary_large_image' }])
		head.push(['meta', { property: 'twitter:site', content: '@purista_js' }])
		head.push(['meta', { property: 'twitter:creator', content: '@purista_js' }])

		if (pageData.frontmatter.image?.length) {
			head.push(['meta', { property: 'og:image', content: new URL(pageData.frontmatter.image, hostname).toString() }])
		} else {
			head.push([
				'meta',
				{
					property: 'og:image',
					content: `https://ogpreview-ten.vercel.app/api/og?title=${encodeURIComponent(pageData.frontmatter.title ?? 'PURISTA')}&description=${encodeURIComponent(pageData.frontmatter.description ?? 'The typescript/javascript framework for building nodejs backend services and api in modern, modular and scalable way')}`,
				},
			])
		}

		return head
	},

	ignoreDeadLinks: [/^https?:\/\/localhost/, /^https?:\/\/127.0.0.1/],

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		search: {
			provider: 'local',
		},
		logo: '/purista_logo.png',
		editLink: {
			pattern: 'https://github.com/puristajs/purista/tree/master/website/doc/:path',
			text: 'Edit this page on GitHub',
		},
		outline: 'deep',
		lastUpdated: {
			text: 'Updated at',
			formatOptions: {
				dateStyle: 'full',
				timeStyle: 'medium',
			},
		},
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Handbook', link: '/handbook/', activeMatch: '/handbook/' },
			{ text: 'Blog', link: '/article/', activeMatch: '/article/' },
			{ text: 'API', link: '/api/README', activeMatch: '/api/' },
			{ text: 'Resources', link: '/resources/', activeMatch: '/resources/' },
		],

		sidebar: {
			...generateSidebar([
				{
					documentRootPath: 'doc',
					scanStartPath: 'handbook',
					resolvePath: '/handbook/',
					useTitleFromFileHeading: true,
					hyphenToSpace: true,
					capitalizeFirst: true,
					underscoreToSpace: true,
					useTitleFromFrontmatter: true,
					useFolderTitleFromIndexFile: true,
					useFolderLinkFromIndexFile: true,
					sortMenusByFrontmatterOrder: true,
					includeRootIndexFile: true,
					includeEmptyFolder: true,
					capitalizeEachWords: true,
					collapseDepth: 1,
				},
				{
					documentRootPath: 'doc',
					scanStartPath: 'article',
					resolvePath: '/article/',
					useTitleFromFileHeading: true,
					hyphenToSpace: true,
					capitalizeFirst: true,
					underscoreToSpace: true,
					useTitleFromFrontmatter: true,
					useFolderTitleFromIndexFile: true,
					useFolderLinkFromIndexFile: true,
					sortMenusByFrontmatterOrder: true,
					includeRootIndexFile: true,
					includeEmptyFolder: true,
					capitalizeEachWords: true,
					collapseDepth: 2,
					sortMenusOrderByDescending: true,
				},
				{
					documentRootPath: 'doc',
					scanStartPath: 'resources',
					resolvePath: '/resources/',
					useTitleFromFileHeading: true,
					hyphenToSpace: true,
					capitalizeFirst: true,
					underscoreToSpace: true,
					useTitleFromFrontmatter: true,
					useFolderTitleFromIndexFile: true,
					useFolderLinkFromIndexFile: true,
					sortMenusByFrontmatterOrder: true,
					includeRootIndexFile: true,
					includeEmptyFolder: true,
					capitalizeEachWords: true,
					collapseDepth: 2,
				},
			]),
			api: [
				{
					text: 'Core',
					items: [
						{
							text: '@purista/core',
							link: '/api/modules/purista_core.md',
						},
						{
							text: '@purista/hono-http-server',
							link: '/api/modules/purista_hono_http_server.md',
						},
						{
							text: '@purista/httpserver',
							link: '/api/modules/purista_httpserver.md',
						},
					],
				},
				{
					text: 'Event bridges',
					items: [
						{
							text: '@purista/amqpbridge',
							link: '/api/modules/purista_amqpbridge.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/modules/purista_dapr_sdk.md',
						},
						{
							text: '@purista/mqttbridge',
							link: '/api/modules/purista_mqttbridge.md',
						},
						{
							text: '@purista/natsbridge',
							link: '/api/modules/purista_natsbridge.md',
						},
					],
				},
				{
					text: 'Config stores',
					items: [
						{
							text: '@purista/aws-config-store',
							link: '/api/modules/purista_aws_config_store.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/modules/purista_dapr_sdk.md',
						},
						{
							text: '@purista/nats-config-store',
							link: '/api/modules/purista_nats_config_store.md',
						},
						{
							text: '@purista/redis-config-store',
							link: '/api/modules/purista_redis_config_store.md',
						},
					],
				},
				{
					text: 'Secret stores',
					items: [
						{
							text: '@purista/aws-secret-store',
							link: '/api/modules/purista_aws_secret_store.md',
						},
						{
							text: '@purista/azure-secret-store',
							link: '/api/modules/purista_azure_secret_store.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/modules/purista_dapr_sdk.md',
						},
						{
							text: '@purista/gcloud-secret-store',
							link: '/api/modules/purista_gcloud_secret_store.md',
						},
						{
							text: '@purista/infisical-secret-store',
							link: '/api/modules/purista_infisical_secret_store.md',
						},
					],
				},
				{
					text: 'State stores',
					items: [
						{
							text: '@purista/dapr-sdk',
							link: '/api/modules/purista_dapr_sdk.md',
						},
						{
							text: '@purista/nats-state-store',
							link: '/api/modules/purista_nats_state_store.md',
						},
						{
							text: '@purista/redis-state-store',
							link: '/api/modules/purista_redis_state_store.md',
						},
					],
				},
				{
					text: 'Deployment SDK',
					items: [
						{
							text: '@purista/dapr-sdk',
							link: '/api/modules/purista_dapr_sdk.md',
						},
						{
							text: '@purista/k8s-sdk',
							link: '/api/modules/purista_k8s_sdk.md',
						},
					],
				},
			],
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/puristajs/purista' },
			{ icon: 'twitter', link: 'https://twitter.com/purista_js' },
			{ icon: 'discord', link: 'https://discord.gg/9feaUm3H2v' },
		],
		footer: {
			message: 'Made from developers for developers with ❤️',
			copyright:
				'<a href="/privacy.html">Privacy</a> | <a href="javascript:cc.showSettings()">Cookie preferences</a> | <a href="/imprint.html">Imprint</a>',
		},
	},

	buildEnd: async (config: SiteConfig) => {
		const feed = new Feed({
			title: 'PURISTA Blog',
			description: 'Official news, updates and announcements for PURISTA typescript backend framework',
			id: hostname,
			link: hostname,
			language: 'en',
			image: 'https://purista.dev',
			favicon: `${hostname}/favicon.ico`,
			copyright: 'Copyright (c) 2023-present, Sebastian Wessel',
		})

		// You might need to adjust this if your Markdown files
		// are located in a subfolder
		const posts = await createContentLoader('*.md', {
			excerpt: true,
			render: true,
		}).load()

		posts.sort((a, b) => +new Date(b.frontmatter.date as string) - +new Date(a.frontmatter.date as string))

		for (const { url, excerpt, frontmatter, html } of posts) {
			feed.addItem({
				title: frontmatter.title,
				id: `${hostname}${url}`,
				link: `${hostname}${url}`,
				description: excerpt,
				content: html,
				author: [
					{
						name: 'Sebastian Wessel',
						email: 'info@purista.dev',
						link: 'https://sebastianwessel.de',
					},
				],
				date: frontmatter.date,
			})
		}

		writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
	},
})
