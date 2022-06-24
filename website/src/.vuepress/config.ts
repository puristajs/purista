import { defineUserConfig } from 'vuepress'

import theme from './themeConfig'

export default defineUserConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description: 'A framework for building backend services and api in modern, modular and scalable way',

  dest: '../docs',
  base: '/',

  theme,
})
