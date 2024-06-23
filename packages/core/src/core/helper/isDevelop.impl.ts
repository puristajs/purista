/**
 * returns true if NODE_ENV is set to value starting with "develop"
 *
 * @group Helper
 */
export const isDevelop = (): boolean => {
	const nodeEnv = process.env.NODE_ENV

	return nodeEnv ? nodeEnv.toLowerCase().startsWith('develop') : false
}
