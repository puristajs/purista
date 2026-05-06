import type { PuristaCommandMode } from '../../core/types.js'

export const getCommandMode = (options: {
	interactive?: boolean
	nonInteractive?: boolean
	yes?: boolean
	defaults?: boolean
}) => {
	if (options.nonInteractive || options.yes || options.defaults) {
		return 'non-interactive' satisfies PuristaCommandMode
	}

	if (options.interactive) {
		return 'interactive' satisfies PuristaCommandMode
	}

	return process.stdin.isTTY && process.stdout.isTTY ? ('interactive' satisfies PuristaCommandMode) : 'non-interactive'
}
