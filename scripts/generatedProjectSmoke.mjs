#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = join(repositoryRoot, 'packages')
const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const tempRoot = mkdtempSync(join(tmpdir(), 'purista-generated-project-'))
const packDirectory = join(tempRoot, 'packs')
const bootstrapDirectory = join(tempRoot, 'bootstrap')
const applicationDirectory = join(bootstrapDirectory, 'app')
const npmCacheDirectory = join(tempRoot, 'npm-cache')
const npmEnvironment = { ...process.env, npm_config_cache: npmCacheDirectory }

const run = (command, args, cwd) =>
	execFileSync(command, args, {
		cwd,
		env: npmEnvironment,
		encoding: 'utf8',
		stdio: 'inherit',
	})

const runCaptured = (command, args, cwd) => {
	const result = spawnSync(command, args, {
		cwd,
		env: npmEnvironment,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	if (result.error) {
		throw result.error
	}
	if (result.status !== 0) {
		throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`)
	}
	if (result.stderr.trim()) {
		throw new Error(`${command} ${args.join(' ')} wrote diagnostics to stderr:\n${result.stderr}`)
	}
	return result.stdout
}

const packWorkspacePackage = packageName => {
	const directory = join(packageRoot, packageName)
	const output = execFileSync(npmExecutable, ['pack', '--json', '--pack-destination', packDirectory], {
		cwd: directory,
		env: npmEnvironment,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	const [packed] = JSON.parse(output)
	if (!packed?.filename) {
		throw new Error(`npm pack did not report an artifact for ${packageName}`)
	}
	return join(packDirectory, packed.filename)
}

const localTarballReference = (targetDirectory, tarball) => `file:${relative(targetDirectory, tarball)}`

try {
	mkdirSync(packDirectory, { recursive: true })
	mkdirSync(bootstrapDirectory, { recursive: true })
	mkdirSync(npmCacheDirectory, { recursive: true })
	run(npmExecutable, ['run', 'build'], join(packageRoot, 'core'))
	run(npmExecutable, ['run', 'build'], join(packageRoot, 'cli'))

	const coreTarball = packWorkspacePackage('core')
	const cliTarball = packWorkspacePackage('cli')

	writeFileSync(
		join(bootstrapDirectory, 'package.json'),
		`${JSON.stringify(
			{
				private: true,
				type: 'module',
				dependencies: {
					'@purista/core': localTarballReference(bootstrapDirectory, coreTarball),
				},
				devDependencies: {
					'@purista/cli': localTarballReference(bootstrapDirectory, cliTarball),
				},
			},
			null,
			2,
		)}\n`,
	)
	run(npmExecutable, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], bootstrapDirectory)

	run(
		process.execPath,
		[
			join(bootstrapDirectory, 'node_modules', '@purista', 'cli', 'dist', 'bin.js'),
			'init',
			'app',
			'--runtime',
			'node',
			'--event-bridge',
			'default',
			'--telemetry',
			'otel',
			'--no-webserver',
			'--linter',
			'none',
			'--formatter',
			'none',
			'--package-manager',
			'npm',
			'--non-interactive',
			'--defaults',
			'--no-install',
		],
		bootstrapDirectory,
	)

	const applicationPackagePath = join(applicationDirectory, 'package.json')
	const applicationPackage = JSON.parse(readFileSync(applicationPackagePath, 'utf8'))
	if (
		!applicationPackage.dependencies['@opentelemetry/api'] ||
		!applicationPackage.dependencies['@opentelemetry/sdk-metrics']
	) {
		throw new Error('Generated OpenTelemetry project did not declare its required OpenTelemetry packages.')
	}
	applicationPackage.dependencies['@purista/core'] = localTarballReference(applicationDirectory, coreTarball)
	applicationPackage.devDependencies['@purista/cli'] = localTarballReference(applicationDirectory, cliTarball)
	writeFileSync(applicationPackagePath, `${JSON.stringify(applicationPackage, null, 2)}\n`)

	run(npmExecutable, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], applicationDirectory)
	run(npmExecutable, ['run', 'add:service', '--', 'ledger', '--description', 'Ledger service'], applicationDirectory)
	run(
		npmExecutable,
		[
			'run',
			'add:schedule',
			'--',
			'daily ledger close',
			'--description',
			'Emit the daily ledger close trigger',
			'--service',
			'ledger',
			'--service-version',
			'1',
			'--event',
			'ledger.daily_close_due',
			'--cron',
			'0 2 * * *',
			'--scheduler-group',
			'ledger',
		],
		applicationDirectory,
	)
	run(
		npmExecutable,
		[
			'run',
			'add:subscription',
			'--',
			'start-ledger-close',
			'--description',
			'Starts the daily ledger close workflow',
			'--service',
			'ledger',
			'--service-version',
			'1',
			'--event',
			'ledgerDailyCloseDue',
		],
		applicationDirectory,
	)
	run(npmExecutable, ['run', 'build'], applicationDirectory)
	run(npmExecutable, ['run', 'test'], applicationDirectory)
	run(npmExecutable, ['run', 'export:definitions'], applicationDirectory)

	const definitions = JSON.parse(readFileSync(join(applicationDirectory, 'purista.definitions.json'), 'utf8'))
	if (Object.keys(definitions.services ?? {}).length !== 2) {
		throw new Error('Generated definition inventory did not include both the scaffolded and added service.')
	}

	run(
		process.execPath,
		[
			join(applicationDirectory, 'node_modules', '@purista', 'cli', 'dist', 'bin.js'),
			'export',
			'schedule-manifest',
			'--definitions',
			'purista.definitions.json',
			'--out',
			'purista.schedules.json',
		],
		applicationDirectory,
	)
	const scheduleManifest = JSON.parse(readFileSync(join(applicationDirectory, 'purista.schedules.json'), 'utf8'))
	if (scheduleManifest.schedules?.length !== 1 || scheduleManifest.schedules[0]?.targetName !== 'ledgerDailyCloseDue') {
		throw new Error('Generated schedule export did not include the CLI-created event trigger.')
	}

	const validationOutput = runCaptured(
		process.execPath,
		[
			join(applicationDirectory, 'node_modules', '@purista', 'cli', 'dist', 'bin.js'),
			'validate',
			'--definitions',
			'purista.definitions.json',
			'--strict',
			'--format',
			'json',
		],
		applicationDirectory,
	)
	let validation
	try {
		validation = JSON.parse(validationOutput)
	} catch (error) {
		throw new Error(
			`Generated project static validation did not produce JSON-only stdout:\n${validationOutput}\n${String(error)}`,
		)
	}
	if (validation.kind !== 'purista.architecture.diagnostics') {
		throw new Error('Generated project static validation did not produce the architecture diagnostics contract.')
	}

	const inspectOutput = runCaptured(npmExecutable, ['run', 'inspect:architecture'], applicationDirectory)
	const inspect = JSON.parse(inspectOutput)
	if (inspect.kind !== 'purista.architecture.context') {
		throw new Error('Generated project inspect:architecture script did not produce an architecture context.')
	}

	const generatedValidation = JSON.parse(
		runCaptured(npmExecutable, ['run', 'validate:architecture'], applicationDirectory),
	)
	if (generatedValidation.kind !== 'purista.architecture.diagnostics') {
		throw new Error('Generated project validate:architecture script did not produce architecture diagnostics.')
	}

	const doctor = JSON.parse(runCaptured(npmExecutable, ['run', 'doctor:architecture'], applicationDirectory))
	if (doctor.kind !== 'purista.doctor' || doctor.mode !== 'static') {
		throw new Error('Generated project doctor:architecture script did not produce static doctor output.')
	}

	process.stdout.write('Generated project clean-install smoke passed.\n')
} finally {
	rmSync(tempRoot, { force: true, recursive: true })
}
