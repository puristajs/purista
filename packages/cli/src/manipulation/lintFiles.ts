/* eslint-disable no-console */
import { ESLint } from 'eslint'

export const lintFiles = async (files: string[]) => {
  files.forEach((file) => console.log('👷🏗️ -> lint ', file))

  const eslint = new ESLint({ fix: true })

  // 2. Lint files.
  const results = await eslint.lintFiles(files)
  await ESLint.outputFixes(results)

  console.log('👍  -> done linting')
}
