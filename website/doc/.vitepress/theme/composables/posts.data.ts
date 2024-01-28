import fs from 'node:fs'
import path from 'node:path'
import type { MarkdownRenderer } from 'vitepress'
import { createMarkdownRenderer } from 'vitepress'
import { formatDistance } from 'date-fns'
import useBlogFile from './useBlogFile.js'

let md: MarkdownRenderer
const { folderDir, readFrontMatter } = useBlogFile()

const dir = folderDir('article')

export interface Post {
  title: string
  href: string
  date: {
    time: number
    string: string
    since: string
  }
  excerpt: string | undefined
  data: Record<string, any>
}

declare const data: Post[]
export { data }

async function load(): Promise<Post[]>
async function load() {
  md = md || (await createMarkdownRenderer(process.cwd()))

  return fs
    .readdirSync(dir)
    .filter(file=>!file.startsWith('index.'))
    .map(file => getPost(file, dir))
    .sort((a, b) => b.date.time - a.date.time)
}

export default {
  watch: path.join(dir, '*.md'),
  load,
}

const cache = new Map()

function getPost(file: string, postDir: string): Post {
  const fullPath = path.join(postDir, file)
  const timestamp = fs.statSync(fullPath).mtimeMs

  const { data, excerpt } = readFrontMatter(file, postDir, cache)

  const post: Post = {
    title: data.longTitle || data.title,
    href: `/article/${file.replace(/\.md$/, '.html')}`,
    date: formatDate(data.date),
    excerpt: excerpt && md.render(excerpt),
    data,
  }

  cache.set(fullPath, {
    timestamp,
    post,
  })
  return post
}

function formatDate(date: string | Date): Post['date'] {
  if (!(date instanceof Date))
    date = new Date(date)

  date.setUTCHours(12)

  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    since: formatDistance(date, new Date(), { addSuffix: true }),
  }
}
