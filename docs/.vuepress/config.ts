import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vuepress/config'

function getSideBar(folder: string, title: string) {
  const extension = ['.md']

  const files = fs
    .readdirSync(path.join(__dirname, `/../${folder}`))
    .filter(
      (item) =>
        item.toLowerCase() !== 'readme.md' &&
        fs.statSync(path.join(__dirname, `/../${folder}`, item)).isFile() &&
        extension.includes(path.extname(item)),
    )

  return [{ title: title, children: [...files] }]
}

export default defineConfig({
  title: 'PURISTA',
  description: 'A modern backend framework',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Handbook',
        link: '/handbook/',
      },
      {
        text: 'Concept',
        link: '/concept/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/sebastianwessel/purista',
      },
    ],

    sidebar: {
      '/handbook/': getSideBar('handbook', 'Handbook'),
    },
  },
  dest: 'doc',

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      'vuepress-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['src/index.ts'],
        tsconfig: 'tsconfig.json',
        out: 'api',
        sidebar: {
          fullNames: true,
          parentCategory: 'API',
        },
      },
    ],
  ],
})
