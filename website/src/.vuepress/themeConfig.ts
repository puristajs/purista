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

  // sidebar
  // sidebar: sidebar,
  sidebar: {
    '/handbook/': 'structure',
    '/api/': 'structure',
  },

  footer: 'Made from developers for developers with ❤️',

  displayFooter: true,
  darkmode: 'auto-switch',

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