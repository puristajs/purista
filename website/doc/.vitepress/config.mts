import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { Feed } from 'feed'
import { createContentLoader, defineConfig, type HeadConfig, type SiteConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

const hostname: string = 'https://purista.dev'

type SidebarGroup = {
	text: string
	link?: string
	items?: SidebarGroup[]
	collapsed?: boolean
}

const handbookSidebarConfig = generateSidebar([
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
])['/handbook/'] as { base: string; items: SidebarGroup[] }

const aiAgentsSection = handbookSidebarConfig.items.find(
	item => item.link === '2_building_business-logic/agent/index.md',
)
if (aiAgentsSection) {
	aiAgentsSection.text = 'AI Agents'
	aiAgentsSection.items = [
		...(aiAgentsSection.items ?? []),
		{
			text: 'Sandbox Runtime',
			link: '3_eco_system/sandbox',
		},
	]
}

const ecosystemSection = handbookSidebarConfig.items.find(item => item.link === '3_eco_system/index.md')
if (ecosystemSection?.items) {
	ecosystemSection.items = ecosystemSection.items.filter(item => item.link !== '3_eco_system/sandbox')
}

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
			'/handbook/': handbookSidebarConfig,
			...generateSidebar([
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
							link: '/api/@purista/core/README.md',
						},
						{
							text: '@purista/base-http-bridge',
							link: '/api/@purista/base-http-bridge/README.md',
						},
						{
							text: '@purista/hono-http-server',
							link: '/api/@purista/hono-http-server/README.md',
						},
					],
				},
				{
					text: 'Tooling',
					items: [
						{
							text: '@purista/cli',
							link: '/api/@purista/cli/README.md',
						},
					],
				},
				{
					text: 'Event bridges',
					items: [
						{
							text: '@purista/amqpbridge',
							link: '/api/@purista/amqpbridge/README.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/@purista/dapr-sdk/README.md',
						},
						{
							text: '@purista/mqttbridge',
							link: '/api/@purista/mqttbridge/README.md',
						},
						{
							text: '@purista/natsbridge',
							link: '/api/@purista/natsbridge/README.md',
						},
					],
				},
				{
					text: 'Queue bridges',
					items: [
						{
							text: '@purista/redis-queue-bridge',
							link: '/api/@purista/redis-queue-bridge/README.md',
						},
						{
							text: '@purista/nats-queue-bridge',
							link: '/api/@purista/nats-queue-bridge/README.md',
						},
					],
				},
				{
					text: 'Config stores',
					items: [
						{
							text: '@purista/aws-config-store',
							link: '/api/@purista/aws-config-store/README.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/@purista/dapr-sdk/README.md',
						},
						{
							text: '@purista/nats-config-store',
							link: '/api/@purista/nats-config-store/README.md',
						},
						{
							text: '@purista/redis-config-store',
							link: '/api/@purista/redis-config-store/README.md',
						},
					],
				},
				{
					text: 'Secret stores',
					items: [
						{
							text: '@purista/aws-secret-store',
							link: '/api/@purista/aws-secret-store/README.md',
						},
						{
							text: '@purista/azure-secret-store',
							link: '/api/@purista/azure-secret-store/README.md',
						},
						{
							text: '@purista/dapr-sdk',
							link: '/api/@purista/dapr-sdk/README.md',
						},
						{
							text: '@purista/gcloud-secret-store',
							link: '/api/@purista/gcloud-secret-store/README.md',
						},
						{
							text: '@purista/infisical-secret-store',
							link: '/api/@purista/infisical-secret-store/README.md',
						},
						{
							text: '@purista/vault-secret-store',
							link: '/api/@purista/vault-secret-store/README.md',
						},
					],
				},
				{
					text: 'State stores',
					items: [
						{
							text: '@purista/dapr-sdk',
							link: '/api/@purista/dapr-sdk/README.md',
						},
						{
							text: '@purista/nats-state-store',
							link: '/api/@purista/nats-state-store/README.md',
						},
						{
							text: '@purista/redis-state-store',
							link: '/api/@purista/redis-state-store/README.md',
						},
					],
				},
				{
					text: 'Deployment SDK',
					items: [
						{
							text: '@purista/dapr-sdk',
							link: '/api/@purista/dapr-sdk/README.md',
						},
						{
							text: '@purista/k8s-sdk',
							link: '/api/@purista/k8s-sdk/README.md',
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
