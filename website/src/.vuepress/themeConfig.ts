import { hopeTheme } from 'vuepress-theme-hope'

import navbar from './navbar'

const apiSidebar = [
  {
    text: 'Core',
    children: [
      {
        text: '@purista/core',
        link: '/api/modules/purista_core.md',
      },
      {
        text: '@purista/httpserver',
        link: '/api/modules/purista_httpserver.md',
      },
    ],
  },
  {
    text: 'Event bridges',
    children: [
      {
        text: '@purista/amqpbridge',
        link: '/api/modules/purista_amqpbridge.md',
      },
      {
        text: '@purista/dapr-sdk',
        link: '/api/classes/purista_dapr_sdk.DaprEventBridge.md',
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
    children: [
      {
        text: '@purista/dapr-sdk',
        link: '/api/classes/purista_dapr_sdk.DaprConfigStore.md',
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
    children: [
      {
        text: '@purista/dapr-sdk',
        link: '/api/classes/purista_dapr_sdk.DaprSecretStore.md',
      },
    ],
  },
  {
    text: 'State stores',
    children: [
      {
        text: '@purista/dapr-sdk',
        link: '/api/classes/purista_dapr_sdk.DaprStateStore.md',
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
    children: [
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
]

export default hopeTheme({
  hostname: 'https://purista.dev',

  author: {
    name: 'Sebastian Wessel',
    url: 'https://sebastianwessel.de',
  },
  iconAssets: 'fontawesome',

  // logo: '/logo.svg',

  themeColor: false,
  headerDepth: 3,

  repo: 'sebastianwessel/purista',
  repoLabel: 'PURISTA',

  docsDir: 'docs',

  // navbar
  navbar,

  sidebar: {
    '/handbook/': 'structure',
    '/resources/': [
      {
        text: 'Resources',
        link: '/resources/readme.md',
        children: [
          {
            text: 'Books',
            link: '/resources/books.md',
          },
          {
            text: 'Articles',
            link: '/resources/articles.md',
          },
        ],
      },
    ],
    '/api/': apiSidebar,
    '/api/modules': apiSidebar,
  },

  footer:
    'Made from developers for developers with ❤️ | <a href="/privacy.html">Privacy</a> | <a href="javascript:cc.showSettings()">Cookie preferences</a> | <a rel="me" href="https://mastodon.social/@purista">mastodon@purista</a> | <a href="/imprint.html">Imprint</a>',

  displayFooter: true,
  darkmode: 'disable',
  fullscreen: true,
  hotReload: true,
  navbarAutoHide: 'mobile',
  pageInfo: ['Author', 'Date'],
  editLink: false,
  blog: {
    sidebarDisplay: 'none',
    articleInfo: ['Author', 'Date'],
    medias: {
      Twitter: 'https://twitter.com/purista_js',
      Discord: 'https://discord.gg/9feaUm3H2v',
      GitHub: 'https://github.com/sebastianwessel/purista/',
    },
  },
  plugins: {
    git: {
      createdTime: true,
      updatedTime: true,
    },
    seo: {
      fallBackImage: 'https://purista.dev/preview.png',
      twitterID: '@purista_js',
      autoDescription: true,
      customHead(head, page, _app) {
        head.push([
          'meta',
          {
            name: 'twitter:image',
            content: (page.frontmatter.cover as string | undefined) || 'https://purista.dev/twitter.png',
          },
        ])
        head.push(['meta', { name: 'twitter:image:alt', content: page.data.title }])
        /* head.push(['meta', { name: 'og:image:width', content: '1200' }])
        head.push(['meta', { name: 'og:image:height', content: '630' }]) */
        head.push(['meta', { name: 'twitter:site', content: '@purista_js' }])
        head.push(['meta', { name: 'twitter:creator', content: '@purista_js' }])
        head.push(['meta', { name: 'twitter:title', content: page.data.title }])
        head.push([
          'meta',
          {
            name: 'twitter:description',
            content: page.frontmatter.description || page.data.title,
          },
        ])
      },
    },
    blog: {
      filter: ({ filePathRelative }) => (filePathRelative ? filePathRelative.startsWith('posts/') : false),
      excerptFilter: ({ filePathRelative }) => (filePathRelative ? filePathRelative.startsWith('posts/') : false),
      hotReload: true,
    },
    photoSwipe: true,
    mdEnhance: {
      container: true,
      mermaid: true,
      flowchart: true,
      checkLinks: { status: 'dev' },
      codetabs: true,
      tabs: true,
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
    },
  },
})
