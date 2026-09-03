#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const directory = dirname(fileURLToPath(import.meta.url))
const bankRoot = resolve(directory, '..')
const repoRoot = resolve(bankRoot, '../..')
const contentRoot = join(repoRoot, 'web/src/content/tutorials')
const course = JSON.parse(await readFile(join(directory, 'course.json'), 'utf8'))
const { values } = parseArgs({
	options: {
		chapter: { type: 'string' },
		'structure-only': { type: 'boolean' },
	},
})

const draftChapters = course.chapters.filter(chapter => chapter.status === 'draft')
const selectedChapters = values.chapter
	? draftChapters.filter(chapter => chapter.id === values.chapter)
	: draftChapters
const snippetMismatches = []

assert(selectedChapters.length > 0, values.chapter ? `Unknown draft chapter: ${values.chapter}` : 'No draft chapters found')
assert.equal(course.chapters.length, course.plannedChapters, 'plannedChapters must equal the number of declared chapters')

const exists = path =>
	stat(path).then(
		() => true,
		() => false,
	)

function run(command, args, cwd) {
	return new Promise((resolveRun, reject) => {
		const child = spawn(command, args, {
			cwd,
			stdio: 'inherit',
			env: { ...process.env, CI: '1' },
		})
		child.once('error', reject)
		child.once('exit', (code, signal) => {
			if (code === 0) resolveRun()
			else reject(new Error(`${command} ${args.join(' ')} failed (${code ?? signal})`))
		})
	})
}

function assertPublishedDependencySpec(chapterId, packageName, version) {
	assert.equal(typeof version, 'string', `${chapterId}: ${packageName} must have a version`)
	assert(
		!/^(?:file|link|workspace):|^(?:\.\.?[/\\]|[/\\])/.test(version),
		`${chapterId}: ${packageName} must use a published npm version, received ${version}`,
	)
}

async function assertServiceBoundaries(chapterId, projectRoot) {
	const serviceRoot = join(projectRoot, 'src/service')
	if (!(await exists(serviceRoot))) return
	const serviceNames = (await readdir(serviceRoot, { withFileTypes: true }))
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name.toLowerCase())
	assert(!serviceNames.includes('banking'), `${chapterId}: use capability services instead of an umbrella banking service`)
}

function sourcePathFromTitle(title) {
	if (!/^(?:src|ui|public|skills)\//.test(title) && !/^(?:package\.json|purista\.json|compose\.yaml|sandbox\.Dockerfile)$/.test(title))
		return undefined
	return title
}

function codeTokens(value) {
	return (
		value.match(
			/\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|(?:\d[\d_]*\.?[\d_]*|\.[\d_]+)|[A-Za-z_$][A-Za-z0-9_$]*|===|!==|=>|\?\?|\?\.|\.\.\.|\S/g,
		) ?? []
	).filter(token => !token.startsWith('//') && !token.startsWith('/*') && !token.startsWith('#') && token !== '...')
}

async function assertSnippetMatchesSource(page, sourcePath, snippet, fullPath) {
	const sourceTokens = codeTokens(await readFile(fullPath, 'utf8'))
	const snippetTokens = codeTokens(snippet)
	let sourceIndex = 0
	for (const token of snippetTokens) {
		const foundAt = sourceTokens.indexOf(token, sourceIndex)
		if (foundAt === -1) {
			snippetMismatches.push(`${page}: ${sourcePath} does not contain the shown token in order: ${token}`)
			return
		}
		sourceIndex = foundAt + 1
	}
}

async function inspectTutorialPage(chapter, page) {
	const pagePath = join(contentRoot, `${page}.mdx`)
	assert(await exists(pagePath), `${chapter.id}: missing tutorial page ${page}.mdx`)
	const source = await readFile(pagePath, 'utf8')
	const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1]
	assert(frontmatter, `${page}: missing frontmatter`)
	for (const field of ['title', 'description', 'order', 'kind', 'status'])
		assert(new RegExp(`^${field}:\\s+\\S`, 'm').test(frontmatter), `${page}: missing ${field} frontmatter`)
	assert(/^kind:\s+lesson$/m.test(frontmatter), `${page}: tutorial steps must use kind: lesson`)
	assert(/^status:\s+draft$/m.test(frontmatter), `${page}: draft chapter page must use status: draft`)
	assert(!/\b(?:file|link|workspace):\.?(?:\.\/|\/)/.test(source), `${page}: contains a local package dependency`)
	assert(!/manual(?:ly)? cop(?:y|ied)|copy packages? from (?:the )?monorepo/i.test(source), `${page}: describes a development-only package copy`)
	for (const inline of source.matchAll(/`((?:src|ui|public|skills|scripts)\/[A-Za-z0-9_@./-]+\.[A-Za-z0-9]+)`/g)) {
		const fullPath = join(bankRoot, 'chapters', chapter.id, inline[1])
		assert(await exists(fullPath), `${page}: referenced source does not exist: ${inline[1]}`)
	}

	const blocks = [...source.matchAll(/^```(\w+)([^\n]*)\n([\s\S]*?)^```\s*$/gm)]
	const writes = []
	let actionCount = 0
	for (const block of blocks) {
		const title = block[2].match(/title="([^"]+)"/)?.[1]
		assert(title, `${page}: every code block needs an exact file or action title`)
		const writesFile = /(?:^|\s)write(?:\s|$)/.test(block[2])
		const replaysCommand = /replay="(?:parent|project|server|request)"/.test(block[2])
		if (writesFile || replaysCommand) actionCount++
		const sourcePath = sourcePathFromTitle(title)
		if (sourcePath) {
			const fullPath = join(bankRoot, 'chapters', chapter.id, sourcePath)
			assert(await exists(fullPath), `${page}: referenced source does not exist: ${sourcePath}`)
			if (chapter.constructionVerified && writesFile) {
				assert.equal(
					block[3].trimEnd(),
					(await readFile(fullPath, 'utf8')).trimEnd(),
					`${page}: write block must contain the complete current ${sourcePath}`,
				)
				writes.push(sourcePath)
			} else await assertSnippetMatchesSource(page, sourcePath, block[3], fullPath)
		}
	}
	if (chapter.constructionVerified) assert(actionCount > 0, `${page}: verified construction page has no file edit or command`)
	return { source, writes }
}

async function inspectChapter(chapter) {
	const projectRoot = join(bankRoot, 'chapters', chapter.id)
	assert(await exists(projectRoot), `${chapter.id}: missing retained example project`)
	const packageJsonPath = join(projectRoot, 'package.json')
	assert(await exists(packageJsonPath), `${chapter.id}: missing package.json`)
	const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
	assert(packageJson.dependencies?.['@purista/core'], `${chapter.id}: tutorial backend must use PURISTA Framework`)
	for (const [name, version] of Object.entries({ ...packageJson.dependencies, ...packageJson.devDependencies }))
		assertPublishedDependencySpec(chapter.id, name, version)
	for (const script of ['build', 'test', 'lint', 'start'])
		assert.equal(typeof packageJson.scripts?.[script], 'string', `${chapter.id}: missing npm run ${script}`)
	if (packageJson.scripts.start.includes('tsx')) {
		assertPublishedDependencySpec(chapter.id, 'tsx', packageJson.devDependencies?.tsx ?? packageJson.dependencies?.tsx)
	}

	const inspectedPages = []
	for (const page of chapter.pages) inspectedPages.push(await inspectTutorialPage(chapter, page))
	const fullTutorial = inspectedPages.map(page => page.source).join('\n')
	for (const command of fullTutorial.matchAll(/npm run (add:[a-z0-9:-]+)/g))
		assert(packageJson.scripts?.[command[1]], `${chapter.id}: tutorial uses missing package script ${command[1]}`)
	if (chapter.constructionVerified) {
		const writes = inspectedPages.flatMap(page => page.writes)
		assert.equal(new Set(writes).size, writes.length, `${chapter.id}: a complete file is written more than once`)
		assert.deepEqual(
			[...writes].sort(),
			[...(chapter.requiredWrittenFiles ?? [])].sort(),
			`${chapter.id}: required construction files and complete write blocks differ`,
		)
	}

	await assertServiceBoundaries(chapter.id, projectRoot)
	process.stdout.write(`Checked draft tutorial structure: ${chapter.id}\n`)
	return { chapter, projectRoot }
}

const inspected = []
for (const chapter of selectedChapters) inspected.push(await inspectChapter(chapter))

if (snippetMismatches.length > 0) {
	for (const mismatch of snippetMismatches) process.stderr.write(`- ${mismatch}\n`)
	assert.equal(snippetMismatches.length, 0, `${snippetMismatches.length} tutorial source excerpt mismatch(es)`)
}

if (!values['structure-only']) {
	for (const { chapter, projectRoot } of inspected) {
		process.stdout.write(`\nVerify draft consumer project: ${chapter.id}\n`)
		for (const script of ['build', 'test', 'lint']) await run('npm', ['run', script], projectRoot)
	}
}

process.stdout.write(
	`Verified ${inspected.length} draft tutorial project(s)${values['structure-only'] ? ' structurally' : ' with build, tests, and lint'}.\n`,
)
