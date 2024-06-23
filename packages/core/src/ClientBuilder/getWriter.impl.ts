import CodeBlockWriter from 'code-block-writer'

export const getWriter = () =>
	new CodeBlockWriter({
		// optional options
		newLine: '\r\n', // default: "\n"
		indentNumberOfSpaces: 2, // default: 4
		useTabs: false, // default: false
		useSingleQuote: true, // default: false
	})
