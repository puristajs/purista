import { defineHopeConfig } from 'vuepress-theme-hope'

import themeConfig from './themeConfig'

export default defineHopeConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description: 'A framework for building backend services and api in modern, modular and scalable way',

  base: '/',

  head: [
    [
      'script',
      {
        src: 'https://kit.fontawesome.com/61c6556d03.js',
        crossorigin: 'anonymous',
      },
    ],
  ],

  themeConfig,
})
