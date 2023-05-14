import { defineUserConfig } from 'vuepress'

import theme from './themeConfig'

export default defineUserConfig({
  lang: 'en-US',
  title: 'PURISTA',
  description:
    'The typescript/javascript framework for building nodejs backend services and api in modern, modular and scalable way',

  dest: '../docs',
  base: '/',

  head: [
    ['link', { rel: 'stylesheet', type: 'text/css', media: 'all', href: '/cookieconsent.css' }],
    ['script', { src: '/cookieconsent.js', defer: true }],
    ['script', { src: '/cookieconsent-init.js', defer: true }],
  ],

  theme,
})
