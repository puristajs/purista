import { defineHopeConfig } from 'vuepress-theme-hope'

import themeConfig from './themeConfig'

export default defineHopeConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description: 'A demo for vuepress-theme-hope',

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
