import { execa } from 'execa'
import type { SandboxDriver } from '../types/SandboxDriver.js'
import { AppleContainerSandboxDriver } from './AppleContainerSandboxDriver/AppleContainerSandboxDriver.js'
import { DockerSandboxDriver } from './DockerSandboxDriver/DockerSandboxDriver.js'

type CommandRunner = typeof execa

export type SandboxRuntimeDiagnostics = {
	driverName: string
	runtimeCommand: string | null
	imageName?: string
	runtimeAvailable: boolean
	imageAvailable?: boolean
	runtimeVersion?: string
	message: string
}

export class SandboxRuntimeUnavailableError extends Error {
	public readonly diagnostics: SandboxRuntimeDiagnostics

	constructor(diagnostics: SandboxRuntimeDiagnostics) {
		super(diagnostics.message)
		this.name = 'SandboxRuntimeUnavailableError'
		this.diagnostics = diagnostics
	}
}

const getDockerCompatibleImageName = (driver: SandboxDriver): string | undefined => {
	if (driver instanceof DockerSandboxDriver || driver instanceof AppleContainerSandboxDriver) {
		return driver.getImageName()
	}
	return undefined
}

const isDockerCompatibleDriver = (driver: SandboxDriver) =>
	driver instanceof DockerSandboxDriver || driver instanceof AppleContainerSandboxDriver

export const getSandboxRuntimeDiagnostics = async (
	driver: SandboxDriver,
	commandRunner: CommandRunner = execa,
): Promise<SandboxRuntimeDiagnostics> => {
	if (!isDockerCompatibleDriver(driver)) {
		return {
			driverName: driver.name,
			runtimeCommand: null,
			runtimeAvailable: true,
			message: `No runtime diagnostics are implemented for driver ${driver.name}.`,
		}
	}

	const imageName = getDockerCompatibleImageName(driver)
	const runtimeCommand = 'docker'

	try {
		const versionResult = await commandRunner(runtimeCommand, ['version', '--format', '{{.Server.Version}}'])
		const runtimeVersion = versionResult.stdout.trim() || undefined

		if (!imageName) {
			return {
				driverName: driver.name,
				runtimeCommand,
				runtimeAvailable: true,
				runtimeVersion,
				message: `${driver.name} runtime is available.`,
			}
		}

		const imageCheck = await commandRunner(runtimeCommand, ['image', 'inspect', imageName], {
			reject: false,
		})

		if (imageCheck.exitCode !== 0) {
			return {
				driverName: driver.name,
				runtimeCommand,
				imageName,
				runtimeAvailable: true,
				imageAvailable: false,
				runtimeVersion,
				message: `Sandbox image ${imageName} is not available locally for ${driver.name}.`,
			}
		}

		return {
			driverName: driver.name,
			runtimeCommand,
			imageName,
			runtimeAvailable: true,
			imageAvailable: true,
			runtimeVersion,
			message: `${driver.name} runtime and sandbox image ${imageName} are available.`,
		}
	} catch (error: any) {
		return {
			driverName: driver.name,
			runtimeCommand,
			imageName,
			runtimeAvailable: false,
			imageAvailable: false,
			message: `Sandbox runtime command ${runtimeCommand} is not available for ${driver.name}: ${error.message}`,
		}
	}
}

export const assertSandboxRuntimeAvailable = async (
	driver: SandboxDriver,
	commandRunner: CommandRunner = execa,
): Promise<SandboxRuntimeDiagnostics> => {
	const diagnostics = await getSandboxRuntimeDiagnostics(driver, commandRunner)

	if (!diagnostics.runtimeAvailable || diagnostics.imageAvailable === false) {
		throw new SandboxRuntimeUnavailableError(diagnostics)
	}

	return diagnostics
}
