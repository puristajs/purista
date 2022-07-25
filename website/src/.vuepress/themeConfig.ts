import { hopeTheme } from 'vuepress-theme-hope'

import navbar from './navbar'

export default hopeTheme({
  hostname: 'https://purista.dev',

  author: {
    name: 'Sebastian Wessel',
    url: 'https://sebastianwessel.com',
  },

  iconPrefix: 'fa-',

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
    '/api/': [
      {
        text: 'Modules',
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
    ],
    '/api/modules': ['purista_core', 'purista_httpserver'],
  },

  footer:
    'Made from developers for developers with ❤️ | <a href="/privacy.html">Privacy</a> | <a href="javascript:cc.showSettings()">Cookie preferences</a> | <a href="/imprint.html">Imprint</a>',

  displayFooter: true,
  darkmode: 'switch',

  pageInfo: ['Author', 'Date'],
  editLink: false,

  plugins: {
    photoSwipe: false,
    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
    },
  },
})
