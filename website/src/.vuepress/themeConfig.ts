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
    ],
  },
  {
    text: 'Config stores',
    children: [],
  },
  {
    text: 'Secret stores',
    children: [],
  },
  {
    text: 'State stores',
    children: [
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
    'Made from developers for developers with ❤️ | <a href="/privacy.html">Privacy</a> | <a href="javascript:cc.showSettings()">Cookie preferences</a> | <a href="/imprint.html">Imprint</a>',

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
    },
    blog: {
      filter: ({ filePathRelative }) => (filePathRelative ? filePathRelative.startsWith('posts/') : false),
      excerptFilter: ({ filePathRelative }) => (filePathRelative ? filePathRelative.startsWith('posts/') : false),
    },
    photoSwipe: true,
    mdEnhance: {
      container: true,
      mermaid: true,
      flowchart: true,
      linkCheck: true,
      codetabs: true,
      tabs: true,
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
    },
  },
})
