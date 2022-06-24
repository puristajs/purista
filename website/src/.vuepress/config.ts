import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { defineUserConfig } from 'vuepress'

import theme from './themeConfig'

export default defineUserConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description: 'A framework for building backend services and api in modern, modular and scalable way',

  dest: '../docs',
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

  plugins: [googleAnalyticsPlugin({ id: 'G-02L3K7YXXK' })],

  theme,
})
