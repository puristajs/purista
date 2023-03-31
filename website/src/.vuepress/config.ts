import { defineUserConfig } from 'vuepress'

import theme from './themeConfig'

export default defineUserConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description:
    'The typescript/javascript framework for building nodejs backend services and api in modern, modular and scalable way',

  dest: '../docs',
  base: '/',

  theme,
  head: [
    ['meta', { name: 'twitter:image', content: 'https://purista.dev/twitter.png' }],
    ['meta', { name: 'og:image:width', content: '1200' }],
    ['meta', { name: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:site', content: '@purista_js' }],
    ['meta', { name: 'twitter:title', content: 'PURISTA - The TypeScript Framework' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'PURISTA is a typescript based nodejs framework to built typescript backends for iot, edge, server, cloud and serverless.',
      },
    ],
  ],
})
