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
    ['meta', { name: 'twitter:image', content: 'https://purista.dev/preview.png' }],
    ['meta', { name: 'og:image:width', content: '1200' }],
    ['meta', { name: 'og:image:height', content: '630' }],
  ],
})
