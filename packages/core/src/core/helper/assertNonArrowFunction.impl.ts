export const assertNonArrowFunction = (fn: (...args: any[]) => unknown, label: string) => {
	const source = fn.toString().trim()
	const isArrowFunction = /^(async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.test(source)

	if (isArrowFunction) {
		throw new Error(
			`${label} must use function syntax to access "this". Arrow functions capture lexical "this" and will not work.`,
		)
	}
}
