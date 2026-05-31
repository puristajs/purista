#!/usr/bin/env node

import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const packageDirectory = resolve(process.argv[2] ?? '.')
const repositoryRoot = resolve(import.meta.dirname, '..')
const sourceDirectory = resolve(repositoryRoot, 'skills')
const targetDirectory = resolve(packageDirectory, 'skills')

await rm(targetDirectory, { force: true, recursive: true })
await mkdir(packageDirectory, { recursive: true })
await cp(sourceDirectory, targetDirectory, { recursive: true })
