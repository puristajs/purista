import { execa } from 'execa'
import { AppleContainerSandboxDriver } from '../driver/AppleContainerSandboxDriver/AppleContainerSandboxDriver.js'
import { DockerSandboxDriver } from '../driver/DockerSandboxDriver/DockerSandboxDriver.js'
import { getSandboxRuntimeDiagnostics, type SandboxRuntimeDiagnostics } from '../driver/runtimeDiagnostics.js'
import type { SandboxDriver } from '../types/SandboxDriver.js'

const DEFAULT_IMAGE_NAME = 'purista-sandbox-agent:latest'
const SANDBOX_DOCKERFILE = 'Dockerfile.sandbox'

type CommandRunner = typeof execa

export type DockerCompatibleRuntimeSelection =
	| {
			available: true
			driver: SandboxDriver
			driverName: 'DockerSandboxDriver' | 'AppleContainerSandboxDriver'
			runtimeLabel: 'docker' | 'apple-container'
			imageName: string
			diagnostics: SandboxRuntimeDiagnostics
			imageBuilt: boolean
	  }
	| {
			available: false
			driverName: 'DockerSandboxDriver' | 'AppleContainerSandboxDriver'
			runtimeLabel: 'docker' | 'apple-container'
			imageName: string
			reason: string
			diagnostics: SandboxRuntimeDiagnostics
			imageBuilt: boolean
	  }

const resolveRuntimePreference = () => {
	const requested = process.env.PURISTA_SANDBOX_TEST_RUNTIME?.trim().toLowerCase()
	if (requested === 'docker') {
		return 'docker' as const
	}
	if (requested === 'apple' || requested === 'apple-container' || requested === 'orbstack') {
		return 'apple-container' as const
	}
	return process.platform === 'darwin' ? ('apple-container' as const) : ('docker' as const)
}

const createDriver = (runtimeLabel: 'docker' | 'apple-container', imageName: string) => {
	if (runtimeLabel === 'apple-container') {
		return {
			driverName: 'AppleContainerSandboxDriver' as const,
			driver: new AppleContainerSandboxDriver({ imageName }),
		}
	}
	return {
		driverName: 'DockerSandboxDriver' as const,
		driver: new DockerSandboxDriver({ imageName }),
	}
}

const shouldSkipImageBuild = () => process.env.PURISTA_SANDBOX_TEST_SKIP_IMAGE_BUILD === 'true'

const shouldForceImageBuild = () => process.env.PURISTA_SANDBOX_TEST_FORCE_IMAGE_BUILD === 'true'

const getPackageRoot = () => process.env.PURISTA_SANDBOX_TEST_PACKAGE_ROOT?.trim() || process.cwd()

const buildSandboxImage = async (imageName: string, commandRunner: CommandRunner) => {
	return await commandRunner('docker', ['build', '-t', imageName, '-f', SANDBOX_DOCKERFILE, '.'], {
		cwd: getPackageRoot(),
		reject: false,
	})
}

/**
 * Detects a usable docker-compatible sandbox runtime for local integration tests.
 *
 * Runtime selection rules:
 * - macOS defaults to `AppleContainerSandboxDriver`
 * - other platforms default to `DockerSandboxDriver`
 * - `PURISTA_SANDBOX_TEST_RUNTIME` can force `docker` or `apple-container`
 * - `PURISTA_SANDBOX_TEST_IMAGE` overrides the expected local image name
 * - if the runtime is available but the image is missing, the helper builds the
 *   canonical image from `packages/ai/Dockerfile.sandbox` unless explicitly disabled
 */
export const selectDockerCompatibleSandboxRuntime = async (
	commandRunner: CommandRunner = execa,
): Promise<DockerCompatibleRuntimeSelection> => {
	const runtimeLabel = resolveRuntimePreference()
	const imageName = process.env.PURISTA_SANDBOX_TEST_IMAGE?.trim() || DEFAULT_IMAGE_NAME
	const { driverName, driver } = createDriver(runtimeLabel, imageName)
	let diagnostics = await getSandboxRuntimeDiagnostics(driver, commandRunner)
	let imageBuilt = false

	const shouldAttemptBuild =
		diagnostics.runtimeAvailable &&
		(shouldForceImageBuild() || diagnostics.imageAvailable === false) &&
		!shouldSkipImageBuild()

	if (shouldAttemptBuild) {
		const buildResult = await buildSandboxImage(imageName, commandRunner)
		if (buildResult.exitCode !== 0) {
			return {
				available: false,
				driverName,
				runtimeLabel,
				imageName,
				reason:
					`Sandbox runtime is available, but automatic image build failed for ${imageName}. ` +
					`${buildResult.stderr || buildResult.stdout || 'Unknown docker build error.'}`,
				diagnostics,
				imageBuilt,
			}
		}
		imageBuilt = true
		diagnostics = await getSandboxRuntimeDiagnostics(driver, commandRunner)
	}

	if (!diagnostics.runtimeAvailable || diagnostics.imageAvailable === false) {
		return {
			available: false,
			driverName,
			runtimeLabel,
			imageName,
			reason: diagnostics.message,
			diagnostics,
			imageBuilt,
		}
	}

	return {
		available: true,
		driver,
		driverName,
		runtimeLabel,
		imageName,
		diagnostics,
		imageBuilt,
	}
}
